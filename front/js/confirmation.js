// Extraction de l'id de l'URL au format "?id=..."
const url_id = document.location.search;

// Extraction de l'id
const url = new URLSearchParams(url_id);
const orderId = url.get("id")

document.querySelector("#orderId").innerHTML = orderId;


