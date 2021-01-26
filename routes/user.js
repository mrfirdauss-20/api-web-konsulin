// will contain all of my user related routes
const express = require('express')
const mysql = require('mysql')
const router = express.Router()


router.get('/messages', (req, res) => {
  console.log("11111111")
  res.end()
})
const connecting = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'rSqii2007',
  database: 'ustaz_mysql'
});

function getConnection() {
  return connecting
}


router.get("/ustaz", (req, res) => {
    const connection = getConnection()
    const queryString = "SELECT * FROM data_ustaz"
    connection.query(queryString, (err, rows, fields) => {
      if (err) {
        console.log("Failed to query for users: " + err)
        res.sendStatus(500)
        return
      }
      res.json(rows)
    })
  })


router.post('/ustaz_create', (req, res) => {
    console.log("Trying to create a new user...")
    console.log("How do we get the form data???")
  
    const NamaLengkap = req.body.NamaLengkap;
    const almamater = req.body.almamater;
  
    const queryString = "INSERT INTO data_ustaz (NamaLengkap, almamater) VALUES (?, ?)"
    getConnection().query(queryString, [NamaLengkap, almamater], (err, results, fields) => {
      if (err) {
        console.log("Failed to insert new user: " + err)
        res.sendStatus(500)
        return
      }
  
      console.log("Inserted a new user with id: ", results.insertId);
      res.end()
    })
  })
  
router.get('/ustaz/:id', (req, res) => {
    console.log("Fetching user with id: " + req.params.id)

    const connection = getConnection()

    const userId = req.params.id
    const queryString = "SELECT * FROM data_ustaz WHERE id = ?"
    connection.query(queryString, [userId], (err, rows, fields) => {
        if (err) {
        console.log("Failed to query for users: " + err)
        res.sendStatus(500)
        return
        // throw err
        }

        console.log("I think we fetched users successfully")

        const users = rows.map((row) => {
        return {NamaLengkap: row.NamaLengkap, Almamater: row.almamater}
        })

        res.json(users)
    })
})

module.exports = router