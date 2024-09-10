document.addEventListener('DOMContentLoaded', () => {
  const employeeForm = document.getElementById('employeeForm');
  const employeeList = document.getElementById('employeeList');
  const name = document.getElementById('name');
  const salary = document.getElementById('salary');
  const addButton = document.getElementById('addButton');
  const updateButton = document.getElementById('updateButton');

  let selectedEmployeeId = null;

  const fetchEmployees = () => {
    fetch('/employees')
      .then(res => res.json())
      .then(data => {
        employeeList.innerHTML = '';
        data.forEach(employee => {
          const li = document.createElement('li');
          li.innerHTML = `
            ${employee.name} - ₹${employee.salary}
            <div>
              <button onclick="editEmployee(${employee.id})">Edit</button>
              <button onclick="deleteEmployee(${employee.id})">Delete</button>
            </div>
          `;
          employeeList.appendChild(li);
        });
      });
  };

  const isNameValid = (name) => {
      const regex = /^[A-Za-z\s]+$/;
      return regex.test(name);
  };

  const showAlert = (message) => {
      alert(message);
  };

  addButton.addEventListener('click', () => {
      if (!isNameValid(name.value)) {
          showAlert('Please enter a valid name. Only alphabetic characters and spaces are allowed.');
          return;
      }

      fetch('/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.value,
          salary: salary.value,
        }),
      })
      .then(res => res.json())
      .then(() => {
        name.value = '';
        salary.value = '';
        fetchEmployees();
      });
  });

  updateButton.addEventListener('click', () => {
      if (!isNameValid(name.value)) {
          showAlert('Please enter a valid name. Only alphabetic characters and spaces are allowed.');
          return;
      }

      if (selectedEmployeeId !== null) {
          fetch(`/employees/${selectedEmployeeId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: name.value,
              salary: salary.value,
            }),
          })
          .then(res => res.json())
          .then(() => {
            selectedEmployeeId = null;
            name.value = '';
            salary.value = '';
            addButton.style.display = 'inline';
            updateButton.style.display = 'none';
            fetchEmployees();
          });
      }
  });

  window.editEmployee = (id) => {
    fetch(`/employees/${id}`)
      .then(res => res.json())
      .then(data => {
        selectedEmployeeId = data.id;
        name.value = data.name;
        salary.value = data.salary;
        addButton.style.display = 'none';
        updateButton.style.display = 'inline';
      });
  };

  window.deleteEmployee = (id) => {
    fetch(`/employees/${id}`, {
      method: 'DELETE',
    }).then(() => fetchEmployees());
  };

  fetchEmployees();
});
