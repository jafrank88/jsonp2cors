const express = require('express');
const app = express(); 
const PORT = process.env.PORT || 80;

//Replacement for request (Axios, but could use got/node-fetch)
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

// Middleware//
app.use(morgan("common"))
app.use(cors())

//security
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
  })
);

// Main functions for five endpoints

app.get('/', function (req, res){
  res.jsonp({ title: 'This should be JSONP' });
});

app.get('/api/CL/', (req, res) => {
    let cluserrequest = req.query.q
    console.log('CL UserRequest ' + cluserrequest)
    console.log('rqc Callback : ' + req.query.callback)
    axios.get('https://courtlistener.com/api/rest/v3/search/?q=' + cluserrequest')
  .then(function (response) {
    console.log(response.data);
    console.log(response.status);
    console.log(response.statusText);
    console.log(response.headers);
    console.log(response.config);
    res.jsonp(response.data);
  });
    //let resp = axios.get('https://courtlistener.com/api/rest/v3/search/?q=' + cluserrequest )
    //console.log(axios.get('https://courtlistener.com/api/rest/v3/search/?q=' + cluserrequest ))
    //res.jsonp(axios.get('https://courtlistener.com/api/rest/v3/search/?q=' + cluserrequest ))
});

app.get('/api/CAP/', (req, res) => {
  let capuserrequest = req.query.q
  //console.log('CAP UserRequest ' + capuserrequest)
  //console.log('Callback : ' + req.query.callback)
  let resp = axios.get('https://api.case.law/v1/cases/?search=' + capuserrequest + '&jurisdiction=wash')
  //console.log (resp)
  .then res.jsonp(resp)
});

app.get('/api/WAC/', (req, res) => {
  let wacuserRequest = req.query.q
  console.log('WAC UserRequest ' + wacuserRequest)
  console.log('Callback : ' + req.query.callback)
  const resp = axios.get('https://lawdoccitelookup.leg.wa.gov/v1/Help/Api/WAC/?q=' + wacuserRequest)
  .then (resp => res.jsonp(resp.data))
});

app.get('/api/RCW/', (req, res) => {
  let rcwuserRequest = req.query.q
  console.log('RCW UserRequest ' + rcwuserRequest)
  console.log('Callback : ' + req.query.callback)
  const resp = axios.get('https://search.leg.wa.gov/v1/Help/Api/RCW/?q=' + rcwuserRequest)
  .then (resp => res.jsonp(resp.data))
});

app.get('/api/WLH/', (req, res) => {
  let wlhuserRequest = req.query.q
  console.log('WLH UserRequest ' + wlhuserRequest)
  console.log('Callback : ' + req.query.callback)
  const resp = axios.get('https://www.washingtonlawhelp.org/search?q=' + wlhuserRequest)
  .then (resp => res.jsonp(resp.data))
});

app.listen(PORT, (err) => {
    if (err) {
        console.error(err)
    }

    console.log('Listening on port ' + PORT)
})