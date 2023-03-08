
const express = require('express')
const mysql = require('mysql')
const dotenv = require('dotenv')
const PORT = 3000
dotenv.config()
const app = express()

app.use(express.json())
// 5432
let db = mysql.createConnection({
    host: "localhost",
    user: 'root',
    password: process.env.password,
    database: "node_mysql_api"
})
let x = process.env.password
console.log(x)
db.connect()

app.get('/', (req, res) => {
    res.send('hello world')
})

//retrives all user
app.get('/users', (req, res) => {
    db.query("SELECT * FROM users", (error, results) => {
        if (error) {
            throw error
        }
        return res.json({
            data: results
        })
    })
})

//retrives user by id
app.get('/user/:id', (req, res) => {
    let userId = req.params.id
    if (!userId) {
        return res.status(400).json({
            msg: 'plz provide userId'
        })
    }
    db.query('SELECT * FROM users WHERE id=?', userId, (error, results) => {
        if (error) {
            throw error
        }
        return res.json({
            data: results[0]
        })
    })
})

//add new user
app.post('/user/add', (req, res) => {
    let {name, email, phoneNumber} = req.body
    if (! name || !email) {
        return res.send('please provide required fields')
    }
    db.query('INSERT INTO users (name,email,phoneNumber) VALUES (?,?,?)', [name, email, phoneNumber], (error, results) => {
        if (error) {
            throw error
        }
        return res.json({
            msg: 'User added successfully',
            data: results
        })
    })
})

//update an user
app.put('/user/:id', (req, res) => {
    let userId = req.params.id
    let {name, email, phoneNumber} = req.body

    let user = {
        name,
        email,
        phoneNumber
    }

    if (!user || !userId) {
        return res.status(400).json({
            msg: 'plz provide user id and user'
        })
    }
    db.query('UPDATE users SET ? WHERE id = ?', [user, userId], (error, results) => {
        if (error) {
            throw error
        }
        return res.json({
            msg: 'Updated user sucessfully',
            data: results
        })
    })
})

//delete an user
app.delete('/user/:id', (req, res) => {
    let userId = req.params.id

    if (!userId) {
        return res.status(400).json({
            msg: 'plz provide user id'
        })
    }
    db.query('DELETE FROM users WHERE id = ?', [userId], (error, results) => {
        if (error) {
            throw error
        }
        return res.json({
            msg: 'User deleted sucessfully'
        })
    })
})

app.listen(PORT, () => {
    console.log(`server is running on ${PORT}...`)
})