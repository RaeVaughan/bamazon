var mysql = require("mysql");
var Table = require("cli-table");
var inquirer = require("inquirer");

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

connection.connect(function(err){
	if (err) throw err;
	console.log("connected as id " + connection.threadId);
	productTable();
});

function productTable(){
	connection.query("SELECT * FROM products", function (err, res) {
		for (var i = 0; i < res.length; i++) {
			table.push(
	    	[res[i].item_id, res[i].product_name, res[i].department_name, res[i].price]
			);
			//choiceArray.push(res[i].item_id);
		}
		console.log(table.toString());
		//console.log(choiceArray);

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
			console.log(answers);
		});





	});
}








