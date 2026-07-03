let cart = JSON.parse(localStorage.getItem("cart")) || [];

function addCart(name, price){

cart.push({
name:name,
price:price,
qty:1
});

localStorage.setItem("cart",JSON.stringify(cart));

alert(name + " added to cart!");

}

function loadCart(){

let table=document.getElementById("cartTable");

let total=0;

if(!table) return;

table.innerHTML="";

cart.forEach((item,index)=>{

let amount=item.price*item.qty;

total+=amount;

table.innerHTML+=`

<tr>

<td>${item.name}</td>

<td>₹${item.price}</td>

<td>${item.qty}</td>

<td>₹${amount}</td>

<td>

<button onclick="removeItem(${index})">

Remove

</button>

</td>

</tr>

`;

});

document.getElementById("grandTotal").innerHTML=total;

}

function removeItem(index){

cart.splice(index,1);

localStorage.setItem("cart",JSON.stringify(cart));

loadCart();

}

loadCart();