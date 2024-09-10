const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

let employees = [];


const loadEmployees = () => {
  try {
    const data = fs.readFileSync('employees.json');
    employees = JSON.parse(data);
  } catch (error) {
    employees = [];
  }
};


const saveEmployees = () => {
  fs.writeFileSync('employees.json', JSON.stringify(employees, null, 2));
};

loadEmployees();


app.get('/employees', (req, res) => {
  res.json(employees);
});


app.get('/employees/:id', (req, res) => {
  const employee = employees.find(emp => emp.id === parseInt(req.params.id));
  if (!employee) return res.status(404).send('Employee not found');
  res.json(employee);
});


app.post('/employees', (req, res) => {
  const newEmployee = {
    id: employees.length ? employees[employees.length - 1].id + 1 : 1,
    name: req.body.name,
    salary: req.body.salary,
  };
  employees.push(newEmployee);
  saveEmployees();
  res.status(201).json(newEmployee);
});


app.put('/employees/:id', (req, res) => {
  const employee = employees.find(emp => emp.id === parseInt(req.params.id));
  if (!employee) return res.status(404).send('Employee not found');

  employee.salary = req.body.salary;
  saveEmployees();
  res.json(employee);
});

app.delete('/employees/:id', (req, res) => {
  employees = employees.filter(emp => emp.id !== parseInt(req.params.id));
  saveEmployees();
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
