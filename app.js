// load our app server using express somehow....
const cool = require('cool-ascii-faces');
const express = require('express')
const app = express()
const morgan = require('morgan')
const mysql = require('mysql')
const PORT = process.env.PORT || 5000
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.static('./public'))

app.use(morgan('combined'))

const router = require('./routes/user.js')

app.use(router)
app.use(router)
//app.use(express.static(__dirname))

app.get("/", (req, res) => {
    console.log("Responding to root route")
    res.send("Hello from ROOOOOT")
})

app..get('/times', (req, res) => res.send(showTimes()))

showTimes = () => {
    let result = '';
    const times = process.env.TIMES || 5;
    for (i = 0; i < times; i++) {
        result += i + ' ';
    }
    return result;
}

app.listen(PORT, () => {
    console.log('Running on', PORT);
});