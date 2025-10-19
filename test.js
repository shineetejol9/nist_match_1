import fetch from "node-fetch";

const response = await fetch("http://localhost:5000/api/saveProfile", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "Alice",
    email: "alice@example.com",
    age: "25",
    gender: "Female",
    location: "Delhi"
  }),
});

const data = await response.json();
console.log(data);
