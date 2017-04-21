const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const MongoClient = require('mongodb').MongoClient

app.use(bodyParser.urlencoded({ extended: true }))

var mgdb = "mongodb://MEN_TEST:MEN_TEST!@ds139899.mlab.com:39899/mongo_node";
console.log('root: ' + __dirname);

var db

MongoClient.connect(mgdb, (err, database) => {
    if (err) return console.log(err)
    db = database
    app.listen(3000, () => {
        console.log('listening on 3000')
    })
})

app.get('/', (req, res) => {
    console.log('get request');
    var cursor = db.collection('quotes').find().toArray(function (err, results) {
        console.log(results)
        // send HTML file populated with quotes here
    })
    res.sendFile(__dirname + '/index.html');
})

app.post('/quotes', (req, res) => {
    console.log('Post recieved', req.body);

    db.collection('quotes').save(req.body, (err, result) => {
        if (err) return console.log(err)

        console.log('saved to database')
        res.redirect('/')
    })
});