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



function googFix(googIn) {
let wacresp1 = googIn.replaceAll('"totalResults"', '"total_results"')
let wacresp2 = wacresp1.replaceAll('"count"', '"perpage"')
let wacresp3 = wacresp2.replace('"items"', '"results"')
let wacresp4 = wacresp3.replaceAll('"nextPage"', '"next"')
let wacresp5 = wacresp4.replace('"type": "application/json"', '"type": "application/javascript"')
let wacresp6 = wacresp5.replaceAll(/\"(\d+)\"/g, '$1')
let wacresp7 = wacresp6.replaceAll('"link"', '"url"')
let wacresp8 = wacresp7.replace(/"quer[\s\S]*?ext[\s\S]*?\{/m, '')
let wacresp9 = wacresp8.replace(/"kin[\s\S]*?\"tot/m, '"tot')
let pptest = wacresp9.indexOf('perpage') 
if (pptest < 1) {
    let googOut = wacresp9.replace('"formattedT', '"perpage": 10 "formattedT')
  } else {
    let googOut = wacresp9
  }
return(googOut);
};


app.get('/api/CL/', (req, res) => {
    const cluserrequest = req.query.q
    const clcallback = req.query.callback
    axios
      .get('https://courtlistener.com/api/rest/v3/search/?court=wash washctapp&q=' + cluserrequest)
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
  axios.get('https://api.case.law/v1/cases/?jurisdiction=wash&search=' + capuserrequest)
    .then(function (response) {
      const capresp = JSON.stringify(response.data)
      const capresp1 = capresp.replace('"count"', '"total_results"')
      const capresp2 = capresp1.replace('"next"', '"perpage":5, "next"')
      const capresp3 = capresp2.replaceAll('"url"', '"uurl"')
      const capresp4 = capresp3.replaceAll('"frontend_url"', '"url"')
      const capout = capresp4.replaceAll('"name_abbreviation"','"title"')
       res
       .type('application/javascript')
       .send(capcallback + '(' + capout + ');');
       } 
)});



app.get('/api/GOOGWA/', (req, res) => {
  let waUserRequest = req.query.q
  let waCallback = req.query.callback
  //let regex = /\"(\d+)\"/g
  let resp = axios.get('https://www.googleapis.com/customsearch/v1?alt=json&cx=e59140f1ca4f44214&key=AIzaSyAan8PHJ6Ji5S2r7S7iQiFWIwcn6K3ijL4&q=' + waUserRequest )
     .then (function(response) {
      let googResp = JSON.stringify(response.data)
      let googOut = googFix(googResp)
      let googDone = googOut.replace(/214\"\s*?\}\s*?\]\s*?\}\,[\s\S]*?\"res/m, '214", "res')
      res
     .type('application/javascript')
     .send(waCallback + '(' + googDone + ');')
     }) 
    });
    
app.get('/api/GOOGRCW/', (req, res) => {
   let rcwUserRequest = req.query.q
    let rcwCallback = req.query.callback
let resp = axios.get('https://www.googleapis.com/customsearch/v1?alt=json&cx=e6de7f98f8313475c&key=AIzaSyAan8PHJ6Ji5S2r7S7iQiFWIwcn6K3ijL4&q=' + rcwUserRequest)
.then (function(response) {
  let googResp = JSON.stringify(response.data)
  let googOut = googFix(googResp)
  let googDone = googOut.replace(/75c\"\s*?\}\s*?\]\s*?\}\,[\s\S]*?\"res/m, '75c", "res')
  res
 .type('application/javascript')
 .send(rcwCallback + '(' + googDone + ');')
 }) 
});

app.get('/api/GOOGWAC/', (req, res) => {
  let wacUserRequest = req.query.q
   let wacCallback = req.query.callback
let resp = axios.get('https://www.googleapis.com/customsearch/v1?alt=json&cx=065d0f2474d164d55&key=AIzaSyAan8PHJ6Ji5S2r7S7iQiFWIwcn6K3ijL4&q=' + wacUserRequest)
.then (function(response) {
 let googResp = JSON.stringify(response.data)
 let googOut = googFix(googResp)
 let googDone = googOut.replace(/d55\"\s*?\}\s*?\]\s*?\}\,[\s\S]*?\"res/m, 'd55", "res')
 res
.type('application/javascript')
.send(wacCallback + '(' + googDone + ');')
}) 
});


app.listen(PORT, (err) => {
    if (err) {
        console.error(err)
    }

    console.log('Listening on port ' + PORT)
})