
const express = require('express')
const app = express();
const processSecret = require('./Utils');
const {getRecentTenEmail, getMailBodyById} = require('./models');
// respond with "hello world" when a GET request is made to the homepage
app.get('/topTenPosts', function (req, res) {
  processSecret(getRecentTenEmail);
})
 
app.get('/body/:id', function(req,res) {
  processSecret(getMailBodyById, req.params.id);
})

app.listen(5000);
console.log('APP listening on port 5000!');


 
 
