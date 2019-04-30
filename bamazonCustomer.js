var inquirer = require('inquirer');
var mysql = require('mysql');

// creating database connection.
var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'R0otsNh0ots9',
    database: 'bamazon_db'
});

connection.connect(function (err) {
    if (err) throw err;
    welcome();
});

// function to display welcome message,
// then triggers inventory function.
function welcome() {
    console.log('\n\n    ~~~  WELCOME TO BAMAZON  ~~~    \n');
    dispInventory();
};

// function to display the database inventory on app launch,
// then triggers prompt function.
function dispInventory() {
    var query = 'SELECT item_id, product_name, price FROM products';
    connection.query(query, function (err, res) {
        console.log('\nCurrent Inventory: \n-------------------')
        for (var i = 0; i < res.length; i++) {
            console.log(`Item ID: ${res[i].item_id} | Item Name: ${res[i].product_name} | Item Price: $${res[i].price}`);
        };
        console.log('\n');
        startPrompt();
    });
};

var itemID = undefined;
var qtyReq = undefined;
var itemPrice = undefined;
var stockQty = undefined;

// function to inquire and capture user input.
// then triggers inventory function.
function startPrompt() {
    inquirer.prompt([{
        name: 'item_id',
        type: 'input',
        message: 'Type the ID of the item you want to purchase.'
    }, {
        name: 'qty',
        type: 'input',
        message: 'How many would you like to purchase?'
    }]).then(function (resp) {
        itemID = parseInt(resp.item_id);
        qtyReq = parseInt(resp.qty);
        inventoryCheck();
    });
};

// function to check order quantity against inventory.
// if sufficient, prompt confirmation.
// if not, send user to beginning prompt.
function inventoryCheck() {
    connection.query(
        'SELECT * FROM products WHERE ?', {
            item_id: itemID
        },
        function (err, resp) {
            if (err) throw err;
            productName = resp[0].product_name;
            stockQty = resp[0].stock_qty;
            itemPrice = resp[0].price;
            switch (stockQty > qtyReq) {
                case true:
                    confirmOrder();
                    break;

                case false:
                    console.log(`\n So sorry! We only have ${stockQty} in stock. Please select another item.\n`)
                    startPrompt();
                    break;
            };
        });
};

// function to have user confirm order total.
// if yes, trigger transactoin.
// if no, trigger prompt to buy again.
function confirmOrder() {
    console.log(`\n# in stock: ${stockQty} || # requested: ${qtyReq}`);
    console.log(`\n- - - - Please confirm your purchase - - - - \n
        Item: ${productName} 
        Quantity: ${qtyReq}
        Order Total: $${itemPrice * qtyReq}
        \n- - - - - - - - - - - - - - - - - - - - - - -`);
    inquirer.prompt({
        name: 'confirmOrder',
        type: 'list',
        message: 'Proceed?',
        choices: ['Yes', 'No']
    }).then(function (resp) {
        switch (resp.confirmOrder) {
            case 'Yes':
                transaction();
                break;
            case 'No':
                console.log('\n Canceling order. \n');
                buyAgain();
        }
    })
}

// function to display order cost and remove order qty from database.
// then trigger prompt to buy again.
function transaction() {
    var cost = itemPrice * qtyReq;
    var newStock = stockQty - qtyReq;
    connection.query(
        'UPDATE products SET ? WHERE ?',
        [{
                stock_qty: newStock
            },
            {
                item_id: itemID
            }
        ]);
    console.log('\n Thank you for your order! \n');
    buyAgain();
};

// function to ask user if they want to buy again.
function buyAgain() {
    inquirer.prompt({
        name: 'buyAgain',
        type: 'list',
        message: 'Would you like to place another order?',
        choices: ['Yes', 'No']
    }).then(function (resp) {
        switch (resp.buyAgain === 'Yes') {
            case true:
                dispInventory();
                break;
            case false:
                console.log('\n Goodbye!');
                connection.end();
        };
    });
};