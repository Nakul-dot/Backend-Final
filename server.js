const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'employees.json');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const readEmployees = () => {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
  }
  return JSON.parse(fs.readFileSync(DATA_FILE));
};

const saveEmployees = (data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

app.get('/employees', (req, res) => {
  res.json(readEmployees());
});

app.post('/employees', (req, res) => {
  const employees = readEmployees();
  const newEmployee = req.body;
  employees.push(newEmployee);
  saveEmployees(employees);
  res.status(201).json(newEmployee);
});

app.put('/employees/:index', (req, res) => {
  const index = parseInt(req.params.index, 10);
  const employees = readEmployees();
  if (index >= 0 && index < employees.length) {
    employees[index] = req.body;
    saveEmployees(employees);
    res.status(200).json(employees[index]);
  } else {
    res.status(404).json({ message: 'Employee not found' });
  }
});

app.delete('/employees/:index', (req, res) => {
  const index = parseInt(req.params.index, 10);
  const employees = readEmployees();
  if (index >= 0 && index < employees.length) {
    employees.splice(index, 1);
    saveEmployees(employees);
    res.status(200).json({ message: 'Employee deleted' });
  } else {
    res.status(404).json({ message: 'Employee not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
