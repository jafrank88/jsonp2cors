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
  // m is saying the search will cross multiple lines (to ignore end of line or beginning of line marker)
  let wacresp8 = wacresp7.replace(/"quer[\s\S]*?ext[\s\S]*?\{/m, '');
  let wacresp9 = wacresp8.replace(/"kin[\s\S]*?\"tot/m, '"tot');
  let pptest = wacresp9.indexOf('perpage') ;
  console.log("PPTEST : " + pptest);
  if (pptest = -1) {
      let googOut = wacresp9.replace('"formattedT', '"perpage":5,"formattedT');
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
        if (response.data.count > 15) {
          response.data.count = 15;
          results = Array(response.data.count).fill(0);
          for (let i = 0; i < 15; i++) {
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
        if (response.data.count > 15) {
          response.data.count = 15;
        }
        if (response.data.page_size > 15) {
          response.data.page_size = 15;
        }
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

/* 
  University of Washington Law Digital Commons
   For some reason, won't always display the right results. Even if it claims that the total results are over 5,
   it will not always display 5 results and often displays less. "Law" or "Washington" as a search, for example displays no results, 
   yet claims to be "Showing 1 - 5 of 6997". Perhaps the API simply will not return results if a query is too broad 
   or it returns too many results? That shouldn't be a problem because it limits what's returned to 5, but could be
   an API problem, I am not sure. 
*/
app.get('/api/UWDC/', (req, res) => {
  let DCuserrequest = req.query.q;
  if (DCuserrequest == "") {
    res.end();
  } else {
    let DCcallback = req.query.callback;
    axios.get('https://content-out.bepress.com/v2/digitalcommons.law.uw.edu/query?limit=5&q=' + DCuserrequest,{
      headers: {
        'authorization': process.env.DIGITAL_COMMONS
      }
    }).then(function (response) {
      // only want to show 5 results
      if (response.data.query_meta.total_hits > 15) {
        response.data.query_meta.total_hits = 15;
      }
      let capresp = JSON.stringify(response.data);
      let capresp1 = capresp.replace('"total_hits"', '"total_results"');
      let capresp2 = capresp1.replace('"limit"', '"perpage"');
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

// Google Books API
app.get('/api/GOOGB/', (req, res) => {
  let bUserRequest = req.query.q;
  if (bUserRequest == "") {
    res.end();
  } else {
  let bCallback = req.query.callback;
  axios.get('https://www.googleapis.com/books/v1/volumes?q=' + bUserRequest )
    .then (function(response) {
      if (response.data.totalItems > 15) {
        response.data.totalItems = 15;
      }
      results = Array(response.data.totalItems).fill(0);
      for (let i = 0; i < response.data.totalItems; i++) {
        item = {};
        item.title = response.data.items[i].volumeInfo.title;
        item.url = response.data.items[i].volumeInfo.infoLink;
        item.authors = response.data.items[i].volumeInfo.authors;
        results[i] = item;
      }
      response.data.items = results;

      let bookResp = JSON.stringify(response.data);
      let bookResp1 = bookResp.replaceAll('"totalItems"', '"total_results"');
      let bookResp2 = bookResp1.replaceAll('"items"', '"results"');
      res.type('application/javascript').send(bCallback + '(' + bookResp2 + ');');
    }).catch(function (error) {
      res.end();
    });
  }
});

// Research Guides from Washington Institutions including Seattle U and Gonzaga
app.get('/api/GOOGWARG/', (req, res) => {
  let wargUserRequest = req.query.q;
  if (wargUserRequest == "") {
    res.end();
  } else {
  let wargCallback = req.query.callback;
  axios.get('https://www.googleapis.com/customsearch/v1/siterestrict?alt=json&cx=16b5f286be6f64126&key=' + process.env.GOOGLE_API + '&q=' + wargUserRequest )
    .then (function(response) {
      if (response.data.queries.nextPage[0].totalResults > '15') {
        response.data.queries.nextPage[0].totalResults = '15';
        results = Array(response.data.queries.nextPage[0].totalResults).fill(0);
        for (let i = 0; i < 15; i++) {
          results[i] = response.data.items[i];
        }
        response.data.items = results;
      }
      let googResp = JSON.stringify(response.data);
      let googOut = googFix(googResp);
      let googDone = googOut.replace(/126\"\s*?\}\s*?\]\s*?\}\,[\s\S]*?\"res/m, '126","res');
      res.type('application/javascript').send(wargCallback + '(' + googDone + ');');
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
  axios.get('https://www.googleapis.com/customsearch/v1/siterestrict?alt=json&cx=135ef0d0998ed4a33&key=' + process.env.GOOGLE_API + '&q=' + wlhUserRequest )
     .then (function(response) {
      if (response.data.queries.nextPage[0].totalResults > '15') {
        response.data.queries.nextPage[0].totalResults = '15';
        results = Array(response.data.queries.nextPage[0].totalResults).fill(0);
        for (let i = 0; i < 15; i++) {
          results[i] = response.data.items[i];
        }
        response.data.items = results;
      }
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
  axios.get('https://www.googleapis.com/customsearch/v1/siterestrict?alt=json&cx=e59140f1ca4f44214&key=' + process.env.GOOGLE_API + '&q=' + waUserRequest )
    .then (function(response) {
      if (response.data.queries.nextPage[0].totalResults > '15') {
        response.data.queries.nextPage[0].totalResults = '15';
        results = Array(response.data.queries.nextPage[0].totalResults).fill(0);
        for (let i = 0; i < 15; i++) {
          results[i] = response.data.items[i];
        }
        response.data.items = results;
      }
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
  axios.get('https://www.googleapis.com/customsearch/v1/siterestrict?alt=json&cx=e6de7f98f8313475c&key=' + process.env.GOOGLE_API + '&q=' + rcwUserRequest)
    .then (function(response) {
      if (response.data.queries.nextPage[0].totalResults > '15') {
        response.data.queries.nextPage[0].totalResults = '15';
        results = Array(response.data.queries.nextPage[0].totalResults).fill(0);
        for (let i = 0; i < 15; i++) {
          results[i] = response.data.items[i];
        }
        response.data.items = results;
      }
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
    axios.get('https://www.googleapis.com/customsearch/v1/siterestrict?alt=json&cx=065d0f2474d164d55&key=' + process.env.GOOGLE_API + '&q=' + wacUserRequest)
      .then (function(response) {
        if (response.data.queries.nextPage[0].totalResults > '15') {
          response.data.queries.nextPage[0].totalResults = '15';
          results = Array(response.data.queries.nextPage[0].totalResults).fill(0);
          for (let i = 0; i < 15; i++) {
            results[i] = response.data.items[i];
          }
          response.data.items = results;
        }
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