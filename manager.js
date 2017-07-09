var mysql = require("mysql");
var Table = require("cli-table");
var inquirer = require("inquirer");
var colors = require("colors");
var colors = require('colors/safe');

var table = new Table({
		head: ["ID", "Product Name", "Department", "Price", "Qty"],
		colWidths: [5, 25, 25, 8, 5]
	});
table.options.style.head = ["green"];

var connection = mysql.createConnection({
	host: "localhost", 
	port: 3306,
	user: "root",
	password: "root",
	database: "bamazon"
});

connection.connect(function(err){
	if (err) throw err;
	//console.log("connected as id " + connection.threadId);
	managerPrompt();
});

function managerPrompt(){
	inquirer.prompt([
		{
			type: "list",
			name: "choice",
			choices: ["View products for sale", "View low inventory", "Add to inventory", "Add new product"],
			message: "What would you like to do?"
		}
	]).then(function(answer){
		switch(answer.choice){
			case "View products for sale":
			viewAll();
			break;

			case "View low inventory":
			viewLow();
			break;

			case "Add to inventory":
			addInventory();
			break;

			case "Add new product":
			addNewProduct();
			break;
			console.log("working");
		}
	});
}

function continuePrompt(){
	inquirer.prompt([
		{
			type: "list",
			name: "choice",
			choices: ["Yes", "No"],
			message: "Would you like to continue?"
		}
	]).then(function(answer){
		switch(answer.choice){
			case "Yes":
			managerPrompt();
			break;

			case "No":
			console.log("Bye Felicia");
			break;
		}
	});
}

function addMorePrompt(){
	inquirer.prompt([
		{
			type: "list",
			name: "choice",
			choices: ["Yes", "No"],
			message: "Would you like to add more?"
		}
	]).then(function(answer){
		switch(answer.choice){
			case "Yes":
			addInventory();
			break;

			case "No":
			console.log("Bye Felicia");
			break;
		}
	});
}

function viewAll(){
	connection.query("SELECT * FROM products", function(err, res) {
		for (var i = 0; i < res.length; i++) {
			table.push(
	    	[res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]
			);
		}
		console.log(table.toString());
		continuePrompt();
	});
}

function viewLow(){
	connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(err, res) {
		if (res.length > 0) {
			for (var i = 0; i < res.length; i++) {
				table.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]);
			}
			console.log(table.toString());
			
		} else {
			console.log("No low inventory items to show.")
		}
		addMorePrompt();
	});
}

function addInventory(){
	connection.query("SELECT * FROM products", function(err, res) {
		if (err) throw err;

		inquirer.prompt([
		{
			name: "idChoice",
			type: "list",
			choices: function() {
				var choiceArray = [];
				for(var i = 0; i < res.length; i++) {
					choiceArray.push(res[i].item_id.toString());
				}
				return choiceArray;
			},
			message: "What product would you like to add more inventory to?"
		},
		{
			name: "amount",
			type: "input",
			message: "How many units would you like to add?",
			validate: function(value) {
				if (isNaN(value) === false && parseInt(value) > 0) {
					return true;
				}
				return false;
			}
		}
		]).then(function(answers) {
			var chosenID = answers.idChoice;
			var chosenItemIndex = (chosenID - 1);
			var chosenItemQty = (res[chosenItemIndex].stock_quantity);
			var chosenAmount = answers.amount;
			var total = parseInt(chosenItemQty) + parseInt(chosenAmount);

			connection.query("UPDATE products SET ? WHERE ?",
				[
					{
						stock_quantity: total
					},
					{
						item_id: chosenID
					}
				],
				function(err, res) {
					console.log("Previous item inventory: " + chosenItemQty + " units" + "\nCurrent item inventory: " + total + " units");
					continuePrompt();
				}
			);
		});
	});
}

function addNewProduct(){
	connection.query("SELECT * FROM products", function(err, res){
		if (err) throw err;
		inquirer.prompt([
			{
				type: "input",
				name: "product",
				message: "What product would you like to add?"
			},
			{
				type: "input",
				name: "department",
				message: "What department is this product in?"
			},
			{
				type: "input",
				name: "price",
				message: "What is the price of this product?",
				validate: function(value) {
					if (isNaN(value) === false && parseInt(value) > 0) {
						return true;
					}
					return false;
				}
			},
			{
				type: "input",
				name: "stock",
				message: "What is the starting inventory of this product?",
				validate: function(value) {
					if (isNaN(value) === false && parseInt(value) > 0) {
						return true;
					}
					return false;
				}
			}
		]).then(function(answers) {
			var newProduct = answers.product;
			var newProductDpt = answers.department;
			var newProductPrice = answers.price;
			var stock = answers.stock;

			connection.query("INSERT INTO products SET ?",
				{
					product_name: newProduct,
					department_name: newProductDpt,
					price: newProductPrice,
					stock_quantity: stock
				}, function(err, res) {
					console.log(stock + " of the new product (" + newProduct + ") added to the " + newProductDpt + " department for $" + newProductPrice);
					continuePrompt();
				}
			);
		});
	});
}



//add decimal options
//add "would you like to add more" prompt to the low inventory function