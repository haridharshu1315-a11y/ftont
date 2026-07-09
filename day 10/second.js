const employees = [

{id:"EMP001",name:"Hariharan",age:22,department:"Software Developer",salary:"₹45,000"},
{id:"EMP002",name:"Arun",age:24,department:"HR",salary:"₹38,000"},
{id:"EMP003",name:"Vignesh",age:25,department:"Marketing",salary:"₹42,000"},
{id:"EMP004",name:"Karthick",age:26,department:"Finance",salary:"₹50,000"},
{id:"EMP005",name:"Praveen",age:23,department:"Testing",salary:"₹41,000"},
{id:"EMP006",name:"Naveen",age:24,department:"UI Designer",salary:"₹48,000"},
{id:"EMP007",name:"Sanjay",age:27,department:"Cloud Engineer",salary:"₹65,000"},
{id:"EMP008",name:"Ajith",age:25,department:"Cyber Security",salary:"₹70,000"},
{id:"EMP009",name:"Dinesh",age:22,department:"Support",salary:"₹34,000"},
{id:"EMP010",name:"Rakesh",age:26,department:"Frontend Developer",salary:"₹55,000"},
{id:"EMP011",name:"Bharath",age:24,department:"Networking",salary:"₹43,000"},
{id:"EMP012",name:"Saravanan",age:28,department:"Manager",salary:"₹80,000"},
{id:"EMP013",name:"Kavin",age:23,department:"QA Engineer",salary:"₹39,000"},
{id:"EMP014",name:"Lokesh",age:25,department:"AI Engineer",salary:"₹85,000"},
{id:"EMP015",name:"Manoj",age:27,department:"Data Analyst",salary:"₹62,000"},
{id:"EMP016",name:"Sathish",age:26,department:"DevOps",salary:"₹73,000"},
{id:"EMP017",name:"Gokul",age:22,department:"Sales",salary:"₹36,000"},
{id:"EMP018",name:"Yogesh",age:24,department:"Accounts",salary:"₹47,000"},
{id:"EMP019",name:"Ashwin",age:25,department:"Graphic Designer",salary:"₹52,000"},
{id:"EMP020",name:"Surya",age:23,department:"Full Stack Developer",salary:"₹68,000"}

];

const tableBody = document.getElementById("tableBody");

function displayEmployees(data){

tableBody.innerHTML="";

data.forEach(emp=>{

tableBody.innerHTML+=`
<tr>
<td>${emp.id}</td>
<td>${emp.name}</td>
<td>${emp.age}</td>
<td>${emp.department}</td>
<td>${emp.salary}</td>
</tr>
`;

});

}

displayEmployees(employees);

function searchEmployee(){

const value=document.getElementById("search").value.toLowerCase();

const filtered=employees.filter(emp=>

emp.name.toLowerCase().includes(value) ||
emp.department.toLowerCase().includes(value) ||
emp.id.toLowerCase().includes(value)

);

displayEmployees(filtered);

}

function logout(){

if(confirm("Are you sure you want to logout?")){

window.location.href="login.html";

}

}
function toggleTheme(){

document.body.classList.toggle("dark");

}

calculateSalary();

function calculateSalary(){

let total=0;

employees.forEach(emp=>{

let salary=parseInt(emp.salary.replace(/[₹,]/g,""));

total+=salary;

});

let avg=Math.round(total/employees.length);

let max=Math.max(...employees.map(e=>parseInt(e.salary.replace(/[₹,]/g,""))));

let min=Math.min(...employees.map(e=>parseInt(e.salary.replace(/[₹,]/g,""))));

document.getElementById("avgSalary").innerHTML="₹"+avg.toLocaleString();

document.getElementById("highestSalary").innerHTML="₹"+max.toLocaleString();

document.getElementById("lowestSalary").innerHTML="₹"+min.toLocaleString();

}