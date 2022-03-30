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

// Main functions for five endpoints

app.get('/', function (req, res){
  res.jsonp({ title: 'This should be JSONP' });
});

app.get('/api/CL/', (req, res, next) => {
    const cluserrequest = req.query.q
    const clcallback = req.query.callback
    console.log('CL UserRequest ' + cluserrequest)
    console.log('rqc Callback : ' + req.query.callback)
    console.log('recorded Callback :' + clcallback)
    axios
      .get('https://courtlistener.com/api/rest/v3/search/?q=' + cluserrequest)
      .then (function (response) {
          const clresp = JSON.stringify(response.data)
        //console.log ('postAxios :'+ res.get('Content-Type'));
    //const clresp1 = clresp)
    //console.log ('postStringify :'+ res.get('Content-Type'))
    //const clresp = response.data
    const cloutput = clresp.replace('"count"', '"total_results"')
    const cloutput2 = cloutput.replace('"next"', '"perpage":5, "next"')
    const cloutput3 = cloutput2.replaceAll('"absolute_url"', '"url"')
    const cloutput4 = cloutput3.replaceAll('/opinion/',  'https://www.courtlistener.com/opinion/')
    const cloutput5 = cloutput4.replaceAll('"caseName"', '"title"')
    //const output = cloutput3
    //console.log ('postResType :'+ res.get('Content-Type'))
    //const output = JSON.parse(cloutput5)
    //console.log ('postParse :'+ res.get('Content-Type'))
    //console.log ('Final Content-Type :'+ res.get('Content-Type'))
    //console.log(output.headers) 
    //res.send(clcallback + '( \' ' + JSON.stringify(output) + ' \' ) ;';//jsonp)
    //console.log(clcallback + '( \'' + cloutput5 + '\' );');
    res
      .writeHead(200,{'Content-Type': 'application/json'})
      .end(clcallback + ' ( \'' + cloutput5 + '\' );'
    );
      });
    });


    app.get('/api/JF/', (req, res, next) => {
      const cluserrequest = req.query.q
      const clcallback = req.query.callback
      //console.log('CL UserRequest : ' + cluserrequest)
      console.log('Fac Page Callback : ' + clcallback)
      axios
        .get('https://faculty.washington.edu/jafrank/Reinhardtest4.html')
        .then (function (response) {
         //   const jfresp = JSON.stringify(response.data)
         //   console.log(jfresp)
            res
             .writeHead(200,{'Content-Type': 'application/json'})
             .end(clcallback + JSON.stringify(response.data))
      })
    });

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