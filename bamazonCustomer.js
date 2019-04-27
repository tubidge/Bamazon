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
    console.log(`\nconnected as id ${connection.threadId}`);
    dispInventory();
});

// function to display the database inventory on app launch,
// then triggers prompt function.
function dispInventory() {
    var query = 'SELECT item_id, product_name, price FROM products';
    connection.query(query, function (err, res) {
        console.log('\nCurrent Inventory: \n-------------------')
        for (var i = 0; i < res.length; i++) {
            console.log(`Item ID: ${res[i].item_id} | Item Name: ${res[i].product_name} | Item Price: $${res[i].price}`);
        };
        startPrompt();
    });
};

var itemID = undefined;
var qtyReq = undefined;
var itemPrice = undefined;
var stockQty = undefined;
// function to inquire and capture user input.
// then checks inventory for
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
        console.log(resp);
        itemID = parseInt(resp.item_id);
        qtyReq = parseInt(resp.qty);
        inventoryCheck();
    });
};

function inventoryCheck() {
    connection.query(
        'SELECT * FROM products WHERE ?', {
            item_id: itemID
        },
        function (err, resp) {
            if (err) throw err;
            console.log(resp);
            stockQty = resp[0].stock_qty;
            itemPrice = resp[0].price;
            console.log(`\n# in stock: ${stockQty} || # requested: ${qtyReq}`);
            switch (stockQty > qtyReq) {
                case true:
                    transaction();
                    break;

                case false:
                    console.log(`----- \nSo sorry! We only have ${stockQty} in stock. \n-----`)
                    startPrompt();
                    break;
            };
        });
};

function transaction() {
    var cost = itemPrice * qtyReq;
    var newStock = stockQty - qtyReq;
    console.log(`\nYour order total is $${cost}`);
    connection.query(
        'UPDATE products SET ? WHERE ?',
        [{
                stock_qty: newStock
            },
            {
                item_id: itemID
            }
        ]);
    console.log('Thank you for your order!');
    dispInventory();
    startPrompt();

};