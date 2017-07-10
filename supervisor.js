//dependecies
var mysql = require("mysql");
var Table = require("cli-table");
var inquirer = require("inquirer");
var colors = require("colors");

//creating table that will be logged to the console
var table = new Table({
		//header and column widths of the table
		head: ["Dpt ID", "Department", "Overhead Costs", "Product Sales", "Total Profit"],
		colWidths: [6, 20, 18, 17, 14]
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

//creating the connection and running the supervisor prompt function
connection.connect(function(err){
	if (err) throw err;
	//console.log("connected as id " + connection.threadId);
	supervisorPrompt();
});

//function to ask the supervisor if they would like to view product sales by department or create a new department, then run the respective functions
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

//function to ask if the supervisor would like to continue, returning to the initial prompt if they do
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
			console.log("Have a great day!");
			break;
		}
	});
}

function viewProductSales(){
	//inner join query from the products and departments tables based on department id, department name, overhead costs, and product sales; grouping by department name and ordering by the department id
	connection.query("SELECT departments.department_id, departments.department_name, departments.overhead_costs, products.product_sales FROM departments INNER JOIN products ON (departments.department_name = products.department_name) GROUP BY department_name ORDER BY departments.department_id;", function(err, res){

		if (err) throw err; 
		//looping through results
		for (var i = 0; i < res.length; i++) {
			//set the total profit variable as the result of overhead costs subtracted from product sales for each result
			var totalProfit =  res[i].product_sales - res[i].overhead_costs;

			//pushing department id, department name, overhead costs, product sales, and the total profit to the table
			table.push(
	    	[res[i].department_id, res[i].department_name, res[i].overhead_costs, res[i].product_sales, totalProfit]
			);
		}
		//.toString to make it look nice and running the continuePrompt function
		console.log(table.toString());
		continuePrompt();
	});
}

//function to create a new department
function createDpt(){
	//from the departments table...
	connection.query("SELECT * FROM departments", function(err, res){
		if (err) throw err;
		//...ask what the name of the new deparment is and what the overhead costs are
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
				//..using validation so the user has to input an integer
				validate: function(value) {
					if (isNaN(value) === false && parseInt(value) > 0) {
						return true;
					}
					return false;
				}
			}
		]).then(function(answers) {
			//set the answers as variables for the new department and its costs
			var newDepartment = answers.department;
			var newDptCosts = answers.costs;

			//update the MySQL table with the new department name and overhead costs
			connection.query("INSERT INTO departments SET ?",
				{
					department_name: newDepartment,
					overhead_costs: newDptCosts
				}, function(err, res) {
					//log teh new department created and run the continuePrompt function
					console.log("New department '" + newDepartment + "' created with overhead costs of $" + newDptCosts);
					continuePrompt();
				}
			);
		});
	});
}

//table is not updating when new department is added