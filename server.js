
const express = require('express')
const mysql = require('mysql2')
const dotenv = require('dotenv')
const route = require('./route')
const PORT = 3000
dotenv.config()
const app = express()

// 5432
let db = mysql.createConnection({
    host: process.env.hostname,
    user: 'root',
    password: process.env.password,
    database: "node_mysql_api",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL as id ' + db.threadId);

    // Create the Register table if it doesn't exist
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS Register (
        ID INT PRIMARY KEY AUTO_INCREMENT,
        Name VARCHAR(255) NOT NULL,
        Email VARCHAR(255) NOT NULL,
        Password VARCHAR(255) NOT NULL,
        DOB DATE,
        CreatedTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    db.query(createTableQuery, (tableErr, tableResult) => {
        if (tableErr) {
            console.error('Error creating Register table: ' + tableErr.stack);
            return;
        }
        console.log('Register table created or already exists');
    });
});

module.exports = {db}

app.use(express.json())

app.use("/",route)

app.listen(PORT, () => {
    console.log(`server is running on ${PORT}...`)
})
