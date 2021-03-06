const fetch_poly = require('whatwg-fetch');

const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const MongoClient = require('mongodb').MongoClient

var path = require('path');

app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.json())

app.set('view engine', 'ejs') //setting ejs as the view engine
app.set("views", path.join(__dirname, '/views')); //set location of views directory for serving

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
    db.collection('quotes').find().toArray((err, result) => {
        if (err) return console.log(err)
        // renders index.ejs
        res.render('index.ejs', {
            quotes: result
        })
    })
})

app.get('/json', (req, res) => {
    console.log('get request');
    db.collection('quotes').find().toArray((err, result) => {
        if (err) return console.log(err)
        console.log('collection', result);
        res.json({
            quotes: result
        });
    })
})

app.get('/json2', (req, res) => {
    console.log('get request');
    db.collection('quotes').find().toArray((err, result) => {
        if (err) {
            //if error log error to console and respone error in json
            console.log(err);
            res.status(400).json(err);
        }
        console.log('collection', result);
        res.status(200).json(result);
        // res.writeHead(200, {
        //     'Content-Type': 'text/json'
        // });
        // res.end(JSON.stringify(result));
    });
})



app.post('/quotes', (req, res) => {
    console.log('Post recieved', req.body);

    db.collection('quotes').save(req.body, (err, result) => {
        if (err) return console.log(err)

        console.log('saved to database')
        res.redirect('/')
    })
});


app.put('/quotes', (req, res) => {
    console.log('Put recieved', req.body);

    db.collection('quotes')
        .findOneAndUpdate({
            name: 'yoda'
        }, {
            $set: {
                name: req.body.name,
                quote: req.body.quote
            }
        }, {
            sort: {
                _id: -1
            },
            upsert: true
        }, (err, result) => {
            if (err) return res.send(err)
            res.send(result)
        })
})


app.delete('/quotes', (req, res) => {
    console.log('delete recieved', req.body.name);
    db.collection('quotes').findOneAndDelete({
            name: req.body.name
        },
        (err, result) => {
            console.log('got here')
            if (err) return res.send(500, err)
            res.send('A darth vadar quote got deleted')
        })
})