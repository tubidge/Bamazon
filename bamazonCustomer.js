var inquirer = require('inquirer');
var mysql = require('mysql');

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

function dispInventory() {
    var query = 'SELECT item_id, product_name, price FROM products';
    connection.query(query, function (err, res) {
        console.log('Current Inventory: \n-------------------')
        for (var i = 0; i < res.length; i++) {
            console.log(`Item ID: ${res[i].item_id} | Item Name: ${res[i].product_name} | Item Price: $${res[i].price}`);
        }
        startPrompt();
    });
};


function startPrompt() {
    inquirer.prompt([{
        name: 'item_id',
        type: 'input',
        message: 'Type the ID of the item you want to purchase.'
    }, {
        name: 'qty',
        type: 'input',
        message: 'How many would you like to purchase?'
    }])
};