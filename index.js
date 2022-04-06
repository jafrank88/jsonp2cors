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
const favicon = require('serve-favicon');
const { json } = require('express');

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

function makeGetRequest(path) {
  axios.get(path).then(
      (response) => {
          let result = response.data;
          console.log(result);
      },
      (error) => {
          console.log(error);
      }
  );
}
//makeGetRequest('http://127.0.0.1:5000/test');

app.get('/api/CL/', (req, res, next) => {
    const cluserrequest = req.query.q
    const clcallback = req.query.callback
    axios
      .get('https://courtlistener.com/api/rest/v3/search/?q=' + cluserrequest)
      .then (function (response) {
          const clresp = JSON.stringify(response.data)
          const cloutput = clresp.replace('"count"', '"total_results"')
          const cloutput2 = cloutput.replace('"next"', '"perpage":5, "next"')
          const cloutput3 = cloutput2.replaceAll('"absolute_url"', '"url"')
          const cloutput4 = cloutput3.replaceAll('/opinion/',  'https://www.courtlistener.com/opinion/')
          const cloutput5 = cloutput4.replaceAll('"caseName"', '"title"')
          const cloutput6 = JSON.parse(cloutput5)
          res
            .type('application/javascript')
            .send(clcallback + '(' + cloutput5 + ');')} //cloutput5 already is just the response.data
    )}
);

app.get('/api/CL1/', (req, res, next) => {
  const cluserrequest = req.query.q
  const clcallback = req.query.callback
  axios
    .get('https://courtlistener.com/api/rest/v3/search/?q=' + cluserrequest)
    .then (function (response) {
        const clresp = JSON.stringify(response.data)
        const cloutput = clresp.replace('"count"', '"total_results"')
        const cloutput2 = cloutput.replace('"next"', '"perpage":5, "next"')
        const cloutput3 = cloutput2.replaceAll('"absolute_url"', '"url"')
        const cloutput4 = cloutput3.replaceAll('/opinion/',  'https://www.courtlistener.com/opinion/')
        const cloutput5 = cloutput4.replaceAll('"caseName"', '"title"')
        const cloutput6 = JSON.parse(cloutput5)
        res
          .type('application/json')
          .send(clcallback + '(' + cloutput5 + ');')} //cloutput5 already is just the data
  )}
);

app.get('/api/CL2/', (req, res, next) => {
  const cluserrequest = req.query.q
  const clcallback = req.query.callback
  axios
    .get('https://courtlistener.com/api/rest/v3/search/?q=' + cluserrequest)
    .then (function (response) {
        const clresp = JSON.stringify(response.data)
        const cloutput = clresp.replace('"count"', '"total_results"')
        const cloutput2 = cloutput.replace('"next"', '"perpage":5, "next"')
        const cloutput3 = cloutput2.replaceAll('"absolute_url"', '"url"')
        const cloutput4 = cloutput3.replaceAll('/opinion/',  'https://www.courtlistener.com/opinion/')
        const cloutput5 = cloutput4.replaceAll('"caseName"', '"title"')
        const cloutput6 = JSON.parse(cloutput5)
        res
          .type('text/html; charset=UTF-8')
          .send(clcallback + '(' + cloutput5 + ');')} //cloutput5 already is just the data
  )}
);

//app.get('/api/CAP/', (req, res) => {
  //let capuserrequest = req.query.q
  //console.log('CAP UserRequest ' + capuserrequest)
  //console.log('Callback : ' + req.query.callback)
  //axios.get('https://api.case.law/v1/cases/?search=' + req.query.q + '&jurisdiction=wash')
    //.then(function (response) {
       //res.jsonp(response.data);
    //} 
  //);
//});

//app.get('/api/WAC/', (req, res) => {
  //let wacuserRequest = req.query.q
  //console.log('WAC UserRequest ' + wacuserRequest)
  //console.log('Callback : ' + req.query.callback)
  //const resp = axios.get('https://lawdoccitelookup.leg.wa.gov/v1/Help/Api/WAC/?q=' + wacuserRequest)
  //.then (resp => res.jsonp(resp.data))
//});

//app.get('/api/RCW/', (req, res) => {
 // let rcwuserRequest = req.query.q
  //console.log('RCW UserRequest ' + rcwuserRequest)
  //console.log('Callback : ' + req.query.callback)
  //const resp = axios.get('https://search.leg.wa.gov/v1/Help/Api/RCW/?q=' + rcwuserRequest)
  //.then (resp => res.jsonp(resp.data))
//});

//app.get('/api/WLH/', (req, res) => {
  //let wlhuserRequest = req.query.q
  //console.log('WLH UserRequest ' + wlhuserRequest)
  //console.log('Callback : ' + req.query.callback)
  //const resp = axios.get('https://www.washingtonlawhelp.org/search?q=' + wlhuserRequest)
  //.then (resp => res.jsonp(resp.data))
//});

app.listen(PORT, (err) => {
    if (err) {
        console.error(err)
    }

    console.log('Listening on port ' + PORT)
})