var mysql = require("mysql");
var Table = require("cli-table");
var inquirer = require("inquirer");
var colors = require("colors");

var table = new Table({
		head: ["Dpt ID", "Department", "Overhead Costs", "Product Sales", "Total Profit"],
		colWidths: [6, 20, 18, 17, 14]
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
	supervisorPrompt();
});

function supervisorPrompt(){
	inquirer.prompt([
		{
			type: "list",
			name: "choice",
			choices: ["View product sales by department", "Create a new department"],
			message: "What would you like to do?"
		}
	]).then(function(answer){
		switch(answer.choice){
			case "View product sales by department":
			viewProductSales();
			break;

			case "Create a new department":
			createDpt();
			break;
		}
	});
}

function viewProductSales(){

	connection.query("SELECT departments.department_id, departments.department_name, departments.overhead_costs, products.product_sales FROM products INNER JOIN departments ON (products.department_name = departments.department_name) GROUP BY department_name ORDER BY departments.department_id;", function(err, res){

		if (err) throw err; 

		for (var i = 0; i < res.length; i++) {
			var totalProfit =  res[i].product_sales - res[i].overhead_costs;

			table.push(
	    	[res[i].department_id, res[i].department_name, res[i].overhead_costs, res[i].product_sales, totalProfit]
			);
		}
		console.log(table.toString());
	});

	// connection.query("SELECT * FROM products", function(err, res) {
	// 	for (var i = 0; i < res.length; i++) {
	// 		table.push(
	//     	[res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]
	// 		);
	// 	}
	// 	console.log(table.toString());
	// });
}

function createDpt(){

}

// function addNewProduct(){
// 	connection.query("SELECT * FROM products", function(err, res){
// 		if (err) throw err;
// 		inquirer.prompt([
// 			{
// 				type: "input",
// 				name: "product",
// 				message: "What product would you like to add?"
// 			},
// 			{
// 				type: "input",
// 				name: "department",
// 				message: "What department is this product in?"
// 			},
// 			{
// 				type: "input",
// 				name: "price",
// 				message: "What is the price of this product?",
// 				validate: function(value) {
// 					if (isNaN(value) === false && parseInt(value) > 0) {
// 						return true;
// 					}
// 					return false;
// 				}
// 			},
// 			{
// 				type: "input",
// 				name: "stock",
// 				message: "What is the starting inventory of this product?",
// 				validate: function(value) {
// 					if (isNaN(value) === false && parseInt(value) > 0) {
// 						return true;
// 					}
// 					return false;
// 				}
// 			}
// 		]).then(function(answers) {
// 			var newProduct = answers.product;
// 			var newProductDpt = answers.department;
// 			var newProductPrice = answers.price;
// 			var stock = answers.stock;

// 			connection.query("INSERT INTO products SET ?",
// 				{
// 					product_name: newProduct,
// 					department_name: newProductDpt,
// 					price: newProductPrice,
// 					stock_quantity: stock
// 				}, function(err, res) {
// 					console.log(stock + " of the new product (" + newProduct + ") added to the " + newProductDpt + " department for $" + newProductPrice);
// 					continuePrompt();
// 				}
// 			);
// 		});
// 	});
// }

