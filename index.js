const express = require('express');
const app = express(); 
const PORT = process.env.PORT || 80;

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

app.get('/api/CL/', (req, res) => {
    let cluserrequest = req.query
    //let callback= req.query.callback
    console.log('UserRequest ' + cluserrequest)
    //console.log('Callback : ' + callback)
    const resp = axios.get('https://courtlistener.com/api/rest/v3/search/?q=' + cluserrequest )
    .then (resp => res.jsonp(resp.data))
});

app.get('/api/CAP/', (req, res) => {
  let capuserrequest = req.query
  console.log('UserRequest ' + capuserrequest)
  const resp = axios.get('https://api.case.law/v1/cases/?search=' + capuserrequest + '&jurisdiction=wash')
  .then (resp => res.jsonp(resp.data))
});

app.get('/api/WAC/:query', (req, res) => {
  let WACUserRequest = req.params.query
  console.log('UserRequest ' + WACUserRequest)
  const resp = axios.get('https://lawdoccitelookup.leg.wa.gov/v1/Help/Api/WAC/?q=' + WACUserRequest)
  .then (resp => res.jsonp(resp.data))
});

app.get('/api/RCW/:query', (req, res) => {
  let RCWUserRequest = req.params.query
  console.log('UserRequest ' + RCWUserRequest)
  const resp = axios.get('https://search.leg.wa.gov/v1/Help/Api//RCW/?q=' + RCWUserRequest)
  .then (resp => res.jsonp(resp.data))
});

app.listen(PORT, (err) => {
    if (err) {
        console.error(err)
    }

    console.log('Listening on port ' + PORT)
})