INSERT INTO department (id, name)
VALUES (1, "Engineering"),
       (2, "Finance"),
       (3, "Legal"),
       (4, "Sales");

INSERT INTO role (title, salary, department_id)
VALUES ("Software Engineer", 120000, 1),
       ("Lead Engineer", 150000, 1),
       ("Accountant", 125000, 2),
       ("Account Manager", 160000, 2),
       ("Lawyer", 190000, 3),
       ("Legal Team Lead", 250000, 3),
       ("Salesperson", 80000, 4),
       ("Sales Lead", 100000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("John", "Doe", 1, 1),
       ("Tom", "Chan", 2, 1),
       ("Jane", "Doe", 3, 2),
       ("Kevin", "Sanchez", 4, 2),
       ("Mike", "Dick", 5, 3),
       ("Ralph", "Laur", 6, 3),
       ("Sarah", "Riza", 7, 4),
       ("Bill", "Allen", 8, 4);


       