DROP DATABASE IF EXISTS ets_db;

CREATE DATABASE ets_db;

USE ets_db;

CREATE TABLE department (
    department_id INT AUTO_INCREMENT,
    name VARCHAR(30),
    PRIMARY KEY (department_id)
);

CREATE TABLE role (
    role_id INT AUTO_INCREMENT,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT,
    PRIMARY KEY (role_id)
    FOREIGN KEY (department_id)
);

CREATE TABLE employee (
    id INT AUTO_INCREMENT,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT NULL,
    manager_id INT NULL,
    PRIMARY KEY (id)
    FOREIGN KEY (role_id),
    FOREIGN KEY (manager_id)
);