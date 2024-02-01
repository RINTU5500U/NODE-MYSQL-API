const express = require("express")
const router = express.Router()
const jwt = require('jsonwebtoken')
const { db } = require('./server')
const { authentication, authorization } = require("./auth")

//add new user
router.post('/createUser', async (req, res) => {
    try {
        let { Name, Email, Password, DOB } = req.body;
        if (!Name || !Email || !Password || !DOB) {
            return res.status(400).send('Please provide all required fields');
        }

        await db.query('INSERT INTO Register (Name, Email, Password, DOB) VALUES (?,?,?,?)', [Name, Email, Password, DOB], (error, results) => {
            if (error) {
                console.error('MySQL Error:', error);
                return res.status(500).send({ status: false, msg: error.message });
            }
            return res.status(201).send({ status: true, msg: 'Data created successfully', Data: results });
        });
    } catch (error) {
        return res.status(500).send({ status: false, msg: error.message });
    }

})

//login api
router.post('/login', (req, res) = async (req, res) => {
    try {
        let { Email, Password } = req.body
        if (!Email || !Password) {
            return res.status(400).send({ status: false, msg: 'Please provide both Email and Password' });
        }

        const results = await db.query('SELECT * FROM Register WHERE Email = ? AND Password = ?', [Email, Password]);

        if (results.length === 0) {
            return res.status(404).send({ status: false, msg: 'User not found' });
        }

        // User found, generate a JWT
        const user = results[0];
        const token = jwt.sign({ userId: user.id }, 'Secret-key', { expiresIn: '1h' });

        // Send the JWT as part of the response
        return res.status(200).send({ status: true, msg: 'Login successful', token });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
})

//update an user
router.put('/updateUser/:userId', authentication, authorization, async (req, res) => {
    let { userId } = req.params
    let { Name, Email, Password, DOB } = req.body

    let updateData = {
        Name, Email, Password, DOB
    }

    if (!userId) {
        return res.status(400).json({
            msg: 'plz provide user id'
        })
    }
    await db.query('UPDATE Register SET ? WHERE id = ?', [updateData, userId], (error, results) => {
        if (error) {
            throw error
        }
        return res.status(200).send({ status: true, msg: "Data updated successfully", Data: results })
    })
})

//retrives user by id
router.get('/getUserById/:userid', authentication, async (req, res) => {
    let { userId } = req.params
    if (!userId) {
        return res.status(400).json({
            msg: 'plz provide userId'
        })
    }
    await db.query('SELECT * FROM Register WHERE id=?', userId, (error, results) => {
        if (error) {
            throw error
        }
        return res.status(200).send({ status: true, msg: "Data fetched successfully", Data: results })
    })
})

//retrives all user
router.get('/getAllUser', authentication, async (req, res) => {
    await db.query("SELECT * FROM Register", (error, results) => {
        if (error) {
            throw error
        }
        return res.status(200).send({ status: true, msg: "Data fetched successfully", Data: results })
    })
})

//delete an user
router.delete('/deleteUser/:userId', authentication, authorization, async (req, res) => {
    let { userId } = req.params
    if (!userId) {
        return res.status(400).json({
            msg: 'plz provide user id'
        })
    }
    await db.query('DELETE FROM Register WHERE id = ?', [userId], (error, results) => {
        if (error) {
            throw error
        }
        return res.status(204).send({ status: true, msg: "Data deleted successfully" })
    })
})

module.exports = router