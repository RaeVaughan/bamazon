CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
	item_id INTEGER(11) AUTO_INCREMENT PRIMARY KEY NOT NULL,
    product_name VARCHAR(100),
    department_name VARCHAR(100),
    price INTEGER(50),
    stock_quantity VARCHAR(100)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("headphones", "Electronics", 40, 50);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("Harry Potter", "Books", 20, 50);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("power drill", "Home Improvement", 45, 50);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("hand weights", "Sports and Outdoors", 5, 50);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("aux cable", "Electronics", 15, 50);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("cat toy", "Pet Supplies", 10, 50);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("dog bed", "Pet Supplies", 30, 50);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("toothpaste", "Beauty and Health", 4, 50);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("lotion", "Beauty and Health", 5, 50);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("foam roller", "Sports and Outdoors", 15, 50);