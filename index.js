const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require ('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ctgcy.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();
app.use(bodyParser.json());
app.use(cors());

const port = 5000;

app.get('/',(req, res) =>{
    res.send('hello from dB its working!')
})


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const playerCollection = client.db("playerData").collection("players");

  app.post('/addPlayer', (req, res) => {
      const players = req.body;
      playerCollection.insertMany(players)
      .then(result => {
          console.log(result);
          console.log(result.insertedCount);
          res.send(result.insertedCount)
      })
  })

  app.get('/players', (req, res) => {
      playerCollection.find({})
      .toArray((err, documents) => {
          res.send(documents)
      })
  })

});


app.listen(process.env.PORT || port);