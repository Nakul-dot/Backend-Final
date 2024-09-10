const fs = require('fs');
const filePath = 'employees.json';
const outputFilePath = 'total_salaries.json';

fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the file:', err);
    return;
  }

  try {
    const jsonData = JSON.parse(data);
    console.log('JSON data:', jsonData);


    let sumOfSalaries = 0;
    jsonData.forEach(employee => {
      sumOfSalaries += parseInt(employee.salary, 10);
    });

    console.log('Sum of salaries:', sumOfSalaries);

    
    const outputData = { totalSalaries: sumOfSalaries };
    fs.writeFile(outputFilePath, JSON.stringify(outputData, null, 2), (writeErr) => {
      if (writeErr) {
        console.error('Error writing the file:', writeErr);
        return;
      }
    });

  } catch (parseError) {
    console.error('Error parsing JSON:', parseError);
  }
});
