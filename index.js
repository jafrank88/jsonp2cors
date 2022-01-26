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

const favicon = require('serve-favicon');

// Serve Favicon
app.use(favicon('favicon.ico'))

// Middleware//
app.use(helmet())
app.use(morgan("common"))
app.use(cors())
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
res.set('content-type', 'application/javascript')

// Main functions for five endpoints

app.get('/api/CL/', (req, res) => {
    let cluserrequest = req.query.q
    //let callback= req.query.callback
    console.log('CL UserRequest ' + cluserrequest)
    console.log('Callback : ' + req.query.callback)
    app.set('jsonp callback name', req.query.callback)
    const resp = axios.get('https://courtlistener.com/api/rest/v3/search/?q=' + cluserrequest )
    .then (resp => res.jsonp(resp.data))
});

app.get('/api/CAP/', (req, res) => {
  let capuserrequest = req.query.q
  console.log('CAP UserRequest ' + capuserrequest)
  console.log('Callback : ' + req.query.callback)
  //app.set('jsonp callback name', req.query.callback)
  const resp = axios.get('https://api.case.law/v1/cases/?search=' + capuserrequest + '&jurisdiction=wash')
  .then (resp => res.jsonp(resp.data))
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

function newFunction() {
  return 'helmet/dist/middlewares/x-content-type-options';
}
