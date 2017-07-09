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
			supervisorPrompt();
			break;

			case "No":
			console.log("Bye Felicia");
			break;
		}
	});
}

function viewProductSales(){

	connection.query("SELECT departments.department_id, departments.department_name, departments.overhead_costs, products.product_sales FROM departments INNER JOIN products ON (departments.department_name = products.department_name) GROUP BY department_name ORDER BY departments.department_id;", function(err, res){

		if (err) throw err; 

		for (var i = 0; i < res.length; i++) {
			var totalProfit =  res[i].product_sales - res[i].overhead_costs;

			table.push(
	    	[res[i].department_id, res[i].department_name, res[i].overhead_costs, res[i].product_sales, totalProfit]
			);
		}
		console.log(table.toString());
		continuePrompt();
	});
}

function createDpt(){
	connection.query("SELECT * FROM departments", function(err, res){
		if (err) throw err;
		inquirer.prompt([
			{
				type: "input",
				name: "department",
				message: "What is the name of the department you would like to add?"
			},
			{
				type: "input",
				name: "costs",
				message: "What is the overhead cost for this department? (numbers only, please do not include $)",
				validate: function(value) {
					if (isNaN(value) === false && parseInt(value) > 0) {
						return true;
					}
					return false;
				}
			}
		]).then(function(answers) {
			var newDepartment = answers.department;
			var newDptCosts = answers.costs;

			connection.query("INSERT INTO departments SET ?",
				{
					department_name: newDepartment,
					overhead_costs: newDptCosts
				}, function(err, res) {
					console.log("New department '" + newDepartment + "' created with overhead costs of $" + newDptCosts);
					continuePrompt();
				}
			);
		});
	});
}

//table is not updating when new department is added
