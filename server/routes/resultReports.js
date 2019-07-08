var express = require('express');
var request = require('http');
var dbOperations = require('./dboperations');

var router = express.Router();

function getFailureData(res, date){
  var url='http://bur00csm.us.oracle.com:8080/CIT_RESULTS_SERVER/cit/servers/failureCountReport/'+date;

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

  request.get({ host: 'bur00csm.us.oracle.com',family: 4, path: url, port: 8080,agent: false}, responsCallback).end();  
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

function getScriptResult(){

}

router.get('/scriptResult', function(req, res, next) {
  //res.send('respond with a resource');
  sql = `select ARSR.RUN_ID,ARH.AUTOMATION_HOST,ARSR.FUNCTIONALITY, ARSR.MANUAL_TC_NAME, ARH.RUN_STARTED,ARSR.OVERALL_STATUS, ARSR.FAILED_STAGE 
  from AUTOMATION_RUN_SCRIPT_RESULT ARSR,AUTOMATION_RUN_HEAD ARH where ARSR.RUN_ID=ARH.RUN_ID and ARSR.RUN_ID 
      in (select RUN_ID from( select * from AUTOMATION_RUN_HEAD where trunc(RUN_STARTED)<= to_date('14-12-2018','DD-MM-YYYY') and trunc(RUN_STARTED) >= trunc(to_date('14-12-2018','DD-MM-YYYY'),'IW') order by RUN_STARTED desc )) 
       order by ARH.AUTOMATION_HOST,MANUAL_TC_NAME,ARH.RUN_STARTED desc`;

  function onResult(response){
    var currentScriptName='',prevScriptName='',passCount=0,failCount=0;
    var scriptRecord={};
    //console.log(response);
    var resultSet=[];
    for(var i=0;i<response.length; i++){
      var row=response[i];
      currentScriptName=row['MANUAL_TC_NAME'];
      if(currentScriptName!=prevScriptName){
        //calculate pass/fail for prev record
        var sum=passCount+failCount;
        var perc=(passCount/sum)*100;
        if(prevScriptName!=''){
          scriptRecord['STATUS']=perc>=60?'Pass':'Fail';
        }
        resultSet.push(scriptRecord);

        scriptRecord={}
        passCount=0;
        failCount=0;
        
        scriptRecord['MANUAL_TC_NAME']=currentScriptName;
        scriptRecord['SERVER']=row['AUTOMATION_HOST'];
        scriptRecord['FUNCTIONALITY']=row['FUNCTIONALITY'];

      }else{
        if(row['OVERALL_STATUS']=='Pass')
          passCount++;
        else if(row['OVERALL_STATUS']=='Fail')
          failCount++; 
      }
      
      //console.log('script name:'+row['MANUAL_TC_NAME']);
      prevScriptName=currentScriptName;
    }

    if(currentScriptName!=prevScriptName){
      //calculate pass/fail for prev record
      var sum=passCount+failCount;
      var perc=(passCount/sum)*100;
      if(currentScriptName!=''){
        scriptRecord['STATUS']=perc>=60?'Pass':'Fail';
      }
    }
    console.log('resultSet:'+resultSet);
    console.log('resultSet:'+JSON.stringify(resultSet));
    
    res.render('scriptResult', { title: 'Testcase Results',resultSet:resultSet});    
  }
  dbOperations.runQuery(sql,onResult);
  
});

  //old one
  function getFailureData1(res, date){
    var url='http://bur00csm.us.oracle.com:8080/CIT_RESULTS_SERVER/cit/servers/failureReport/'+date;
  
  
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
  
    request.get({ host: 'bur00csm.us.oracle.com',family: 4, path: url, port: 8080,agent: false}, responsCallback).end();  
  }
  


  /* old one */
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
