let employees = JSON.parse(localStorage.getItem("employees")) || [];

const form = document.getElementById("employeeForm");
const table = document.getElementById("employeeTable");
const search = document.getElementById("search");

form.addEventListener("submit", addEmployee);

function addEmployee(e) {
    e.preventDefault();

    const employee = {
        id: document.getElementById("empid").value,
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        department: document.getElementById("department").value,
        position: document.getElementById("position").value,
        salary: Number(document.getElementById("salary").value)
    };

    employees.push(employee);
    saveData();
    displayEmployees();
    form.reset();
}

function displayEmployees(list = employees) {

    table.innerHTML = "";

    list.forEach((emp, index) => {

        table.innerHTML += `
        <tr>
            <td>${emp.id}</td>
            <td>${emp.name}</td>
            <td>${emp.email}</td>
            <td>${emp.phone}</td>
            <td>${emp.department}</td>
            <td>${emp.position}</td>
            <td>₹${emp.salary.toLocaleString()}</td>
            <td>
                <button class="edit-btn" onclick="editEmployee(${index})">
                    ✏️
                </button>

                <button class="delete-btn" onclick="deleteEmployee(${index})">
                    🗑️
                </button>
            </td>
        </tr>
        `;
    });

    updateDashboard();
}

function deleteEmployee(index) {

    if(confirm("Delete this employee?")){

        employees.splice(index,1);

        saveData();

        displayEmployees();

    }

}

function editEmployee(index){

    let emp = employees[index];

    document.getElementById("empid").value = emp.id;
    document.getElementById("name").value = emp.name;
    document.getElementById("email").value = emp.email;
    document.getElementById("phone").value = emp.phone;
    document.getElementById("department").value = emp.department;
    document.getElementById("position").value = emp.position;
    document.getElementById("salary").value = emp.salary;

    employees.splice(index,1);

    saveData();

    displayEmployees();

}

function updateDashboard(){

    document.getElementById("empCount").innerText = employees.length;

    const departments = [...new Set(employees.map(e => e.department))];

    document.getElementById("deptCount").innerText = departments.length;

    let totalSalary = employees.reduce((sum,e)=>sum+e.salary,0);

    document.getElementById("salaryCount").innerText =
    "₹" + totalSalary.toLocaleString();

}

function saveData(){

    localStorage.setItem("employees",JSON.stringify(employees));

}

search.addEventListener("keyup",function(){

    let value = this.value.toLowerCase();

    let filtered = employees.filter(emp=>

        emp.name.toLowerCase().includes(value) ||

        emp.department.toLowerCase().includes(value) ||

        emp.position.toLowerCase().includes(value)

    );

    displayEmployees(filtered);

});

displayEmployees();