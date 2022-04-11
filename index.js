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

//function makeGetRequest(path) {
  //axios.get(path).then(
      //(response) => {
         // let result = response.data;
          //console.log(result);
      //},
      //(error) => {
          //console.log(error);
      //}
  //);


app.get('/api/CL/', (req, res) => {
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
          res
            .type('application/javascript')
            .send(clcallback + '(' + cloutput5 + ');')} //cloutput5 already is just the response.data
    )});



app.get('/api/CAP/', (req, res) => {
  let capuserrequest = req.query.q
  let capcallback = req.query.callback
  //console.log('CAP UserRequest ' + capuserrequest)
  //console.log('Callback : ' + req.query.callback)
  axios.get('https://api.case.law/v1/cases/?search=' + capuserrequest)
    .then(function (response) {
      const capresp = JSON.stringify(response.data)
      const capresp1 = capresp.replace('"count"', '"total_results"')
      const capresp2 = capresp1.replace('"next"', '"perpage":5, "next"')
      const capresp3 = capresp2.replaceAll('"url"', '"uurl"')
      const capresp4 = capresp3.replaceAll('"frontend_url"', '"url"')
      const capout = capresp4.replaceAll('"name_abbreviation"','"title"')
      //console.log(capout)
       res
       .type('application/javascript')
       .send(capcallback + '(' + capout + ');');
       } 
  //);
)})



app.get('/api/GOOG/', (req, res) => {
  let wacuserRequest = req.query.q
  let waccallback = req.query.callback
  console.log('GOOG UserRequest ' + wacuserRequest)
  console.log('GOOG Callback : ' + waccallback)
  const resp = axios.get('https://www.googleapis.com/customsearch/v1?q=' + wacuserRequest + '&alt=json&cx=e59140f1ca4f44214&key=AIzaSyAan8PHJ6Ji5S2r7S7iQiFWIwcn6K3ijL4')
  .then(function (response) {
    const wacresp = JSON.stringify(response.data)
    const wacresp1 = wacresp.replace('"formattedTotalResults"', '"total_results"')
    const wacresp2 = wacresp1.replace('"nextPage"', '"perpage":10, "next"')
    const wacresp3 = wacresp2.replace('"url"', '"uurl"')
    const wacresp4 = wacresp3.replaceAll('"title"', '"ttitle"')
    const wacresp5 = wacresp4.replaceAll('"snippet"', '"title"')
    const wacout = wacresp5.replaceAll('"link"', '"url"')
    console.log(wacout)
     res
     .type('application/javascript')
     .send(waccallback + '(' + wacout + ');');
     } 
//);
)})

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