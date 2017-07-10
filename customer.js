//dependecies
var mysql = require("mysql");
var Table = require("cli-table");
var inquirer = require("inquirer");
var colors = require("colors");

//creating connection to mysql
var connection = mysql.createConnection({
	host: "localhost", 
	port: 3306,
	user: "root",
	password: "root",
	database: "bamazon"
});

//creating table that will be logged to the console
var table = new Table({
	//header and column widths of the table
	head: ["ID", "Product Name", "Department", "Price"],
	colWidths: [5, 25, 25, 8]
});
//making the header show up green
table.options.style.head = ["green"];

//creating connection
connection.connect(function(err){
	if (err) throw err;
	//if there's no error, run the showTable and placeOrder functions
	showTable();
	placeOrder();
});


function showTable(){
	//selecting from the products table
	connection.query("SELECT * FROM products", function (err, res) {
		//looping through the returned res
		for (var i = 0; i < res.length; i++) {
				//pushing to the table as an array for each index of res (each row in the table is an array) 
				table.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price]);
			}
			//logging the table with .toString to look nice
			console.log(table.toString());
	});
}

function placeOrder(){
	connection.query("SELECT * FROM products", function (err, res) {
		//setting up prompt for customer to place an order
		inquirer.prompt([
			{
				type: "input",
				name: "choice",
				//user must enter an ID of the product they want to purchase
				message: "Please enter the ID of the product you would like to purchase.",
				//validation so that the customer must input an integer
				validate: function(value) {
					if (isNaN(value) === false && parseInt(value) > 0) {
						return true;
					}
					return false;
				}
			},
			{
				//asking how many of that product the customer wants to purchase
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
			//setting the ID the user input as a variable
			var chosenItemId = (answers.choice);
			//subtracting one from that ID in order to find that item's index
			var chosenItemIndex = (answers.choice - 1);
			//using that index to find the quantity and price of the chosen item in order to create total cost for the user's choices
			var chosenItemQty = (res[chosenItemIndex].stock_quantity);
			var chosenItemPrice = (res[chosenItemIndex].price);
			var total = (chosenItemPrice * answers.amount);

			//if the chosen item quantity is greater than or equal to how many the user wants...
			if (chosenItemQty >= answers.amount){
				//...log that the item is in stock and update the table
			 	console.log("In stock!");
			 	connection.query("UPDATE products SET ? WHERE ?",
			 		[
			 			{
			 				stock_quantity: chosenItemQty - answers.amount,
			 				product_sales: total
			 			},
			 			{
			 				item_id: chosenItemId
			 			}
			 		],
			 	function(err, res) {
			 		//thank the customer for their purchase and run the continue prompt function
			 		console.log("Thank you for your purchase! Your total comes to: $" + total);
			 		continuePrompt();
			 	}
			 	);
			 	//if the item is not in stock, inform the customer and run the continue prompt function
			 } else {
			 console.log("So sorry! We only have " + chosenItemQty + " remaining of that item.");
			 continuePrompt();
			}
		});
	});
}

function continuePrompt(){
	//ask the customer if they would like to place another order
	inquirer.prompt([
		{
			type: "list",
			name: "choice",
			choices: ["Yes", "No"],
			message: "Would you like to place an another order?"
		}
	]).then(function(answer){
		//if they want to place another order, run the place order function
		switch(answer.choice){
			case "Yes":
			placeOrder();
			break;

			//if not, tell the customer goodbye
			case "No":
			console.log("Have a great day!");
			break;
		}
	});
}

//try to find a way to find the chosen item without the index, or a different way to find the index, or a way to fix the auto-increment feature in MySQL