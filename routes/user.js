// will contain all of my user related routes
const express = require('express')
const mysql = require('mysql')
const router = express.Router()


router.get('/messages', (req, res) => {
  console.log("11111111")
  res.end()
})
const connecting = mysql.createConnection({
  host: 'remotemysql.com',
  user: 'MqISQsRFUS',
  password: 'Zynv6BoeQE',
  database: 'MqISQsRFUS'
});

function getConnection() {
  return connecting
}

const connection = getConnection()

router.get("/ustaz", (req, res) => {
   
    const queryString = "SELECT * FROM data_ustaz"
    connection.query(queryString, (err, rows, fields) => {
      if (err) {
        console.log("Failed to query for users: " + err)
        res.sendStatus(500)
        return
      }
      res.send(rows)
    })
  })

router.get("/event", (req, res) => {

  const queryString = "SELECT * FROM event"
  connection.query(queryString, (err, rows, fields) => {
    if (err) {
      console.log("Failed to query for users: " + err)
      res.sendStatus(500)
      return
    }
    res.send(rows)
  })
})

router.post('/tambahUstaz', (req, res) => {
    console.log("Trying to create a new user...")
    console.log("How do we get the form data???")
  
    const NamaLengkap = req.body.NamaLengkap;
    const almamater = req.body.almamater;
    const photo = req.body.photo;
    const kategorii = req.body.kategori;
    const kat = kategorii.charAt(0).toUpperCase() + kategorii.slice(1)
  
    const queryString = "INSERT INTO data_ustaz (NamaLengkap, almamater, photo, kategori) VALUES (?, ?, ?,?)"
    getConnection().query(queryString, [NamaLengkap, almamater, photo, kat], (err, results, fields) => {
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

    //const connection = getConnection()

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
        return {NamaLengkap: row.NamaLengkap, Almamater: row.almamater, photo: row.photo,kategori:row.kategori}
        })
        res.send(users)
    })
})

router.get('/artikel/isi/:id', (req, res) => {
  console.log("Fetching user with id: " + req.params.id)

  //const connection = getConnection()

  const userId = req.params.id
  const queryString = "SELECT * FROM artikel WHERE idartikel = ?"
  connection.query(queryString, [userId], (err, rows, fields) => {
    if (err) {
      console.log("Failed to query for users: " + err)
      res.sendStatus(500)
      return
      // throw err
    }

    console.log("I think we fetched users successfully")

    const users = rows.map((row) => {
      return {isi: row.isi}
    })
    res.send(users)
  })
})

router.get('/ustaz/almamater/:name', (req, res) => {
  console.log("Fetching user with id: " + req.params.id)

  //const connection = getConnection()

  const username = req.params.name
  const queryString = "SELECT * FROM data_ustaz WHERE almamater = ?"
  connection.query(queryString, [username], (err, rows, fields) => {
    if (err) {
      console.log("Failed to query for users: " + err)
      res.sendStatus(500)
      return
      // throw err
    }

    console.log("I think we fetched users successfully")

    const users = rows.map((row) => {
      return { NamaLengkap: row.NamaLengkap, Almamater: row.almamater, photo: row.photo, kategori: row.kategori }
    })
    res.send(users)
  })
})

//Artikel
//get artikel by id
router.get('/artikel/:id', (req, res) => {
  console.log("Fetching user with id: " + req.params.id)

  //const connection = getConnection()

  const arId = req.params.id
  const queryString = "SELECT * FROM artikel WHERE idartikel = ?"
  connection.query(queryString, [arId], (err, rows, fields) => {
    if (err) {
      console.log("Failed to query for users: " + err)
      res.sendStatus(500)
      return
      // throw err
    }

    console.log("I think we fetched users successfully")

    const users = rows.map((row) => {
      return { judulArtikel: row.judulArtikel, Penulis: row.penulis, kategori: row.kategori, tanggal: row.tanggal }
    })
    res.send(users)
  })
})

//get all artikel 
router.get('/artikel', (req, res) => {
  console.log("Fetching user with id: " + req.params.id)

  //const connection = getConnection()

  const queryString = "SELECT * FROM artikel"
  connection.query(queryString, (err, rows, fields) => {
    if (err) {
      console.log("Failed to query for users: " + err)
      res.sendStatus(500)
      return
      // throw err
    }

    console.log("I think we fetched users successfully")

    res.send(rows)
  })
})

//tulis artikel 
router.post('/tambahArtikel', (req, res) => {
  console.log("Trying to create a new user...")
  console.log("How do we get the form data???")

  const judul = req.body.judulArtikel;
  const penulis = req.body.penulis;
  const kategorii = req.body.kategori;
  const isi = req.body.isi;

  const kategori = kategorii.charAt(0).toUpperCase() + kategorii.slice(1)
  const d = new Date();
  const tanggal = d.getFullYear() + '-' + d.getMonth()+1 + '-' + d.getDate();

  const queryString = "INSERT INTO artikel (judulArtikel, isi, tanggal, penulis, kategori) VALUES (?,?,?, ?, ?)"
  getConnection().query(queryString, [judul, isi,tanggal,penulis, kategori], (err, results, fields) => {
    if (err) {
      console.log("Failed to insert new user: " + err)
      res.sendStatus(500)
      return
    }

    console.log("Inserted a new user with id: ", results.insertId);
    res.end()
  })
})

router.put('/editArtikel', (req, res) => {
  console.log("Trying to create a new user...")
  console.log("How do we get the form data???")

  const judul = req.body.judulArtikel;
  const penulis = req.body.penulis;
  const kategorii = req.body.kategori;
  const isi = req.body.isi;
  const arId = req.body.arId;

  const kategori = kategorii.charAt(0).toUpperCase() + kategorii.slice(1)
  const d = new Date();
  const tanggal = d.getFullYear() + '-' + d.getMonth() + 1 + '-' + d.getDate();

  const queryString = "UPDATE artikel SET judulArtikel=$1, isi=$2, tanggal=$3, penulis=$4, kategori=$5, id=$6)"
  pool.query(queryString, [judul, isi, tanggal, penulis, kategori, arId], (err, results, fields) => {
    if (err) {
      console.log("Failed to insert new user: " + err)
      res.sendStatus(500)
      return
    }

    console.log("Inserted a new user with id: ", results.insertId);
    res.end()
  })
})

//
router.get('/ustaz/kategori/:name', (req, res) => {
  console.log("Fetching user with id: " + req.params.id)

  //const connection = getConnection()

  const username = req.params.name
  const queryString = "SELECT * FROM data_ustaz WHERE kategori = ?"
  connection.query(queryString, [username], (err, rows, fields) => {
    if (err) {
      console.log("Failed to query for users: " + err)
      res.sendStatus(500)
      return
      // throw err
    }

    console.log("I think we fetched users successfully")

    const users = rows.map((row) => {
      return { NamaLengkap: row.NamaLengkap, Almamater: row.almamater, photo: row.photo, kategori:row.kategori }
    })
    res.send(users)
  })
})


//
router.get('/artikel/kategori/:name', (req, res) => {
  console.log("Fetching user with id: " + req.params.id)

  //const connection = getConnection()

  const username = req.params.name;
  const queryString = "SELECT * FROM artikel WHERE kategori = ?"
  connection.query(queryString, [username], (err, rows, fields) => {
    if (err) {
      console.log("Failed to query for users: " + err)
      res.sendStatus(500)
      return
      // throw err
    }

    console.log("I think we fetched users successfully")

  
    res.send(rows)
  })
})

//
router.get('/artikel/cari/:name', (req, res) => {
  console.log("Fetching user with cari: " + req.params.name)

  //const connection = getConnection()

  const username = req.params.name;
  const queryString = "SELECT * FROM artikel WHERE judulArtikel LIKE \"*?*\""
  connection.query(queryString, [username], (err, rows, fields) => {
    if (err) {
      console.log("Failed to query for users: " + err)
      res.sendStatus(500)
      return
      // throw err
    }

    console.log("I think we fetched users successfully")


    res.send(rows)
  })
})


module.exports = router