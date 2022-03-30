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

//app.get('/', function (req, res){
//  res.jsonp({ title: 'This should be JSONP' });
//});

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
    res
      .writeHead(200,{'Content-Type': 'application/json'})
      .end(clcallback + ' ( \'' + cloutput5 + '\' );'
    );
      });
    });

    app.get('/api/Rplain/', (req, res) => {
      const clcallback = req.query.callback
      console.log('Rplain Page Callback : ' + clcallback)
      axios
        .get('https://everydaysystems.com/sps/tix/corb/v2.php')
        .then (function (response) {     
            console.log('Rplain Pagetext' + response)
            res
             .writeHead(200,{'Content-Type': 'application/json'})
             .end(clcallback + response)
      })
    });

    app.get('/api/Rstring/', (req, res) => {
      const clcallback = req.query.callback
      console.log('Rstring Page Callback : ' + clcallback)
      axios
        .get(json.stringify('https://everydaysystems.com/sps/tix/corb/v2.php'))
        .then (function (response) {     
            console.log('Rstring Pagetext' + response)
            res
             .writeHead(200,{'Content-Type': 'application/json'})
             .end(clcallback + response)
      })
    });


    app.get('/api/Rparse/', (req, res) => {
      const clcallback = req.query.callback
      console.log('Rparse Page Callback : ' + clcallback)
      axios
        .get(json.parse('https://everydaysystems.com/sps/tix/corb/v2.php'))
        .then (function (response) {     
            console.log('Rparse Pagetext' + response)
            res
             .writeHead(200,{'Content-Type': 'application/json'})
             .end(clcallback + response)
      })
    });


    app.get('/api/Rparsestring/', (req, res) => {
      const clcallback = req.query.callback
      console.log('Rparsestring Page Callback : ' + clcallback)
      axios
        .get(json.parse('https://everydaysystems.com/sps/tix/corb/v2.php'))
        .then (function (response) {     
          let response = json.stringify(response)  
          console.log('Rparsestring Pagetext' + response)
            res
             .writeHead(200,{'Content-Type': 'application/json'})
             .end(clcallback + response)
      })
    });

    app.get('/api/JFplain/', (req, res, next) => {
      const cluserrequest = req.query.q
      const clcallback = req.query.callback
      //console.log('CL UserRequest : ' + cluserrequest)
      console.log('JF2 Page Callback : ' + clcallback)
      axios
        .get('https://faculty.washington.edu/jafrank/Reinhardtest4.html')
        .then (function (response) {
          const jfresp = response        
          console.log('JF2 Pagetext' + jfresp)
            res
             .writeHead(200,{'Content-Type': 'application/json'})
             .end(clcallback + jfresp)
      })
    });

    app.get('/api/JFstring/', (req, res, next) => {
      //const cluserrequest = req.query.q
      const clcallback = req.query.callback
      //console.log('CL UserRequest : ' + cluserrequest)
      console.log('JF3 Page Callback : ' + clcallback)
      const jfresp = axios.get('https://faculty.washington.edu/jafrank/Reinhardtest4.html')
      console.log('JF3 Pagetext' + jfresp)
            res
             .writeHead(200,{'Content-Type': 'application/json'})
             .end(clcallback + JSON.stringify(jfresp))
    });

    app.get('/api/JF4/', (req, res, next) => {
      const cluserrequest = req.query.q
      const clcallback = req.query.callback
      //console.log('CL UserRequest : ' + cluserrequest)
      console.log('JF4 Page Callback : ' + clcallback)
      const response = ('({ "results": [ { "type": "020lead", "timestamp": "2018-10-23T12:33:15.281000-07:00", "suitNature": "", "status_exact": "Precedential", "status": "Precedential", "source": "Z", "snippet": "cal\nCal.\n\n\n\n Chester Pascoe<\/mark>, an Infant, by His Guardian Ad Litem, Eva Pascoe<\/mark> v. C.H. Baker\n\n\nSLOSS, …plaintiff relied upon the affidavit of Mrs. Eva Pascoe<\/mark>, his mother and guardian ad litem.\nThis affidavit", "sibling_ids": [ 3302614 ], "scdb_id": "", "per_curiam": null, "panel_ids": null, "pagerank": null, "non_participating_judge_ids": null, "neutralCite": null, "local_path": "\/home\/mlissner\/columbia\/opinions\/california\/supreme_court_opinions\/documents\/648c3c99027ea936.xml", "lexisCite": null, "judge": "SLOSS, J.", "joined_by_ids": null, "id": 3302614, "download_url": null, "docket_id": 3175416, "docketNumber": "L.A. No. 2527.", "dateReargumentDenied": null, "dateReargued": null, "dateFiled": "1910-08-25T23:53:00-08:00", "dateArgued": null, "court_id": "cal", "court_exact": "cal", "court_citation_string": "Cal.", "court": "California Supreme Court", "cluster_id": 3303295, "cites": null, "citeCount": 57, "citation": [ "158 Cal. 232", "110 P. 815" ], "caseNameShort": "Pascoe", "caseName": "Pascoe v. Baker", "author_id": 3851, "attorney": "Lynn Helm, and Wilbur Bassett, for Appellant.\n\nJohnstone Jones, Robert P. Jennings, and Louis H. Brownstone, for Plaintiff.", "url": "https:\/\/www.courtlistener.com\/opinion\/3303295\/pascoe-v-baker\/", "title": "Hello Again Reinhard" }, { "type": "010combined", "timestamp": "2018-10-22T23:18:28.550999-07:00", "suitNature": "", "status_exact": "Precedential", "status": "Precedential", "source": "L", "snippet": "Tallahassee, for respondent Pasco<\/mark> County Classroom Teachers Assn.\nERVIN, Judge.\nThe Pasco<\/mark> County School Board…\n\n \n353 So.2d 108 (1977)\nPASCO<\/mark> COUNTY SCHOOL BOARD, Petitioner,\nv.\nFLORIDA PUBLIC EMPLOYEES RELATIONS…RELATIONS COMMISSION and Pasco<\/mark> County Classroom Teachers Association, Respondents.\nNo. CC-38.\nDistrict Court…into a collective bargaining agreement with the Pasco<\/mark> Classroom Teachers Association (PCTA) effective…required to make a concession... ."\n[10] The Pasco<\/mark> County School District, unlike other county school", "sibling_ids": [ 1127660 ], "scdb_id": "", "per_curiam": null, "panel_ids": null, "pagerank": null, "non_participating_judge_ids": null, "neutralCite": null, "local_path": "", "lexisCite": null, "judge": "Ervin", "joined_by_ids": null, "id": 1127660, "download_url": null, "docket_id": 485186, "docketNumber": "CC-38", "dateReargumentDenied": null, "dateReargued": null, "dateFiled": "1977-11-15T23:53:00-08:00", "dateArgued": null, "court_id": "fladistctapp", "court_exact": "fladistctapp", "court_citation_string": "Fla. Dist. Ct. App.", "court": "District Court of Appeal of Florida", "cluster_id": 1127660, "cites": [ 103964, 104848, 104856, 104974, 105008, 105065, 106142, 106406, 106605, 106948, 107007, 107008, 107482, 107717, 108532, 108608, 108609, 109237, 109574, 228020, 250216, 252243, 267853, 275086, 286671, 287784, 291195, 293978, 319301, 324839, 330227, 331270, 1113246, 1127847, 1495665, 1658514, 1724583, 1777588, 1804174, 1840092, 1847620, 1864468, 3391556, 3397795 ], "citeCount": 69, "citation": [ "353 So. 2d 108" ], "caseNameShort": "", "caseName": "Pasco Cty. Sch. Bd. v. Florida Public Emp. Rel. Comm.", "author_id": 6889, "attorney": "", "title": "Hello Reinhard", "url": "https:\/\/www.courtlistener.com\/opinion\/1127660\/pasco-cty-sch-bd-v-florida-public-emp-rel-comm\/" }, ], "previous": null, "next": "https:\/\/www.courtlistener.com\/api\/rest\/v3\/search\/?page=2&q=pasco", "perpage": 5, "total_results": 2 } );')
      
          const jfresp = response        
          console.log('JF4 Pagetext' + jfresp)
            res
             .writeHead(200,{'Content-Type': 'application/json'})
             .end(clcallback + jfresp)
      
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