var mysql = require("mysql");
var Table = require("cli-table");
var inquirer = require("inquirer");
var colors = require("colors");

var table = new Table({
		head: ["Dpt ID", "Department", "Overhead Costs", "Product Sales", "Total Profit"],
		colWidths: [5, 25, 15, 8, 5]
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

//need to write a function to create the inner join table and log it
function viewProductSales(){
	console.log("Under contstruction");
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
	console.log("create new department working");
}


