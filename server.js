const inquirer = require('inquirer');
const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'Papi$hampo0',
      database: 'ets_db'
    },
    (err) => {
        if (err) {
            console.log('Error connecting to the database:', err);
            return;
        }
    },
    console.log('Connected to the employee_db database.'),
);

const initialPrompt = () => {
    inquirer
    .prompt([
        {
            type: 'list',
            name: 'startOptions',
            message: 'Select an option to continue:',
            choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role'],
        },
    ])
    .then((answers) => {
        switch (answers.startOptions) {

            case 'View all departments':
                viewDepartments();
            break;

            case 'View all roles':
                viewRoles();
            break;

            case 'View all employees':
                viewEmployees();
            break;

            case 'Add a department':
                addDepartment()
            break;

            case 'Add a role':
                addRole();
            break;

            case 'Add an employee':
                addEmployee();
            break;

            case 'Update an employee role':
                updateRole();
            break;
        }
    })
}

const viewDepartments = () => {
    sql = `SELECT * FROM department`;
        db.query(sql, (err, rows) => {
            if (err) {
                console.log(err);
                return;
            }
        console.table(rows);
        initialPrompt();
    })
}

const viewRoles = () => {
    sql = `SELECT role.*, department.name AS department_name FROM role LEFT JOIN department ON role.department_id = department.id;`;
        db.query(sql, (err, rows) => {
            if (err) {
                console.log(err);
                return;
            }
        console.table(rows);
        initialPrompt();
    })
}

const viewEmployees = () => {
    sql = `SELECT employee.*, role.title AS role, role.salary, department.name AS department, CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
    FROM employee
    LEFT JOIN employee AS manager ON employee.manager_id = manager.id  
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id;`;

        db.query(sql, (err, rows) => {
            if (err) {
                console.log(err);
                return;
            }
        console.table(rows);
        initialPrompt();
    })
}

const addDepartment = () => {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'newDepartment',
                message: 'Enter the name of a new department.'
            }
        ])
    .then((answer) => {
            sql = `INSERT INTO department (name)
                VALUES (?)`;

            db.query(sql, [answer.newDepartment], (err, result) => {
                if (err) {
                    console.log(err);
                    return;
                }
                console.log(`Successfully added "${answer.newDepartment}" as a department!`);
        })
        viewDepartments();
    })
}

const addRole = ()  => {
    db.query(`SELECT * FROM department`, (err, rows) => {
        if (err) throw err;

        const departmentChoices = rows.map((department) => ({
            name: department.name,
            value: department.id
        }));
    
        inquirer
        .prompt([
            {
                type: 'input',
                name: 'roleTitle',
                message: 'Enter the title of a new role.'
            },
            {
                type: 'input',
                name: 'roleSalary',
                message: 'Enter the salary for the new role.'
            },
            {
                type: 'list',
                name: 'roleDepartment',
                message: 'What department does the role belong in?',
                choices: departmentChoices,
            },
        ])
        .then((answers) => {
            sql = `INSERT INTO role (title, salary, department_id)
                VALUES (?, ?, ?)`;

            db.query(sql, [answers.roleTitle, answers.roleSalary, answers.roleDepartment], (err, result) => {
                if (err) {
                    console.log(err);
                    return;
                }
                const selectedDepartment = departmentChoices.find(
                    (department) => department.value === answers.roleDepartment
                );
                console.log(`${answers.roleTitle} has been added as a role with a salary of ${answers.roleSalary} in the ${selectedDepartment.name} department.`);
            })
            viewRoles();
        })
    })
}

const addEmployee = () => {
    db.query(`SELECT * FROM department INNER JOIN role ON department.id = role.department_id INNER JOIN employee ON role.id = employee.role_id;`, (err, rows) => {
        if (err) throw err;

        const employeeManagers = rows.map((employee) => ({
            name: employee.first_name + " " + employee.last_name,
            value: employee.id
        }));
        db.query(`SELECT * FROM department INNER JOIN role ON department.id = role.department_id;`, (err, rows) => {
            if (err) throw err;

            const roleChoices = rows.map((role) => ({
                name: role.title,
                value: role.id
            }));
        inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'employeeFirstName',
                    message: 'Enter the first name of employee.'
                },
                {
                    type: 'input',
                    name: 'employeeLastName',
                    message: 'Enter the last name of employee.'
                },
                {
                    type: 'list',
                    name: 'employeeRole',
                    message: 'What role does the employee have?',
                    choices: roleChoices,
                },
                {
                    type: 'list',
                    name: 'employeeManager',
                    message: `Who is the employee's manager?`,
                    choices: employeeManagers,
                },
            ])
            .then((answers) => {
                sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                    VALUES (?, ?, ?, ?)`;

                db.query(sql, [answers.employeeFirstName, answers.employeeLastName, answers.employeeRole, answers.employeeManager], (err, result) => {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    const selectedRole = roleChoices.find(
                        (role) => role.value === answers.employeeRole
                    );
                    const selectedManager = employeeManagers.find(
                        (employee) => employee.value === answers.employeeManager
                    );
                    console.log(`Employee name: ${answers.employeeFirstName} ${answers.employeeLastName} --- Role: ${selectedRole.name} --- Manager: ${selectedManager.name}`);
                })
                viewEmployees();
            })
        })
    })
}

const updateRole = () => {
    db.query(`SELECT * FROM department INNER JOIN role ON department.id = role.department_id INNER JOIN employee ON role.id = employee.role_id;`, (err, rows) => {
        if (err) throw err;

        const roleChoices = rows.map((role) => ({
            name: role.title,
            value: role.id
        }));
        console.log(roleChoices);

        const employeeChoices = rows.map((employee) => ({
            name: employee.first_name + " " + employee.last_name,
            value: employee.id
        }));

    inquirer
        .prompt([
            {
                type: 'list',
                name: 'employeeSelect',
                message: `Which employee's role do you want to update?`,
                choices: employeeChoices,
            },
            {
                type: 'list',
                name: 'roleSelect',
                message: 'Which role do you want to assign the selected employee?',
                choices: roleChoices,
            }
        ])
        .then((answers) => {
            db.query(`UPDATE employee SET role_id=${answers.roleSelect} WHERE id=${answers.employeeSelect}`, (err, result) => {
                if (err) {
                    console.log(err);
                    return;
                }
                const selectedRole = roleChoices.find(
                    (role) => role.value === answers.roleSelect
                );
                const selectedEmployee = employeeChoices.find(
                    (employee) => employee.value === answers.employeeSelect
                );
                console.log(`${selectedEmployee.name}'s role has been updated to ${selectedRole.name}!`);
            })
            viewEmployees();
        })
    })
}

initialPrompt();