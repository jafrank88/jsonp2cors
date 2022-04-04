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
  console.log('Basic : ' + '(' + 'https://everydaysystems.com/sps/tix/corb/jon_sub.json' + ');');
  res.send(req.query.callback + '(' + JSON.stringify('https://everydaysystems.com/sps/tix/corb/jon_sub.json') + ');')
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
    res.writeHead(200,{'Content-Type': 'application/json'})
    res.write(clcallback + ' ( ' + cloutput5 + ' ); ');
    res.end()
      });
    });

    app.get('/api/Rplain/', (req, res) => {
      let rs1callback = req.query.callback
      let rs1req = req
      console.log('Rplain req : ' + 'https://everydaysystems.com/sps/tix/corb/jon_sub.json')
      console.log('Rplain Page Callback : ' + rs1callback)
      axios
        .get('https://everydaysystems.com/sps/tix/corb/jon_sub.json')
        .then (function (response) {     
            //console.log('Rplain Response : ' + response)
            //console.log('Rplain Header : ' + response.header)
            //console.log('Rplain Query : ' + response.query)
            //console.log('Rplain JSON : ' + response.json)
            //console.log('Rplain data : ' + response.data)
            //console.log('Rplain body : ' + response.body)
            //res.end(clcallback + JSON.stringify(response))
             //.writeHead(200,{'Content-Type': 'application/json'})
          //res.writeHead(200,{'Content-Type': 'text/html; charset=UTF-8'}) 
          res.write(rs1callback + '(pass_a_callback_please(' + response.data + '));')
          res.end()
      })
    });

    app.get('/api/Rstring/', (req, res) => {
      let rs2callback = req.query.callback
      console.log('Rstring Page Callback : ' + rs2callback)
      axios
        .get('https://everydaysystems.com/sps/tix/corb/jon_sub.json')
        .then (function (response) {     
            //console.log('Rstring data : ' + response.data)
            //res.writeHead(200,{'Content-Type': 'application/json'}) 
            res.send(rs2callback + "(" + response.data + ");")
             //.writeHead(200,{'Content-Type': 'application/json'})
             
             
      })
    });

    app.get('/api/Rjson/', (req, res) => {
      let rs3callback = req.query.callback
      console.log('Rjson Page Callback : ' + rs3callback)
      axios
        .get('https://everydaysystems.com/sps/tix/corb/jon_sub.json')
        .then (function (response) {     
            //console.log('Rstring data : ' + response.data)
          //res.writeHead(200,{'Content-Type': 'application/javascript'})
          res.send(rs3callback + "(" + response.data + ");")
      })
    }); 

    app.get('/api/Rjsonp/', (req, res) => {
      let rs4callback = req.query.callback
      console.log('Rjsonp Page Callback : ' + rs4callback)
      axios
        .get('https://everydaysystems.com/sps/tix/corb/jon_sub.json')
        .then (function (response) {     
            //console.log('Rstring data : ' + response.data)
            //res.writeHead(200,{'Content-Type': 'application/json'})
            //res.writeHead(200,{'Content-Type': 'application/javascript; charset=UTF-8'}) 
            res.send(rs4callback + "(" + response.data + ");");
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