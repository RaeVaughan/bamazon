var mysql = require("mysql");
var Table = require("cli-table");
var inquirer = require("inquirer");
var colors = require("colors");

var connection = mysql.createConnection({
	host: "localhost", 
	port: 3306,
	user: "root",
	password: "root",
	database: "bamazon"
});

var table = new Table({
	head: ["ID", "Product Name", "Department", "Price"],
	colWidths: [5, 25, 25, 8]
});
table.options.style.head = ["green"];

connection.connect(function(err){
	if (err) throw err;
	console.log("connected as id " + connection.threadId);
	showTable();
	placeOrder();
});

function showTable(){
	connection.query("SELECT * FROM products", function (err, res) {
		for (var i = 0; i < res.length; i++) {
				table.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price]);
			}
			console.log(table.toString());
	});
}

function placeOrder(){
	connection.query("SELECT * FROM products", function (err, res) {
		inquirer.prompt([
			{
				type: "input",
				name: "choice",
				message: "Please enter the ID of the product you would like to purchase.",
				validate: function(value) {
					if (isNaN(value) === false && parseInt(value) > 0) {
						return true;
					}
					return false;
				}
			},
			{
				type: "input",
				name: "amount",
				message: "How many?",
				validate: function(value) {
					if (isNaN(value) === false && parseInt(value) > 0) {
						return true;
					}
					return false;
				}
			}
		]).then(function(answers){
			 var chosenItemId = (answers.choice);
			 var chosenItemIndex = (answers.choice - 1);
			 var chosenItemQty = (res[chosenItemIndex].stock_quantity);
			 var chosenItemPrice = (res[chosenItemIndex].price);
			 var total = (chosenItemPrice * answers.amount);

			 if (chosenItemQty >= answers.amount){
			 	console.log("In stock!");
			 	connection.query("UPDATE products SET ? WHERE ?",
			 		[
			 			{
			 				stock_quantity: chosenItemQty - answers.amount
			 			},
			 			{
			 				item_id: chosenItemId
			 			}
			 		],
			 		function(err, res) {
			 			console.log("Thank you for your purchase! Your total comes to: $" + total);
			 			continuePrompt();
			 		}
			 		);
			 } else {
			 	console.log("So sorry! We only have " + chosenItemQty + " remaining of that item.");
			 	continuePrompt();
			 }
		});
	});
}

function continuePrompt(){
	inquirer.prompt([
		{
			type: "list",
			name: "choice",
			choices: ["Yes", "No"],
			message: "Would you like to place an another order?"
		}
	]).then(function(answer){
		switch(answer.choice){
			case "Yes":
			placeOrder();
			break;

			case "No":
			console.log("Bye Felicia");
			break;
		}
	});
}