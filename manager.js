//dependecies
var mysql = require("mysql");
var Table = require("cli-table");
var inquirer = require("inquirer");
var colors = require("colors");

//creating table that will be logged to the console
var table = new Table({
		//header and column widths of the table
		head: ["ID", "Product Name", "Department", "Price", "Qty"],
		colWidths: [5, 25, 25, 8, 5]
	});
//making the header show up green
table.options.style.head = ["green"];

//creating connection to mysql
var connection = mysql.createConnection({
	host: "localhost", 
	port: 3306,
	user: "root",
	password: "root",
	database: "bamazon"
});

//creating connection and running managerPrompt function
connection.connect(function(err){
	if (err) throw err;
	//console.log("connected as id " + connection.threadId);
	managerPrompt();
});

function managerPrompt(){
	//initial choice list for manager to pick an action
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
	//if the manager would like to continue, run the managerPrompt function
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

			//if not, tell them goodbye
			case "No":
			console.log("Have a great day!");
			break;
		}
	});
}

function addMorePrompt(){
	//after viewing the low inventory, this function will run so the manager can choose if they would like to go ahead and restock
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
			console.log("Have a great day!");
			break;
		}
	});
}

function viewAll(){
	connection.query("SELECT * FROM products", function(err, res) {
		//from the products table, loop through the results
		for (var i = 0; i < res.length; i++) {
			//push to the table
			table.push(
				//because each row of the table is its own array, push each index of res to the table as an array
	    	[res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]
			);
		}
		//.toString to make it look nice
		console.log(table.toString());
		//run continue prompt
		continuePrompt();
	});
}

function viewLow(){
	//from the product table where the stock quantity is less than 5...
	connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(err, res) {
		//if the length of the returned results is greater than 0 (if any with stock less than 5 exist)
		if (res.length > 0) {
			//loop through the results and push to the table, and run the addMorePrompt function to ask if the manager would like to restock
			for (var i = 0; i < res.length; i++) {
				table.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]);	
			}
			console.log(table.toString());
			addMorePrompt();
			//or log that there are no low inventory items to show and run the continuePrompt function to ask if they want to continue
		} else {
			console.log("No low inventory items to show.");
			continuePrompt();
		}	
	});
}

function addInventory(){
	connection.query("SELECT * FROM products", function(err, res) {
		if (err) throw err;

		//ask the manager what product they would like to add inventory to and how much they would like to add
		inquirer.prompt([
		{
			name: "idChoice",
			type: "list",
			choices: function() {
				//since the choices must be an array, create an empty array to push choices into
				var choiceArray = [];
				//loop through the returned res
				for(var i = 0; i < res.length; i++) {
					//convert each item to a string and push it to the empty choice array
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
			//set the chosen id to a variable, and find that item's index by subtracting one
			var chosenID = answers.idChoice;
			var chosenItemIndex = (chosenID - 1);
			//use that index to find the chosen item's quantity
			var chosenItemQty = (res[chosenItemIndex].stock_quantity);
			var chosenAmount = answers.amount;
			//create the total by adding the current item's quantity with how many the user wants to add
			var total = parseInt(chosenItemQty) + parseInt(chosenAmount);

			//update the stock quantity at the chosen ID in the MySQL table
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
					//log the previous and new item inventory and run the continue prompt function
					console.log("Previous item inventory: " + chosenItemQty + " units" + "\nCurrent item inventory: " + total + " units");
					continuePrompt();
				}
			);
		});
	});
}

function addNewProduct(){
	//from the products table, as the manager for the name, department, price, and stock of the new item 
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
			//set the product name, department, price, and stock to variables from the user's input
			var newProduct = answers.product;
			var newProductDpt = answers.department;
			var newProductPrice = answers.price;
			var stock = answers.stock;

			//and insert those variables into the MySQL table
			connection.query("INSERT INTO products SET ?",
				{
					product_name: newProduct,
					department_name: newProductDpt,
					price: newProductPrice,
					stock_quantity: stock
				}, function(err, res) {
					//log the new produc that was added and run the continuePrompt function
					console.log(stock + " of the new product (" + newProduct + ") added to the " + newProductDpt + " department for $" + newProductPrice);
					continuePrompt();
				}
			);
		});
	});
}

//add decimal options
//when I add a new product, the auto-increment doesn't work right and screws up my place order function