<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Super High Services</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <div class="container">
    <h1>Super High Services</h1>

    <!-- Registration Form -->
    <div id="registerSection" class="auth-section">
      <h2>Register</h2>
      <input type="text" id="regUsername" placeholder="Username" />
      <input type="email" id="regEmail" placeholder="Email" />
      <input type="password" id="regPassword" placeholder="Password" />
      <button onclick="registerUser()">Register</button>
    </div>

    <!-- Login Form -->
    <div id="loginSection" class="auth-section">
      <h2>Login</h2>
      <input type="text" id="loginUsername" placeholder="Username or Email" />
      <input type="password" id="loginPassword" placeholder="Password" />
      <button onclick="loginUser()">Login</button>
    </div>

    <!-- Dashboard -->
    <div id="dashboard" class="hidden">
      <h2>Welcome, <span id="userDisplay"></span></h2>

      <div class="nav-tabs">
        <button onclick="showTab('data')">Data Packages</button>
        <button onclick="showTab('wallet')">Wallet</button>
        <button onclick="showTab('history')">Order History</button>
      </div>

      <!-- Data Packages Tab -->
      <div id="dataTab" class="tab">
        <h3>Buy Data (Single)</h3>
        <select id="networkSelect">
          <option value="MTN">MTN</option>
          <option value="AirtelTigo">AirtelTigo</option>
          <option value="Telecel">Telecel</option>
        </select>
        <select id="packageSelect">
          <option value="1">1GB</option>
          <option value="2">2GB</option>
          <option value="5">5GB</option>
        </select>
        <input type="text" id="phoneInput" placeholder="Phone Number (e.g. 0551234567)" />
        <button onclick="placeSingleOrder()">Place Order</button>

        <h3>Bulk Orders</h3>
        <textarea id="bulkInput" rows="5" placeholder="Format: 0551234567 1"></textarea>
        <button onclick="placeBulkOrder()">Submit Bulk</button>
      </div>

      <!-- Wallet Tab -->
      <div id="walletTab" class="tab hidden">
        <h3>Your Wallet</h3>
        <p>Balance: GHS <span id="walletBalance">50.00</span></p>
        <input type="number" id="topupAmount" placeholder="Top Up Amount" />
        <button onclick="topUpWallet()">Top Up</button>

        <h3>Transfer</h3>
        <input type="text" id="transferUser" placeholder="Recipient Username" />
        <input type="number" id="transferAmount" placeholder="Amount to Transfer" />
        <button onclick="transferWallet()">Transfer</button>
      </div>

      <!-- Order History Tab -->
      <div id="historyTab" class="tab hidden">
        <h3>Order History</h3>
        <input type="date" id="filterDate" />
        <select id="networkFilter">
          <option value="">All Networks</option>
          <option value="MTN">MTN</option>
          <option value="AirtelTigo">AirtelTigo</option>
          <option value="Telecel">Telecel</option>
        </select>
        <button onclick="filterHistory()">Filter</button>
        <button onclick="exportCSV()">Export CSV</button>
        <table id="orderTable">
          <thead>
            <tr>
              <th>Date</th>
              <th>Phone</th>
              <th>Network</th>
              <th>Data (GB)</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    </div>
  </div>

  <script src="script.js"></script>
</body>
</html>
/* style.css */
body {
  font-family: Arial, sans-serif;
  background: #f3f3f3;
  margin: 0;
  padding: 0;
}
.container {
  max-width: 800px;
  margin: auto;
  background: white;
  padding: 20px;
  margin-top: 20px;
  border-radius: 8px;
}
h1 {
  text-align: center;
  color: #4CAF50;
}
.auth-section {
  margin-bottom: 20px;
}
input, select, textarea, button {
  display: block;
  width: 100%;
  margin-bottom: 10px;
  padding: 8px;
}
button {
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
}
button:hover {
  background-color: #45a049;
}
.hidden {
  display: none;
}
.nav-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
.nav-tabs button {
  flex: 1;
}
.tab {
  border-top: 1px solid #ccc;
  padding-top: 10px;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  border: 1px solid #ddd;
  padding: 8px;
}
th {
  background-color: #f2f2f2;
}
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
