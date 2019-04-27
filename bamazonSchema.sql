CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
    item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(100) NOT NULL,
    dept_name VARCHAR(50) NOT NULL,
    price INT(10) NOT NULL,
    stock_qty INT(10) NOT NULL,
    primary key (item_id)
);

INSERT INTO products 
(product_name, dept_name, price, stock_qty)
VALUES 
('3 ft. Cheese Wheel', 'Kitchen/Grocery', 145, 500),
('Infant Caribou Hide', 'Decor', 500, 900),
('1/2 Coding Bootcamp Certificate', 'Office', 18, 350),
('Refurbished Carpet', 'Decor', 27, 1280),
('Ted Nugent Tapestry', 'Decor', 950, 800),
('Possibly Stolen American Express Card', 'Questionables', 5, 12498),
("Joel's Netflix Password", 'Entertainment', 7, 100000),
('5 Gallon Bucket of Vaseline', 'Beauty', 20, 590),
('Breaking Bad S3E6 DVD', 'Entertainment', 3, 821),
('Twist Tie', 'Kitchen/Grocery', 1, 17000);