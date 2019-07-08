var express = require('express');
var request = require('http');

var router = express.Router();

function getFailureData(res, date){
  var url='http://bur00bir.us.oracle.com:8080/CIT_RESULTS_SERVER/cit/servers/failureCountReport/'+date;

  console.log("URL:"+url);
  var renderCallback = function(response){
    console.log(response);

    
    res.render('failure', { title: 'Failure Report' , date:date,data: response.data});
  } 

  var responsCallback = function(res) { 
    try{
      res.on('data', function(chunk){
        b+=chunk;
        //console.log(chunk);
        });
  
        res.on('end', function() {
          console.log(b);
          //var date= b.substring(0,15);
          //console.log(date);
          result = b.substring(0, b.length);
          console.log(result);
          jsonResult= JSON.parse(result);
          
          renderCallback(jsonResult);
  
        });

    }catch(e){

    }
    console.log('inside');
    var b='';
     
    
  };

  request.get({ host: 'bur00bir.us.oracle.com',family: 4, path: url, port: 8080,agent: false}, responsCallback).end();  
}

/* GET home page. */
router.get('/failure', function(req, res, next) {
  var dateObj = new Date();
  var month = dateObj.getUTCMonth() + 1; //months from 1-12
  var day = dateObj.getUTCDate();
  var year = dateObj.getUTCFullYear();
  
  newdate = day + "-" + month + "-" + year;
    //console.log(req);
    //getFailureData(res, '2-4-2018');
  getFailureData(res, newdate);
    
  });

router.post('/failure',function(req, res, next){
  console.log("inside filure post");
    date=req.body.datetext;
    var g1=date.split("/");
    var newDate=g1[1]+'-'+g1[0]+'-'+g1[2];
    console.log(newDate);
    getFailureData(res, newDate);
  });


  function getFailureData1(res, date){
    var url='http://bur00bir.us.oracle.com:8080/CIT_RESULTS_SERVER/cit/servers/failureReport/'+date;
  
  
    var renderCallback = function(response){
      console.log(response);
  
      
      res.render('failure', { title: 'Failure Report' , date:response.date,response: response});
    } 
  
    var responsCallback = function(res) { 
      console.log('inside');
      var b='';
       
      res.on('data', function(chunk){
        b+=chunk;
        //console.log(chunk);
        });
  
        res.on('end', function() {
          console.log(b);
          //var date= b.substring(0,15);
          //console.log(date);
          result = b.substring(0, b.length);
          console.log(result);
          jsonResult= JSON.parse(result);
          console.log(jsonResult.daily);
          renderCallback(jsonResult);
  
        });
    };
  
    request.get({ host: 'bur00bir.us.oracle.com',family: 4, path: url, port: 8080,agent: false}, responsCallback).end();  
  }
  
  /* GET home page. */
  router.get('/failure1', function(req, res, next) {
    var dateObj = new Date();
    var month = dateObj.getUTCMonth() + 1; //months from 1-12
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();
    
    newdate = day + "-" + month + "-" + year;
      //console.log(req);
      //getFailureData(res, '2-4-2018');
    getFailureData(res, newdate);
      
    });
  
  router.post('/failure1',function(req, res, next){
    console.log("inside filure post");
      date=req.body.datetext;
      var g1=date.split("/");
      var newDate=g1[1]+'-'+g1[0]+'-'+g1[2];
      console.log(newDate);
      getFailureData(res, newDate);
    });
module.exports = router;
