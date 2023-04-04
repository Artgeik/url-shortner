require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const parser = require("body-parser");

// Basic Configuration
const port = process.env.PORT || 3000;
const map={};
app.use(cors());
app.use(parser.urlencoded({extended: false}));
app.use(parser.json());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

const reg=/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/
app.post('/api/shorturl', function(req, res) {
  const originalUrl=req.body.url;
  if(reg.test(originalUrl)){
    const short=Math.floor(Math.random()*100000);
    map[short]=originalUrl;
    res.json({"original_url":originalUrl,"short_url":short});
  }else{
    res.json({ error: 'invalid url' });
  }
});

app.get('/api/shorturl/:short_url',function(req,res){
  res.redirect(map[req.params.short_url]);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
