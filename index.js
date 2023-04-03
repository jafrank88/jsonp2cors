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

// Serve Favicon
app.use(favicon('favicon.ico'));

// Middleware//
app.use(morgan("common"));
app.use(cors());

//security
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
  })
);

function googFix(googIn) {
  let wacresp1 = googIn.replaceAll('"totalResults"', '"total_results"');
  let wacresp2 = wacresp1.replaceAll('"count"', '"perpage"');
  let wacresp3 = wacresp2.replace('"items"', '"results"');
  let wacresp4 = wacresp3.replaceAll('"nextPage"', '"next"');
  let wacresp5 = wacresp4.replace('"type": "application/json"', '"type": "application/javascript"');
  let wacresp6 = wacresp5.replaceAll(/\"(\d+)\"/g, '$1');
  let wacresp7 = wacresp6.replaceAll('"link"', '"url"');
  let wacresp8 = wacresp7.replace(/"quer[\s\S]*?ext[\s\S]*?\{/m, '');
  let wacresp9 = wacresp8.replace(/"kin[\s\S]*?\"tot/m, '"tot');
  let pptest = wacresp9.indexOf('perpage') ;
  console.log("PPTEST : " + pptest);
  if (pptest = -1) {
      let googOut = wacresp9.replace('"formattedT', '"perpage": 10"formattedT');
      return(googOut);
  } else {
    return(wacresp9);
  }
};

// Washington State Case Law by Court Listener
app.get('/api/CL/', (req, res) => {
  let clUserRequest = req.query.q;
  if (clUserRequest == "") {
    console.log("null query");
    res.end();
  } else {
    let clcallback = req.query.callback
    axios.get('https://courtlistener.com/api/rest/v3/search/?court=wash&q=' + clUserRequest) // 'https://courtlistener.com/api/rest/v3/search/?court=wash washctapp&q='
      .then (function (response) {
        // ensure that only the first 5 results are returned by only saving the first 5 results returned
        if (response.data.count > 5) {
          response.data.count = 5;
          //response.data.total_results = 5;
          results = [{}, {}, {}, {}, {}];
          for (let i = 0; i < 5; i++) {
            results[i] = response.data.results[i];
          }
          response.data.results = results;
        }
        let clresp = JSON.stringify(response.data);
        let cloutput = clresp.replace('"count"', '"total_results"');
        let cloutput2 = cloutput.replace('"next"', '"perpage":5,"next"');
        let cloutput3 = cloutput2.replaceAll('"absolute_url"', '"url"');
        let cloutput4 = cloutput3.replaceAll('/opinion/',  'https://www.courtlistener.com/opinion/');
        let cloutput5 = cloutput4.replaceAll('"caseName"', '"title"');
        res
          .type('application/javascript')
          .send(clcallback + '(' + cloutput5 + ');')
      }) //cloutput5 already is just the response.data
      .catch(function (error) {
        res.end();
      });
  }
});

// Washington State Case Law from the Caselaw Access Project
app.get('/api/CAP/', (req, res) => {
  let capuserrequest = req.query.q;
  if (capuserrequest == "") {
    res.end();
  } else {
    let capcallback = req.query.callback;
    axios.get('https://api.case.law/v1/cases/?jurisdiction=wash&page_size=5&ordering=-decision_date&search=' + capuserrequest)
      .then(function (response) {
        if (response.data.count > 5) {
          response.data.count = 5;
        }
        /*if (response.data.total_results > 5) {
          response.data.total_results = 5;
        }*/
        if (response.data.page_size > 5) {
          response.data.page_size = 5;
        }
        //response.data.total_results = 5;
        //response.data.page_size = 5;
        response.data.perpage = 5;
        const capresp = JSON.stringify(response.data);
        const capresp1 = capresp.replace('"count"', '"total_results"');
        const capresp2 = capresp1.replace('"page_size"', '"perpage"');
        const capresp3 = capresp2.replaceAll('"url"', '"uurl"');
        const capresp4 = capresp3.replaceAll('"frontend_url"', '"url"');
        const capout = capresp4.replaceAll('"name_abbreviation"','"title"');
        res.type('application/javascript').send(capcallback + '(' + capout + ');');
      }).catch(function (error) {
        res.end();
      });
  }
});

// University of Washington Law Digital Commons
// For some reason, won't always display the right results. Even if it claims that the total results are over 5,
// it will not always display 5 results and often displays less.
app.get('/api/UWDC/', (req, res) => {
  let DCuserrequest = req.query.q;
  if (DCuserrequest == "") {
    res.end();
  } else {
    let DCcallback = req.query.callback;
    axios.get('https://content-out.bepress.com/v2/digitalcommons.law.uw.edu/query?limit=5&q=' + DCuserrequest,{
      headers: {
        'authorization': 'tIom76bl0l0FGyokkyAhN7GnlgjqmVBxPjF/CoMUAMY='
      }
    }).then(function (response) {
      // only want to show 5 results
      if (response.data.query_meta.total_hits > '5') {
        response.data.query_meta.total_hits = 5;
      }
      let capresp = JSON.stringify(response.data);
      let capresp1 = capresp.replace('"total_hits"', '"total_results"');
      let capresp2 = capresp1.replace('"limit"', '"perpage"');
      //let capresp3 = capresp2.replace('"query_meta":{', '');
      //let capresp4 = capresp2.replace(/"download_format"[\s]*\][\s]*\}/m, '"download_format"]}');
      let capresp5 = capresp2.replace('"start"','"next"');
      let DCheader = capresp5.match(/"total[\s\S]*\"field/m);
      console.log ('DCheader : ' + DCheader);
      let capresp6 = capresp5.replace(DCheader, '"field');
      let DCout = capresp6.replace('"results"', DCheader + '":0,"results"');
      console.log ('After header move : ' + DCout);
      res.type('application/javascript').send(DCcallback + '(' + DCout + ');');
    }).catch(function (error) {
        res.end();
    });
  }
});
  
// Washington Law Help
app.get('/api/GOOGWLH/', (req, res) => {
  let wlhUserRequest = req.query.q;
  if (wlhUserRequest == "") {
    res.end();
  } else {
  let wlhCallback = req.query.callback;
  axios.get('https://www.googleapis.com/customsearch/v1?alt=json&cx=135ef0d0998ed4a33&key=AIzaSyAan8PHJ6Ji5S2r7S7iQiFWIwcn6K3ijL4&q=' + wlhUserRequest )
     .then (function(response) {
      let googResp = JSON.stringify(response.data);
      let googOut = googFix(googResp);
      let googDone = googOut.replace(/a33\"\s*?\}\s*?\]\s*?\}\,[\s\S]*?\"res/m, 'a33","res');
      res.type('application/javascript').send(wlhCallback + '(' + googDone + ');');
     }).catch(function (error) {
      res.end();
     });
  } 
});

// Washington State Government Website Search
app.get('/api/GOOGWA/', (req, res) => {
  let waUserRequest = req.query.q;
  if (waUserRequest == "") {
    res.end();
  } else {
  let waCallback = req.query.callback;
  axios.get('https://www.googleapis.com/customsearch/v1?alt=json&cx=e59140f1ca4f44214&key=AIzaSyAan8PHJ6Ji5S2r7S7iQiFWIwcn6K3ijL4&q=' + waUserRequest )
    .then (function(response) {
      let googResp = JSON.stringify(response.data);
      let googOut = googFix(googResp);
      let googDone = googOut.replace(/214\"\s*?\}\s*?\]\s*?\}\,[\s\S]*?\"res/m, '214","res');
      res.type('application/javascript').send(waCallback + '(' + googDone + ');');
    }).catch(function (error) {
      res.end();
    });
  }
});

// Revised Code of Washington
app.get('/api/GOOGRCW/', (req, res) => {
   let rcwUserRequest = req.query.q;
   if (rcwUserRequest == "") {
    res.end();
  } else {
    let rcwCallback = req.query.callback;
  axios.get('https://www.googleapis.com/customsearch/v1/siterestrict?alt=json&cx=e6de7f98f8313475c&key=AIzaSyAan8PHJ6Ji5S2r7S7iQiFWIwcn6K3ijL4&q=' + rcwUserRequest)
    .then (function(response) {
      let googResp = JSON.stringify(response.data);
      let googOut = googFix(googResp);
      let googDone = googOut.replace(/75c\"\s*?\}\s*?\]\s*?\}\,[\s\S]*?\"res/m, '75c","res');
      res.type('application/javascript').send(rcwCallback + '(' + googDone + ');');
    }).catch(function (error) {
      res.end();
    });
  }
});

// Washington Administrative Code
app.get('/api/GOOGWAC/', (req, res) => {
  let wacUserRequest = req.query.q;
  if (wacUserRequest == "") {
    res.end();
  } else {
    let wacCallback = req.query.callback;
    axios.get('https://www.googleapis.com/customsearch/v1/siterestrict?alt=json&cx=065d0f2474d164d55&key=AIzaSyAan8PHJ6Ji5S2r7S7iQiFWIwcn6K3ijL4&q=' + wacUserRequest)
      .then (function(response) {
      let googResp = JSON.stringify(response.data);
      let googOut = googFix(googResp);
      let googDone = googOut.replace(/d55\"\s*?\}\s*?\]\s*?\}\,[\s\S]*?\"res/m, 'd55","res');
      res.type('application/javascript').send(wacCallback + '(' + googDone + ');');
      }) 
      .catch(function (error) {
        res.end();
      });
  }
});

app.listen(PORT, (err) => {
    if (err) {
        console.error(err);
    }
    console.log('Listening on port ' + PORT);
})