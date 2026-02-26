* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: Arial, sans-serif;
}

body {
    background-color: #f4f6f9;
}

.dashboard {
    display: flex;
    min-height: 100vh;
}

/* Sidebar */
.sidebar {
    width: 220px;
    background: #1e293b;
    color: white;
    padding: 20px;
}

.sidebar h2 {
    margin-bottom: 20px;
}

.sidebar ul {
    list-style: none;
}

.sidebar li {
    padding: 10px 0;
    cursor: pointer;
    opacity: 0.8;
}

.sidebar li:hover {
    opacity: 1;
}

/* Main Content */
.main {
    flex: 1;
    padding: 20px;
}

.header {
    margin-bottom: 20px;
}

/* Cards */
.cards {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
}

.card {
    background: white;
    padding: 20px;
    flex: 1;
    border-radius: 12px;
    box-shadow: 0 4px 10px rgba(0,0,0,0.05);
}

.card h3 {
    margin-bottom: 10px;
    color: #555;
}

.card p {
    font-size: 28px;
    font-weight: bold;
    color: #111;
}

/* Form */
.form-section {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
}

.form-section input {
    padding: 10px;
    flex: 1;
    border-radius: 8px;
    border: 1px solid #ccc;
}

.form-section button {
    padding: 10px 20px;
    border: none;
    background: #2563eb;
    color: white;
    border-radius: 8px;
    cursor: pointer;
}

.form-section button:hover {
    background: #1d4ed8;
}

/* Table */
.table-container {
    background: white;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 4px 10px rgba(0,0,0,0.05);
}

table {
    width: 100%;
    border-collapse: collapse;
}

th, td {
    padding: 12px;
    text-align: left;
}

th {
    background: #f1f5f9;
}

tr:not(:last-child) {
    border-bottom: 1px solid #eee;
}
