var mysql = require("mysql");
var Table = require("cli-table");
var inquirer = require("inquirer");
var colors = require("colors");

var table = new Table({
		head: ["ID", "Product Name", "Department", "Price", "Qty"],
		colWidths: [5, 25, 25, 8, 5]
	});

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

function viewAll(){
	connection.query("SELECT * FROM products", function(err, res) {
		for (var i = 0; i < res.length; i++) {
			table.push(
	    	[res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]
			);
		}
		console.log(table.toString());
		managerPrompt();
	});
}

function viewLow(){
	connection.query("SELECT * FROM products WHERE stock_quantity=?", [48, 50], function(err, res) {

		for (var i = 0; i < res.length; i++) {
			console.log(res[i].item_id);
			table.push(
	    	[res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]
			);
		}

		// 	var itemID = res[i].item_id;
		// 	var productName = res[i].product_name;
		// 	var dptName = res[i].department_name;
		// 	var price = res[i].price;
		// 	var qty = res[i].stock_quantity;
		// 	if (res[i].stock_quantity > 10) {
		// 		table.push(
	 //    		[itemID, productName, dptName, price, qty]
		// 		);
		// 	console.log(table.toString());
		// 	} else {
		// 	console.log("No low inventory to show.");
		// 	}	
		// }
		//managerPrompt();
	});
}

function addInventory(){
	console.log("add to inventory");
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
				}
			);
		});
	});
}

function addNewProduct(){
	console.log("add new product");
}



//need to add recursion and figure out what's going on with my viewLow function






















