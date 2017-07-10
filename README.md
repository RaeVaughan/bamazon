# bamazon

This is a mock Amazon app consisting of three views: customer, manager, and supervisor.

***

## 1. Customer
The customer view gives the customer access to view the table (taken from MySQL) of product id's, names, department, and price. Upon viewing the table, the user is prompted to input the id of the product they want to purchase, along with the quantity. 

If there is enough stock for the purchase to be made, the user is thanked for their purchase and given the total cost of their purchase. If not, the user is told there is not enough stock to fulfill their purchase.

Once a purchase is made, the MySQL database is updated, and the user is asked if they would like to make another purchase. If so, they are taken back through the same id and quantity questions. If not, they are told goodbye.

!(demo)[images/customer-view.gif]

## 2. Manager
The manager view starts with an intial prompt with four different options: view products for sale, view low inventory, add to inventory, and add a new product.

1. View products for sale:
This allows the manager to view a table of all products similar to the customer view, but with an additional column for stock. After viewing the table, they are asked if they would like to continue. Yes returns to the main prompt. 

!(demo)

2. View low inventory:
This brings up a table with all the inventory with stock less than 5. The manager is then asked if they would like to restock. If yes, they are taken through the add to inventory function (explained below).

If there is no inventory with stock less than 5 to show, the user is informed of this.

!(demo)

3. Add to inventory:
This brings up a prompt asking the manager which product they would like to add inventory, and how much stock they would like to add. Once through the prompt, the user is shown both the old and the updated stock, and the MySQL database is updated.

!(demo)

4. Add a new product:
This takes the manager through a prompt asking what the new product's name, department, price, and stock are. Once added, the MySQL table is updated.

!(demo)

## 3. Supervisor
The supervisor view starts with an initial prompt with two options: view product sales by department, and create a new department.

1. View product sales by department:
This brings up a table showing department id and name, as well as overhead costs, product sales, and total profit for each department.

!(demo)

2. Create new department: 
This takes the supervisor through a prompt asking what the new department's name and overhead costs are. Once added, the MySQL table updates.

!(demo)