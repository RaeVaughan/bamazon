# bamazon

This is a mock Amazon app consisting of three views: customer, manager, and supervisor.

***

## 1. Customer
The customer view gives the customer access to view the table (taken from MySQL) of product id's, names, department, and price. Upon viewing the table, the user is prompted to input the id of the product they want to purchase, along with the quantity. 

If there is enough stock for the purchase to be made, the user is thanked for their purchase and given the total cost of their purchase. If not, the user is told there is not enough stock to fulfill their purchase.

Once a purchase is made, the MySQL database is updated, and the user is asked if they would like to make another purchase. If so, they are taken back through the same id and quantity questions. If not, they are told goodbye.

!(demo)[images/customer-view.gif]

## 2. Manager

## 3. Supervisor