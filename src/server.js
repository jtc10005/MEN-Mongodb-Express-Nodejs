const express = require('express')
const bodyParser= require('body-parser')
const app = express()
const MongoClient = require('mongodb').MongoClient

app.use(bodyParser.urlencoded({extended: true}))

const mgdb = "mongodb://jtc-group_cluster0:c0nl@n1017@cluster0-shard-00-00-1xhpp.mongodb.net:27017,cluster0-shard-00-01-1xhpp.mongodb.net:27017,cluster0-shard-00-02-1xhpp.mongodb.net:27017/db1?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin";

console.log('root: ' + __dirname);

var db

MongoClient.connect(mgdb, (err, database) => {
  if (err) return console.log(err)
  db = database
  app.listen(3000, () => {
    console.log('listening on 3000')
  })
})

app.get('/', function (req, res) {
    console.log('get request');
    res.sendFile(__dirname + '/index.html');
})

app.post('/quotes', (req, res) => {

  console.log('Post recieved',req.body);
})