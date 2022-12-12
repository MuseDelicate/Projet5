let searchParams = new URLSearchParams(window.location.search);
console.log(window.location.search);
const orderId = searchParams.get("id");
console.log(orderId);

let spanOrderId = document.getElementById('orderId');

spanOrderId.innerHTML = orderId;
localStorage.clear();