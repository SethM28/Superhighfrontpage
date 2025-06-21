// script.js
let users = [];
let currentUser = null;
let walletBalance = 50;
let orderHistory = [];

function registerUser() {
  const username = document.getElementById("regUsername").value;
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;

  if (!username || !email || !password) return alert("Fill all fields");

  users.push({ username, email, password, approved: true }); // Simulating auto-approval
  alert("Registration submitted. Please login.");
}

function loginUser() {
  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;

  const user = users.find(u =>
    (u.username === username || u.email === username) && u.password === password
  );

  if (user && user.approved) {
    currentUser = user;
    document.getElementById("userDisplay").innerText = user.username;
    document.getElementById("registerSection").classList.add("hidden");
    document.getElementById("loginSection").classList.add("hidden");
    document.getElementById("dashboard").classList.remove("hidden");
  } else {
    alert("Invalid credentials or not approved.");
  }
}

function showTab(tab) {
  ["dataTab", "walletTab", "historyTab"].forEach(id =>
    document.getElementById(id).classList.add("hidden")
  );
  document.getElementById(tab + "Tab").classList.remove("hidden");
}

function placeSingleOrder() {
  const phone = document.getElementById("phoneInput").value;
  const network = document.getElementById("networkSelect").value;
  const data = document.getElementById("packageSelect").value;

  if (phone.length !== 10 || !phone.startsWith("0")) {
    return alert("Phone number must be 10 digits and start with 0.");
  }

  orderHistory.push({
    date: new Date().toLocaleString(),
    phone,
    network,
    data,
    status: "Pending"
  });

  alert("Order placed!");
  updateHistory();
}

function placeBulkOrder() {
  const lines = document.getElementById("bulkInput").value.trim().split("\n");
  for (let line of lines) {
    let [phone, data] = line.split(" ");
    if (!phone || !data) return alert("Invalid line: " + line);
    if (phone.length !== 10 || !phone.startsWith("0")) return alert("Invalid phone: " + phone);
    if (data.includes("GB")) return alert("Don't include GB: " + line);

    orderHistory.push({
      date: new Date().toLocaleString(),
      phone,
      network: "Unknown",
      data,
      status: "Pending"
    });
  }
  alert("Bulk orders placed.");
  updateHistory();
}

function topUpWallet() {
  const amount = parseFloat(document.getElementById("topupAmount").value);
  if (amount > 0) {
    walletBalance += amount;
    updateWallet();
  }
}

function transferWallet() {
  const user = document.getElementById("transferUser").value;
  const amount = parseFloat(document.getElementById("transferAmount").value);
  if (walletBalance >= amount && amount > 0) {
    walletBalance -= amount;
    alert("Transferred GHS " + amount + " to " + user);
    updateWallet();
  } else {
    alert("Insufficient funds.");
  }
}

function updateWallet() {
  document.getElementById("walletBalance").innerText = walletBalance.toFixed(2);
}

function updateHistory() {
  const tbody = document.querySelector("#orderTable tbody");
  tbody.innerHTML = "";
  orderHistory.forEach(order => {
    const row = `<tr>
      <td>${order.date}</td>
      <td>${order.phone}</td>
      <td>${order.network}</td>
      <td>${order.data}</td>
      <td>${order.status}</td>
    </tr>`;
    tbody.innerHTML += row;
  });
}

function filterHistory() {
  const date = document.getElementById("filterDate").value;
  const network = document.getElementById("networkFilter").value;

  const tbody = document.querySelector("#orderTable tbody");
  tbody.innerHTML = "";

  orderHistory
    .filter(order => {
      return (!date || order.date.includes(date)) &&
             (!network || order.network === network);
    })
    .forEach(order => {
      const row = `<tr>
        <td>${order.date}</td>
        <td>${order.phone}</td>
        <td>${order.network}</td>
        <td>${order.data}</td>
        <td>${order.status}</td>
      </tr>`;
      tbody.innerHTML += row;
    });
}

function exportCSV() {
  let csv = "Date,Phone,Network,Data,Status\n";
  orderHistory.forEach(order => {
    csv += `${order.date},${order.phone},${order.network},${order.data},${order.status}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.setAttribute("href", url);
  a.setAttribute("download", "order-history.csv");
  a.click();
}
