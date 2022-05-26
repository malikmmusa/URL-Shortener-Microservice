require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require("body-parser");
const url = require('url');
const dns = require('dns');
const { nanoid } = require('nanoid')
const nano = nanoid();


// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.use("/", bodyParser.urlencoded({extended: false}))

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

var database = [];

app.post('/api/shorturl', (req, res) => {
  const original_url = req.body.url;
  const parsed_url = url.parse(original_url)
  if(parsed_url.hostname == null){
    res.json({ error: 'invalid url' })
  }
  const short_url = nanoid(3);
  database[short_url] = original_url
  res.json({ original_url : original_url, short_url : short_url})
})

app.get('/api/shorturl/:website?', (req, res) =>{
  const currentLink = req.params.website
  if(database[currentLink]){
    res.redirect(database[currentLink])
  }
  else{
    res.json({"error":"No short URL found for the given input"})
  }
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
