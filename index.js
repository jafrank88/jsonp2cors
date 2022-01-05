const express = require('express');
const app = express(); 
const PORT = process.env.PORT || 4001;

//Replacement for request (Axios/got/node-fetch)
const axios = require('axios');

// Loading middleware
const cors = require('cors');
const morgan = require("morgan");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  });

const favicon = require('serve-favicon')

// Serve Favicon
app.use(favicon('favicon.ico'))

// Middleware
app.use(helmet())
app.use(morgan("common"))
app.use(cors())

app.get('/api/:query', (req, res) => {
    const UserRequest = req.params.query
    console.log('UserRequest ' + UserRequest)
    const resp = axios.get('https://courtlistener.com/api/rest/v3/clusters/?q=' + UserRequest)
    .then (resp => res.json(resp.data))
    
});

//axios.get(('https://courtlistener.com/api/rest/v3/clusters/?q=' + UserRequest), function(error, response, body) => { 
  //  console.log('https://courtlistener.com/api/rest/v3/clusters/?q=' + UserRequest)
  //  console.log('Error :' + error)
  //  console.log('Response :' + response)
  //  console.log('Body :' + body)
// });




    //res.status(200).send(req('https://courtlistener.com/api/rest/v3/clusters/?q=' + $UserRequest) , (function(error, response, body)
            //const data = JSON.parse(body);
        


// catchall if it gets here
//app.all('*',(req,res)=>{
//    console.log('resource not found')
//})

// Creating a server with the PORT variable declared above
app.listen(PORT, (err) => {
    if (err) {
        console.error(err)
    }

    console.log('Listening on port ' + PORT)
})