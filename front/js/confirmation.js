let searchParams = new URLSearchParams(window.location.search);
const orderId = searchParams.get("id");

let spanOrderId = document.getElementById('orderId');

spanOrderId.textContent = orderId;
localStorage.clear();