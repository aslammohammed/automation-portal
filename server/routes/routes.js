var express = require('express');
var request = require('http');
var dbOperations = require('./dboperations');
var dbOperations1 = require('./dboperations1');
var reports = require('./reports');
//var echarts = require('echarts');

var router = express.Router();
module.exports = router;
/* GET home page. */
router.get('/daily', function(req, res, next) {
    console.log('inside get for echarts');
    var daily_servers='';
    var daily_pass='';
    var daily_fail='';
    var daily_total='';
    var weekly_servers='';
    var weekly_pass='';
    var weekly_fail='';
    var weekly_total='';
    var monthly_servers='';
    var monthly_pass='';
    var monthly_fail='';
    var monthly_total='';
    var dateObj = new Date();
    var month = dateObj.getUTCMonth() + 1; //months from 1-12
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();
    var newdate = day + "-" + month + "-" + year;
    var url='/CIT_RESULTS_SERVER/cit/servers/task/history/'+newdate;
    console.log(req);
    var renderCallback = function(servers1,pass1,fail1,total1,servers2,pass2,fail2,total2,servers3,pass3,fail3,total3,from_date){
      //console.log(servers);
      var totalSum = total1.split(",").reduce(add, 0);
      var passSum = pass1.split(",").reduce(add, 0);
      var totalSum1 = total2.split(",").reduce(add, 0);
      var passSum1 = pass2.split(",").reduce(add, 0);
      var totalSum2 = total3.split(",").reduce(add, 0);
      var passSum2 = pass3.split(",").reduce(add, 0);

      function add(a, b) {
          return parseInt(a) + parseInt(b);
      }
      console.log("Total"+totalSum);
      var perc=Math.round((passSum/totalSum)*100);
      console.log("percentage"+perc);
      console.log("Total"+totalSum1);
      var perc1=Math.round((passSum1/totalSum1)*100);
      console.log("percentage"+perc1);
      console.log("Total"+totalSum2);
      var perc2=Math.round((passSum2/totalSum2)*100);
      console.log("percentage"+perc2);
      console.log(from_date);
      var from=from_date.split("-");
      from_date=from[1]+'/'+from[0]+'/'+from[2];
      var da=newdate.split("-");
      newdate=da[1]+'/'+da[0]+'/'+da[2];
      res.render('daily', { title: 'Historical Report' , daily_servers: servers1,daily_pass: pass1,daily_fail: fail1,daily_total: total1, percentage: perc,dailyPass:passSum,dailyFail:(totalSum-passSum)
      ,date:newdate,weekly_servers: servers2,weekly_pass: pass2,weekly_fail: fail2,weekly_total: total2, percentage1: perc1,weeklyPass:passSum1,weeklyFail:(totalSum1-passSum1)
      ,monthly_servers: servers3,monthly_pass: pass3,monthly_fail: fail3,monthly_total: total3, percentage2: perc2,monthlyPass:passSum2,monthlyFail:(totalSum2-passSum2),from_date:from_date});
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
          console.log(jsonResult.From_Date);
          for (var server in jsonResult.daily) {
              if (jsonResult.daily.hasOwnProperty(server)) {
                var val = jsonResult.daily[server];
                daily_servers+= "'"+server+"',";
                daily_pass+=val.pass+",";
                daily_fail+=val.fail+",";
                daily_total+=val.total+",";
                console.log(val);
              }
            }
            for (var server in jsonResult.weekly) {
              if (jsonResult.weekly.hasOwnProperty(server)) {
                var val1 = jsonResult.weekly[server];
                weekly_servers+= "'"+server+"',";
                weekly_pass+=val1.pass+",";
                weekly_fail+=val1.fail+",";
                weekly_total+=val1.total+",";
                console.log(val1);
              }
            }
            for (var server in jsonResult.monthly) {
              if (jsonResult.monthly.hasOwnProperty(server)) {
                var val2 = jsonResult.monthly[server];
                monthly_servers+= "'"+server+"',";
                monthly_pass+=val2.pass+",";
                monthly_fail+=val2.fail+",";
                monthly_total+=val2.total+",";
                console.log(val2);
              }
            }
          //dailyLabels= "["+dailyLabels.substring(0,dailyLabels.length-1)+"]";
          //dailySeries="[["+dailySeries.substring(0,dailySeries.length-1)+"]]";
          daily_servers=daily_servers.substring(0,daily_servers.length-1);
          daily_pass=daily_pass.substring(0,daily_pass.length-1);
          daily_fail=daily_fail.substring(0,daily_fail.length-1);
          daily_total=daily_total.substring(0,daily_total.length-1);
          console.log(daily_servers);
          console.log(daily_pass);
          console.log(daily_fail);
          console.log(daily_total);

          console.log(monthly_pass);
          monthly_servers=monthly_servers.substring(0,monthly_servers.length-1);
          monthly_pass=monthly_pass.substring(0,monthly_pass.length-1);
          monthly_fail=monthly_fail.substring(0,monthly_fail.length-1);
          monthly_total=monthly_total.substring(0,monthly_total.length-1);
          console.log(monthly_servers);
          console.log(monthly_pass);
          console.log(monthly_fail);
          console.log(monthly_total);
          weekly_servers=weekly_servers.substring(0,weekly_servers.length-1);
          weekly_pass=weekly_pass.substring(0,weekly_pass.length-1);
          weekly_fail=weekly_fail.substring(0,weekly_fail.length-1);
          weekly_total=weekly_total.substring(0,weekly_total.length-1);
          console.log(weekly_servers);
          console.log(weekly_pass);
          console.log(weekly_fail);
          console.log(weekly_total);
          var from_date=jsonResult.From_Date;
          //console.log(jsonResult.from_date);
          console.log("about to render");
          renderCallback(daily_servers,daily_pass,daily_fail,daily_total,weekly_servers,weekly_pass,weekly_fail,weekly_total,monthly_servers,monthly_pass,monthly_fail,monthly_total,from_date);
  
        });
    };
  
    request.get({ host: 'bur00bir.us.oracle.com',family: 4, path:url, port: 8080,agent: false}, responsCallback).end();
    
     
    
  });
router.post('/daily',function(req, res, next){
    var date='';
    var g='';
    var url='/CIT_RESULTS_SERVER/cit/servers/task/history/'
    date=req.body.datetext;
    var g1=date.split("/");
    g=g1[1]+'-'+g1[0]+'-'+g1[2];
    date=g1[0]+'/'+g1[1]+'/'+g1[2];
    url=url+g;
    var daily_servers='';
    var daily_pass='';
    var daily_fail='';
    var daily_total='';
    var weekly_servers='';
    var weekly_pass='';
    var weekly_fail='';
    var weekly_total='';
    var monthly_servers='';
    var monthly_pass='';
    var monthly_fail='';
    var monthly_total='';
    console.log(req);
    var renderCallback = function(servers1,pass1,fail1,total1,servers2,pass2,fail2,total2,servers3,pass3,fail3,total3,from_date){
      //console.log(servers);
      var totalSum = total1.split(",").reduce(add, 0);
      var passSum = pass1.split(",").reduce(add, 0);
      var totalSum1 = total2.split(",").reduce(add, 0);
      var passSum1 = pass2.split(",").reduce(add, 0);
      var totalSum2 = total3.split(",").reduce(add, 0);
      var passSum2 = pass3.split(",").reduce(add, 0);

      function add(a, b) {
          return parseInt(a) + parseInt(b);
      }
      console.log("Total"+totalSum);
      var perc=Math.round((passSum/totalSum)*100);
      console.log("percentage"+perc);
      console.log("Total"+totalSum1);
      var perc1=Math.round((passSum1/totalSum1)*100);
      console.log("percentage"+perc1);
      console.log("Total"+totalSum2);
      var perc2=Math.round((passSum2/totalSum2)*100);
      console.log("percentage"+perc2);
      var from=from_date.split("-");
      from_date=from[1]+'/'+from[0]+'/'+from[2];
      
      //res.render('daily', { title: 'Historical Report' , daily_servers: servers1,daily_pass: pass1,daily_fail: fail1,daily_total: total1, percentage: perc,date:date,weekly_servers: servers2,weekly_pass: pass2,weekly_fail: fail2,weekly_total: total2, percentage1: perc1,monthly_servers: servers3,monthly_pass: pass3,monthly_fail: fail3,monthly_total: total3, percentage2: perc2,from_date:from_date});
      res.render('daily', { title: 'Historical Report' , daily_servers: servers1,daily_pass: pass1,daily_fail: fail1,daily_total: total1, percentage: perc,dailyPass:passSum,dailyFail:(totalSum-passSum)
      ,date:date,weekly_servers: servers2,weekly_pass: pass2,weekly_fail: fail2,weekly_total: total2, percentage1: perc1,weeklyPass:passSum1,weeklyFail:(totalSum1-passSum1)
      ,monthly_servers: servers3,monthly_pass: pass3,monthly_fail: fail3,monthly_total: total3, percentage2: perc2,monthlyPass:passSum2,monthlyFail:(totalSum2-passSum2),from_date:from_date});
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
          for (var server in jsonResult.daily) {
              if (jsonResult.daily.hasOwnProperty(server)) {
                var val = jsonResult.daily[server];
                daily_servers+= "'"+server+"',";
                daily_pass+=val.pass+",";
                daily_fail+=val.fail+",";
                daily_total+=val.total+",";
                console.log(val);
              }
            }
            for (var server in jsonResult.weekly) {
              if (jsonResult.weekly.hasOwnProperty(server)) {
                var val1 = jsonResult.weekly[server];
                weekly_servers+= "'"+server+"',";
                weekly_pass+=val1.pass+",";
                weekly_fail+=val1.fail+",";
                weekly_total+=val1.total+",";
                console.log(val1);
              }
            }
            for (var server in jsonResult.monthly) {
              if (jsonResult.monthly.hasOwnProperty(server)) {
                var val2 = jsonResult.monthly[server];
                monthly_servers+= "'"+server+"',";
                monthly_pass+=val2.pass+",";
                monthly_fail+=val2.fail+",";
                monthly_total+=val2.total+",";
                console.log(val2);
              }
            }
          //dailyLabels= "["+dailyLabels.substring(0,dailyLabels.length-1)+"]";
          //dailySeries="[["+dailySeries.substring(0,dailySeries.length-1)+"]]";
          daily_servers=daily_servers.substring(0,daily_servers.length-1);
          daily_pass=daily_pass.substring(0,daily_pass.length-1);
          daily_fail=daily_fail.substring(0,daily_fail.length-1);
          daily_total=daily_total.substring(0,daily_total.length-1);
          console.log(daily_servers);
          console.log(daily_pass);
          console.log(daily_fail);
          console.log(daily_total);

          console.log(monthly_pass);
          monthly_servers=monthly_servers.substring(0,monthly_servers.length-1);
          monthly_pass=monthly_pass.substring(0,monthly_pass.length-1);
          monthly_fail=monthly_fail.substring(0,monthly_fail.length-1);
          monthly_total=monthly_total.substring(0,monthly_total.length-1);
          console.log(monthly_servers);
          console.log(monthly_pass);
          console.log(monthly_fail);
          console.log(monthly_total);
          weekly_servers=weekly_servers.substring(0,weekly_servers.length-1);
          weekly_pass=weekly_pass.substring(0,weekly_pass.length-1);
          weekly_fail=weekly_fail.substring(0,weekly_fail.length-1);
          weekly_total=weekly_total.substring(0,weekly_total.length-1);
          console.log(weekly_servers);
          console.log(weekly_pass);
          console.log(weekly_fail);
          console.log(weekly_total);
          var from_date=jsonResult.From_Date;

          console.log("about to render");
          renderCallback(daily_servers,daily_pass,daily_fail,daily_total,weekly_servers,weekly_pass,weekly_fail,weekly_total,monthly_servers,monthly_pass,monthly_fail,monthly_total,from_date);
  
        });
    };
  
    request.get({ host: 'bur00bir.us.oracle.com',family: 4, path: url, port: 8080,agent: false}, responsCallback).end();
    
     
    
  });
router.get('/execution-trend',async function(req,res,next) {
  try{
    var date = new Date();
    date = date.getDate()+'-'+(date.getMonth()+1)+'-'+date.getFullYear();
    console.log("Date:"+date);
    var data = await reports.executionTrend(date);
    data.date = date.split('-').join('/');
    var response = {"success":"true","data":data};
    //res.send(JSON.stringify(response,null,4) );
    res.render('execution-trend',{title:'Execution Trend',response:response});

  }catch(e){

    console.log(e);
    next(e);
    var response = {"success":"false","error":e};
    //res.send(JSON.stringify(response,null,4) );
    res.render('execution-trend',{title:'Execution Trend',response:response});
  } 
});
router.post('/execution-trend',async function(req,res,next) {
  try{

    var date=req.body.datetext;
    var g1=date.split("/");
    date=g1[1]+'-'+g1[0]+'-'+g1[2];
    //date=g1[0]+'/'+g1[1]+'/'+g1[2];
    console.log("Date:"+date);
    var data = await reports.executionTrend(date);
    data.date = date.split('-').split('/');
    var response = {"success":"true","data":data};
    //res.send(JSON.stringify(response,null,4) );
    res.render('execution-trend',{title:'Execution Trend',response:response});

  }catch(e){

    console.log(e);
    next(e);
    var response = {"success":"false","error":e};
    //res.send(JSON.stringify(response,null,4) );
    res.render('execution-trend',{title:'Execution Trend',response:response});
  } 
});

router.get('/dashboard', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'x-requested-with');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Headers', 'x-requested-with');
    console.log('inside get for echarts');
    var month_name='';
    var pass='';
    var fail='';
    var total='';
    var pass_per='';
    var fail_per='';
    var avg_it='';
  
    var dashboardPromise = new Promise(function(resolve, reject) {
      request.get({ host:'bur00bir.us.oracle.com',family: 4, path: '/CIT_RESULTS_SERVER/cit/servers/dashboardData', port: 8080,agent: false}, function(res) { 
        console.log('inside');
        var b='';
         
        res.on('data', function(chunk){
          b+=chunk;
          //console.log(chunk);
          });
    
        res.on('end', function() {
          //console.log(b);
          //var date= b.substring(0,15);
          //console.log(date);
          //result = b.substring(15, b.length);
          result = b.substring(0, b.length);
          console.log(result);
          jsonResult= JSON.parse(result);
          resolve(jsonResult)
        });
        res.on('error', function() {
          //console.log(b);
          //var date= b.substring(0,15);
          //console.log(date);
          //result = b.substring(15, b.length);
          result = b.substring(0, b.length);
          console.log(result);
          jsonResult= JSON.parse(result);
          reject(jsonResult)
        });
  
      })
      .end();
    });
  
  
    var scriptPromise = new Promise(function(resolve, reject) {
      request.get({ host: 'bur00bir.us.oracle.com',family: 4, path: '/CIT_RESULTS_SERVER/cit/servers/scriptDelivery', port: 8080,agent: false}, function(res) { 
        console.log('inside');
        var b='';
         
        res.on('data', function(chunk){
          b+=chunk;
          //console.log(chunk);
          });
    
        res.on('end', function() {
          //console.log(b);
          //var date= b.substring(0,15);
          //console.log(date);
          //result = b.substring(15, b.length);
          result = b.substring(0, b.length);
          console.log(result);
          jsonResult= JSON.parse(result);
          resolve(jsonResult)
        });
        res.on('error', function() {
          //console.log(b);
          //var date= b.substring(0,15);
          //console.log(date);
          //result = b.substring(15, b.length);
          result = b.substring(0, b.length);
          console.log(result);
          jsonResult= JSON.parse(result);
          reject(jsonResult)
        });
  
      })
      .end();
    });
  
    var avgExecPromise = new Promise(function(resolve, reject) {
  
      var dateObj = new Date();
      var month = dateObj.getUTCMonth() + 1; //months from 1-12
      var day = dateObj.getUTCDate();
      var year = dateObj.getUTCFullYear();
      var newdate = day + "-" + month + "-" + year;
      var date=month + "/" + day + "/" + year;
      var url='/CIT_RESULTS_SERVER/cit/servers/ta/avg/'+newdate;
      request.get({ host:'bur00bir.us.oracle.com',family: 4, path:url, port: 8080,agent: false}, function(res) { 
        console.log('inside');
        var b='';
         
        res.on('data', function(chunk){
          b+=chunk;
          //console.log(chunk);
          });
    
        res.on('end', function() {
          //console.log(b);
          //var date= b.substring(0,15);
          //console.log(date);
          //result = b.substring(15, b.length);
  
          result = b.substring(34,b.length);
          console.log(b);
  
          jsonResult= JSON.parse(result);
          /*
          result = b.substring(0, b.length);
          console.log(result);
          jsonResult= JSON.parse(result);
          */
          resolve(jsonResult)
        });
        res.on('error', function() {
          //console.log(b);
          //var date= b.substring(0,15);
          //console.log(date);
          //result = b.substring(15, b.length);
          result = b.substring(0, b.length);
          console.log(result);
          jsonResult= JSON.parse(result);
          reject(jsonResult)
        });
  
      })
      .end();
    });
  
    var migrationHistoryPromise = new Promise(function(resolve, reject){
      //sql = `select to_char(MONTH1,'MON-YYYY') MONTH, sum(MIGRATION_COUNT) MIGRATION_COUNT,ENVIRONMENT_ID,MONTH1 from (select count(PRODUCT_ID) MIGRATION_COUNT,ENVIRONMENT_ID,trunc( MIGRATION_DATE,'MON') MONTH1 from MIGRATIONS group by trunc( MIGRATION_DATE,'MON'),ENVIRONMENT_ID) group by MONTH1,ENVIRONMENT_ID order by ENVIRONMENT_ID,MONTH1`;
      sql = `select to_char(T1.MONTH1,'MON-YYYY') MONTH, sum(T1.MIGRATION_COUNT) MIGRATION_COUNT,T2.NAME ENVIRONMENT,T1.MONTH1 from 
      (select count(PRODUCT_ID) MIGRATION_COUNT,ENVIRONMENT_ID,trunc( MIGRATION_DATE,'MON') MONTH1 from MIGRATIONS group by trunc( MIGRATION_DATE,'MON'),ENVIRONMENT_ID) T1 
      left join ENVIRONMENTS T2 on T1.ENVIRONMENT_ID=T2.ID where MONTH1<=add_months(sysdate,-1) and MONTH1>=add_months(sysdate,-7)  group by MONTH1,T2.NAME order by T2.NAME,T1.MONTH1`;
      //process migration data
      function processData(responseData){
        console.log("res:"+JSON.stringify(responseData));
        var processedData={};
        var migrationHistory = [];
        var prevEnv='',currEnv='';
        var migrationDataforEnv={};
        var migrationData=[];
        for(var i=0;i<responseData.length;i++){
          var entry = responseData[i];
          currEnv = entry.ENVIRONMENT;
          if(prevEnv!=currEnv && currEnv!=''){
            
            if(migrationDataforEnv.environment!=null){
              migrationDataforEnv.migrationData=migrationData;
              migrationHistory.push(migrationDataforEnv); 
            }
  
            
            migrationDataforEnv={};
            migrationData=[];
            migrationDataforEnv.environment=currEnv;
            var ob={};
              ob.month=entry.MONTH;
              ob.migrationCount=entry.MIGRATION_COUNT;
            migrationData.push(ob);  
            
          }else{
            var ob={};
              ob.month=entry.MONTH;
              ob.migrationCount=entry.MIGRATION_COUNT;
            migrationData.push(ob);
          }
          prevEnv=currEnv;
        }
        if(migrationDataforEnv.environment!=null){
          migrationDataforEnv.migrationData=migrationData;
          migrationHistory.push(migrationDataforEnv); 
        }
        processedData.migrationHistory = migrationHistory;
        resolve(processedData);
      }
      dbOperations.runQuery(sql,processData);
    });
  
    var migrationProductPromise = new Promise(function(resolve, reject){
      //sql = `select to_char(MONTH1,'MON-YYYY') MONTH, sum(MIGRATION_COUNT) MIGRATION_COUNT,ENVIRONMENT_ID,MONTH1 from (select count(PRODUCT_ID) MIGRATION_COUNT,ENVIRONMENT_ID,trunc( MIGRATION_DATE,'MON') MONTH1 from MIGRATIONS group by trunc( MIGRATION_DATE,'MON'),ENVIRONMENT_ID) group by MONTH1,ENVIRONMENT_ID order by ENVIRONMENT_ID,MONTH1`;
      sql = `select T3.NAME as PRODUCT_NAME, T1.MIGRATION_COUNT MIGRATION_COUNT,T2.NAME ENVIRONMENT from 
      (select PRODUCT_ID,count(PRODUCT_ID) MIGRATION_COUNT,ENVIRONMENT_ID from MIGRATIONS where MIGRATION_DATE <=add_months(sysdate,-1) and MIGRATION_DATE>=add_months(sysdate,-2) group by PRODUCT_ID,ENVIRONMENT_ID) T1, ENVIRONMENTS T2, PRODUCTS T3 where T1.ENVIRONMENT_ID=T2.ID and T1.PRODUCT_ID=T3.ID`;
      sql1 = `select T3.NAME as PRODUCT_NAME, T1.MIGRATION_COUNT MIGRATION_COUNT,T2.NAME ENVIRONMENT,T1.MIGRATION_DATE from 
      (select PRODUCT_ID,count(PRODUCT_ID) MIGRATION_COUNT,ENVIRONMENT_ID,trunc( MIGRATION_DATE,'MM') as MIGRATION_DATE from MIGRATIONS  group by PRODUCT_ID,ENVIRONMENT_ID,trunc( MIGRATION_DATE,'MM')) T1, ENVIRONMENTS T2, PRODUCTS T3 where T1.ENVIRONMENT_ID=T2.ID and T1.PRODUCT_ID=T3.ID order by T1.MIGRATION_DATE desc`;
      //process migration data
      function processData(responseData){
        console.log("");
        console.log("migrationProductPromise:"+JSON.stringify(responseData));
        //var processedData={};
        var productMigrationHistory = [];
        var prevEnv='',currEnv='';
        var migrationDataforEnv={};
        var migrationData=[];
        for(var i=0;i<responseData.length;i++){
          var entry = responseData[i];
          currEnv = entry.ENVIRONMENT;
          if(prevEnv!=currEnv && currEnv!=''){
            
            if(migrationDataforEnv.environment!=null){
              migrationDataforEnv.migrationData=migrationData;
              productMigrationHistory.push(migrationDataforEnv); 
            }
  
            
            migrationDataforEnv={};
            migrationData=[];
            migrationDataforEnv.environment=currEnv;
            var ob={};
              ob.product=entry.PRODUCT_NAME;
              ob.migrationCount=entry.MIGRATION_COUNT;
            migrationData.push(ob);  
            
          }else{
            var ob={};
              ob.product=entry.PRODUCT_NAME;
              ob.migrationCount=entry.MIGRATION_COUNT;
            migrationData.push(ob);
          }
          prevEnv=currEnv;
        }
        if(migrationDataforEnv.environment!=null){
          migrationDataforEnv.migrationData=migrationData;
          productMigrationHistory.push(migrationDataforEnv); 
        }
        
        resolve(productMigrationHistory);
      }
      dbOperations.runQuery(sql,processData);
    });
  
    var productCoveragePromise = new Promise(function(resolve, reject){
      //sql = `select to_char(MONTH1,'MON-YYYY') MONTH, sum(MIGRATION_COUNT) MIGRATION_COUNT,ENVIRONMENT_ID,MONTH1 from (select count(PRODUCT_ID) MIGRATION_COUNT,ENVIRONMENT_ID,trunc( MIGRATION_DATE,'MON') MONTH1 from MIGRATIONS group by trunc( MIGRATION_DATE,'MON'),ENVIRONMENT_ID) group by MONTH1,ENVIRONMENT_ID order by ENVIRONMENT_ID,MONTH1`;
      sql = `select PRODUCT, MANUALTEST, AUTOMATIONSMOKETEST from INTEGRATION_COVERAGE`;
      //process migration data
      function processData(responseData){
        console.log("res:"+JSON.stringify(responseData));
        var productCoverage={};
        var totalP =0,manualtestP=0,automationtestP=0;
        totalP=responseData.length;
        for(var i=0;i<responseData.length;i++){
          var entry = responseData[i];
          
          if(entry.MANUALTEST=='Yes'){
            manualtestP++;
            
          }
          if(entry.AUTOMATIONSMOKETEST=='Yes'){
            automationtestP++; 
          }
        }
        productCoverage = {'total':totalP,'manual':manualtestP,'automation':automationtestP};
        resolve(productCoverage);
      }
      dbOperations.runQuery(sql,processData);
    });
  
    var notesPromise = new Promise(function(resolve, reject){
      //sql = `select to_char(MONTH1,'MON-YYYY') MONTH, sum(MIGRATION_COUNT) MIGRATION_COUNT,ENVIRONMENT_ID,MONTH1 from (select count(PRODUCT_ID) MIGRATION_COUNT,ENVIRONMENT_ID,trunc( MIGRATION_DATE,'MON') MONTH1 from MIGRATIONS group by trunc( MIGRATION_DATE,'MON'),ENVIRONMENT_ID) group by MONTH1,ENVIRONMENT_ID order by ENVIRONMENT_ID,MONTH1`;
      sql = `select ID,NAME,CONTENT from NOTE`;
      //process migration data
      function processData(responseData){
        console.log("res:"+JSON.stringify(responseData));
        var notes=[];
        for(var i=0;i<responseData.length;i++){
          var entry = responseData[i];
          var note = {};
          note.id = entry.ID;
          note.name = entry.NAME;
          note.content = entry.CONTENT;
          notes.push(note);
        }
        
        resolve(notes);
      }
      dbOperations.runQuery(sql,processData);
    });
  
    var productsPromise = new Promise(function(resolve, reject){
      //sql = `select to_char(MONTH1,'MON-YYYY') MONTH, sum(MIGRATION_COUNT) MIGRATION_COUNT,ENVIRONMENT_ID,MONTH1 from (select count(PRODUCT_ID) MIGRATION_COUNT,ENVIRONMENT_ID,trunc( MIGRATION_DATE,'MON') MONTH1 from MIGRATIONS group by trunc( MIGRATION_DATE,'MON'),ENVIRONMENT_ID) group by MONTH1,ENVIRONMENT_ID order by ENVIRONMENT_ID,MONTH1`;
      sql = `select ID,NAME from PRODUCTS`;
      //process migration data
      function processData(responseData){
        console.log("product:"+JSON.stringify(responseData));
        var products=[];
        for(var i=0;i<responseData.length;i++){
          var entry = responseData[i];
          var product = {};
          product.id = entry.ID;
          product.name = entry.NAME;
          
          products.push(product);
        }
        
        resolve(products);
      }
      dbOperations.runQuery(sql,processData);
    });
  
    var envsPromise = new Promise(function(resolve, reject){
      //sql = `select to_char(MONTH1,'MON-YYYY') MONTH, sum(MIGRATION_COUNT) MIGRATION_COUNT,ENVIRONMENT_ID,MONTH1 from (select count(PRODUCT_ID) MIGRATION_COUNT,ENVIRONMENT_ID,trunc( MIGRATION_DATE,'MON') MONTH1 from MIGRATIONS group by trunc( MIGRATION_DATE,'MON'),ENVIRONMENT_ID) group by MONTH1,ENVIRONMENT_ID order by ENVIRONMENT_ID,MONTH1`;
      sql = `select ID,NAME from ENVIRONMENTS`;
      //process migration data
      function processData(responseData){
        console.log("res:"+JSON.stringify(responseData));
        var envs=[];
        for(var i=0;i<responseData.length;i++){
          var entry = responseData[i];
          var env = {};
          env.id = entry.ID;
          env.name = entry.NAME;
          
          envs.push(env);
        }
        
        resolve(envs);
      }
      dbOperations.runQuery(sql,processData);
    });
  
    var manualTestPromise = new Promise(function(resolve, reject){
      //sql = `select to_char(MONTH1,'MON-YYYY') MONTH, sum(MIGRATION_COUNT) MIGRATION_COUNT,ENVIRONMENT_ID,MONTH1 from (select count(PRODUCT_ID) MIGRATION_COUNT,ENVIRONMENT_ID,trunc( MIGRATION_DATE,'MON') MONTH1 from MIGRATIONS group by trunc( MIGRATION_DATE,'MON'),ENVIRONMENT_ID) group by MONTH1,ENVIRONMENT_ID order by ENVIRONMENT_ID,MONTH1`;
      sql = `select to_char(CREATED,'MON-YYYY') as MONTH, TEST_AUTHORED,TEST_PLANNED,TEST_EXECUTED,PASSED,FAILED,DEFECTS,CREATED from MANUAL_TEST_HEAD  where ENVIRONMENT_ID ='1' order by CREATED desc`;
      //process migration data
      function processData(responseData){
        console.log("res:"+JSON.stringify(responseData));
        
        resolve(responseData);
      }
      dbOperations.runQuery(sql,processData);
    });
  
    var executionPlanPromise = new Promise(function(resolve, reject){
      //sql = `select to_char(MONTH1,'MON-YYYY') MONTH, sum(MIGRATION_COUNT) MIGRATION_COUNT,ENVIRONMENT_ID,MONTH1 from (select count(PRODUCT_ID) MIGRATION_COUNT,ENVIRONMENT_ID,trunc( MIGRATION_DATE,'MON') MONTH1 from MIGRATIONS group by trunc( MIGRATION_DATE,'MON'),ENVIRONMENT_ID) group by MONTH1,ENVIRONMENT_ID order by ENVIRONMENT_ID,MONTH1`;
      sql = `select T2.NAME as INTEGRATION, T3.NAME as ENVIRONMENT ,to_char(CREATED,'MON-YYYY') as MONTH,trunc(CREATED,'MM') as MONTH1,STATUS from EXECUTION_PLANNING T1, INTEGRATION T2, ENVIRONMENTS T3 
      where T1.INTEGRATION_ID = T2.ID and T1.ENVIRONMENT_ID = T3.ID and ENVIRONMENT_ID = '1' order by MONTH1`;
      //process migration data
      function processData(responseData){
        console.log("plan dd:"+JSON.stringify(responseData));
        var executionPlan=[];
        var currMonth = '',prevMonth='';
        var monthData = {};
        var planningData = [];
        for(var i=0;i<responseData.length;i++){
          var entry = responseData[i];
          currMonth  = entry.MONTH;
  
          if(currMonth!=prevMonth && currMonth!=''){
            if(monthData.month!=null){
              monthData.planningData = planningData;
              executionPlan.push(monthData);
            }
  
            monthData = {};
            planningData = [];
            monthData.month = currMonth;
            
          }
  
          var plan = {};
          plan.integration = entry.INTEGRATION;
          plan.status = entry.STATUS;
          planningData.push(plan);
          prevMonth = currMonth;
        }
  
        if(monthData.month!=null){
          monthData.planningData = planningData;
          executionPlan.push(monthData);
        }
        
        resolve(executionPlan);
      }
      dbOperations.runQuery(sql,processData);
    });
  
    var bugProductPromise = new Promise(function(resolve, reject){
      //sql = `select to_char(MONTH1,'MON-YYYY') MONTH, sum(MIGRATION_COUNT) MIGRATION_COUNT,ENVIRONMENT_ID,MONTH1 from (select count(PRODUCT_ID) MIGRATION_COUNT,ENVIRONMENT_ID,trunc( MIGRATION_DATE,'MON') MONTH1 from MIGRATIONS group by trunc( MIGRATION_DATE,'MON'),ENVIRONMENT_ID) group by MONTH1,ENVIRONMENT_ID order by ENVIRONMENT_ID,MONTH1`;
      
      sql = `SELECT COUNT(BUGNO) as DEFECTS,P.ALIAS from selive_rpthead h,SELIVEPLUS.SELIVE_PRODUCT P
      where H.PRODUCT_ID=P.PRODUCT_ID and h.status in (11,26,36,39,15,82,94,86,60) and h.BUG_DATE >= '01-JULY-2017' and h.BUGNO in
          (SELECT distinct bugno from selive_rpthd_trcking_grps where tracking_group_id =2671 and tracking_group_value_id IN 
                  (SELECT id FROM selive_tracking_group_values WHERE UPPER(name) LIKE UPPER('EIT (Enterprise Integration Defects)'))) group by P.ALIAS`;
      sql1 = `SELECT COUNT(BUGNO) as DEFECTS,PRODUCT_ID from selive_rpthead h
      where h.status in (11,26,36,39,15,82,94,86,60) and h.BUG_DATE >= '01-JULY-2017' and h.BUGNO in
          (SELECT distinct bugno from selive_rpthd_trcking_grps where tracking_group_id =2671 and tracking_group_value_id IN 
                  (SELECT id FROM selive_tracking_group_values WHERE UPPER(name) LIKE UPPER('EIT (Enterprise Integration Defects)'))) group by PRODUCT_ID`;
      //process migration data
      function processData(responseData){
        console.log("plan dd:"+JSON.stringify(responseData));
        
        
        resolve(responseData);
      }
      dbOperations.runQuerySE(sql,processData);
    });
  
  
  
    
    var renderCallback = function(data,month_name,pass,fail,total,currentMonthTotal,prevMonthTotal,avg_it,count,env){
      console.log(month_name);
      var totalSum = total.split(",").reduce(add, 0);
      var passSum = pass.split(",").reduce(add, 0);
      function add(a, b) {
          return parseInt(a) + parseInt(b);
      }
      console.log("Total"+totalSum);
      var perc=Math.round((passSum/totalSum)*100);
      console.log("percentage"+perc);
      console.log(env);
      res.render('dashboard', { title: 'Dashboard' ,data:data, month_name: month_name, pass: pass, fail: fail, total: total,prev_total:prevMonthTotal, percentage: perc,pass_per: pass_per,fail_per: fail_per,avg_it: avg_it,sum:currentMonthTotal,count:count,env:env});
    } 
  
    
  
    Promise.all([dashboardPromise, scriptPromise,avgExecPromise,migrationHistoryPromise,productCoveragePromise,
        migrationProductPromise,notesPromise,productsPromise,envsPromise,manualTestPromise,executionPlanPromise,bugProductPromise])
      .then(function([dashboardResult, scriptResult,avgExecResult,migrationHistoryData,productCoverageData,migrationProductData,
        notesData,productsData,envsData,manualTestData,executionPlanData,bugProductData]) {
              //respond to client
              console.log("respond to client now");
  
              //handling dashboardResult
              jsonResult=dashboardResult['data'];
              var prevMonthTotal = jsonResult['velocity'][2]['total_scripts'];
              var currentMonthTotal = jsonResult['velocity'][1]['total_scripts'];
              var i=0;
              var sum=0;
              var count=jsonResult['serverCount'];
              var env=jsonResult['environment'];
              var velocity = jsonResult['velocity'];
              for(var i=0;i<velocity.length;i++){
                var val= velocity[i];
                    month_name+= "'"+val.month+"',";
                    pass+=val.total_pass+",";
                    fail+=val.total_fail+",";
                    avg_it+=val.avg_iteration+",";
                    total+=(parseInt(val.total_pass) + parseInt(val.total_fail))+",";
                    if(i==0)
                    {
                      sum=val.total_scripts;
                      //count=val.serverCount;
                      //env=val.Environment;
                    }
                    
                    //pass_per+=val.pass_percentage+",";
                    //fail_per+=val.fail_percentage+",";
                    console.log(val);
  
              }
              //dailyLabels= "["+dailyLabels.substring(0,dailyLabels.length-1)+"]";
              //dailySeries="[["+dailySeries.substring(0,dailySeries.length-1)+"]]";
              month_name= month_name.substring(0,month_name.length-1);
              pass=pass.substring(0,pass.length-1);
              fail=fail.substring(0,fail.length-1);
              total=total.substring(0,total.length-1);
              //pass_per=pass_per.substring(0,pass_per.length-1);
              //fail_per=fail_per.substring(0,fail_per.length-1);
              avg_it=avg_it.substring(0,avg_it.length-1);
              console.log(month_name);
              console.log(pass);
              console.log(fail);
              console.log("total:"+total);
              console.log(pass_per);
              console.log(fail_per);
              console.log(avg_it);
              console.log("about to render");
              console.log("AVGEXE:"+JSON.stringify( avgExecResult));
              //handling scriptResult
              jsonResult.scriptDeliveryData = scriptResult.data.scriptDeliveryData;
              jsonResult.avgExecData=avgExecResult;
              jsonResult.migrationData = migrationHistoryData;
              jsonResult.migrationData.productHistory=migrationProductData;
              jsonResult.productCoverageData = productCoverageData;
              jsonResult.notes = notesData;
              jsonResult.products = productsData;
              jsonResult.envs = envsData ; 
              jsonResult.manualTestData = manualTestData;
              jsonResult.executionPlanData = executionPlanData;
              jsonResult.bugProductData = bugProductData;
              console.log("SDD:"+scriptResult.data.scriptDeliveryData);
              console.log("SDD:"+jsonResult.scriptDeliveryData);
              console.log("migrationHistoryData:"+ JSON.stringify(migrationHistoryData) );
              console.log("ProductCove:"+JSON.stringify(productCoverageData));
              console.log("Migration History for product:"+JSON.stringify(migrationProductData));
              console.log("Notes:"+JSON.stringify(notesData));
              console.log("Plan:"+JSON.stringify(jsonResult.executionPlanData));
              console.log("bugProductPromise:"+JSON.stringify(bugProductData));
              renderCallback(jsonResult,month_name,pass,fail,total,currentMonthTotal,prevMonthTotal,avg_it,count,env);
  
          })
          .catch(function(error) {
              //catch an error generated from either request
          })
    //request.get({ host:'bur00bir.us.oracle.com',family: 4, path: '/CIT_RESULTS_SERVER/cit/servers/tas/velocity', port: 8080,agent: false}, responsCallback).end();
    //request.get({ host:'bur00bir.us.oracle.com',family: 4, path: '/CIT_RESULTS_SERVER/cit/servers/dashboardData', port: 8080,agent: false}, responsCallback).end();
     
    
});

router.get('/dashboard/eit', function(req, res, next) {
  
  var notesPromise = new Promise(function(resolve, reject){
    //sql = `select to_char(MONTH1,'MON-YYYY') MONTH, sum(MIGRATION_COUNT) MIGRATION_COUNT,ENVIRONMENT_ID,MONTH1 from (select count(PRODUCT_ID) MIGRATION_COUNT,ENVIRONMENT_ID,trunc( MIGRATION_DATE,'MON') MONTH1 from MIGRATIONS group by trunc( MIGRATION_DATE,'MON'),ENVIRONMENT_ID) group by MONTH1,ENVIRONMENT_ID order by ENVIRONMENT_ID,MONTH1`;
    sql = `select ID,NAME,CONTENT from NOTE`;
    //process migration data
    function processData(responseData){
      console.log("res:"+JSON.stringify(responseData));
      var notes=[];
      for(var i=0;i<responseData.length;i++){
        var entry = responseData[i];
        var note = {};
        note.id = entry.ID;
        note.name = entry.NAME;
        note.content = entry.CONTENT;
        notes.push(note);
      }
      
      resolve(notes);
    }
    dbOperations.runQuery(sql,processData);
  });

  
  var manualTestPromise = new Promise(function(resolve, reject){
    //sql = `select to_char(MONTH1,'MON-YYYY') MONTH, sum(MIGRATION_COUNT) MIGRATION_COUNT,ENVIRONMENT_ID,MONTH1 from (select count(PRODUCT_ID) MIGRATION_COUNT,ENVIRONMENT_ID,trunc( MIGRATION_DATE,'MON') MONTH1 from MIGRATIONS group by trunc( MIGRATION_DATE,'MON'),ENVIRONMENT_ID) group by MONTH1,ENVIRONMENT_ID order by ENVIRONMENT_ID,MONTH1`;
    sql = `select to_char(CREATED,'MON-YYYY') as MONTH, TEST_AUTHORED,TEST_PLANNED,TEST_EXECUTED,PASSED,FAILED,DEFECTS,CREATED from MANUAL_TEST_HEAD  where ENVIRONMENT_ID ='2' order by CREATED desc`;
    //process migration data
    function processData(responseData){
      console.log("res:"+JSON.stringify(responseData));
      
      resolve(responseData);
    }
    dbOperations.runQuery(sql,processData);
  });

  var executionPlanPromise = new Promise(function(resolve, reject){
    //sql = `select to_char(MONTH1,'MON-YYYY') MONTH, sum(MIGRATION_COUNT) MIGRATION_COUNT,ENVIRONMENT_ID,MONTH1 from (select count(PRODUCT_ID) MIGRATION_COUNT,ENVIRONMENT_ID,trunc( MIGRATION_DATE,'MON') MONTH1 from MIGRATIONS group by trunc( MIGRATION_DATE,'MON'),ENVIRONMENT_ID) group by MONTH1,ENVIRONMENT_ID order by ENVIRONMENT_ID,MONTH1`;
    sql = `select T2.NAME as INTEGRATION, T3.NAME as ENVIRONMENT ,to_char(CREATED,'MON-YYYY') as MONTH,trunc(CREATED,'MM') as MONTH1,initCap(STATUS) as STATUS,VERSION from EXECUTION_PLANNING T1, INTEGRATION T2, ENVIRONMENTS T3 
    where T1.INTEGRATION_ID = T2.ID and T1.ENVIRONMENT_ID = T3.ID and ENVIRONMENT_ID = '3' order by MONTH1,INTEGRATION`;
    //process migration data
    function processData(responseData){
      console.log("plan dd:"+JSON.stringify(responseData));
      var executionPlan=[];
      var currMonth = '',prevMonth='';
      var monthData = {};
      var planningData = [];
      for(var i=0;i<responseData.length;i++){
        var entry = responseData[i];
        currMonth  = entry.MONTH;

        if(currMonth!=prevMonth && currMonth!=''){
          if(monthData.month!=null){
            monthData.planningData = planningData;
            executionPlan.push(monthData);
          }

          monthData = {};
          planningData = [];
          monthData.month = currMonth;
          
        }

        var plan = {};
        plan.integration = entry.INTEGRATION;
        plan.status = entry.STATUS;
        plan.version = entry.VERSION;
        planningData.push(plan);
        prevMonth = currMonth;
      }

      if(monthData.month!=null){
        monthData.planningData = planningData;
        executionPlan.push(monthData);
      }
      
      resolve(executionPlan);
    }
    dbOperations.runQuery(sql,processData);
  });

  var automationPromise = new Promise(function(resolve, reject){
    //sql = `select to_char(MONTH1,'MON-YYYY') MONTH, sum(MIGRATION_COUNT) MIGRATION_COUNT,ENVIRONMENT_ID,MONTH1 from (select count(PRODUCT_ID) MIGRATION_COUNT,ENVIRONMENT_ID,trunc( MIGRATION_DATE,'MON') MONTH1 from MIGRATIONS group by trunc( MIGRATION_DATE,'MON'),ENVIRONMENT_ID) group by MONTH1,ENVIRONMENT_ID order by ENVIRONMENT_ID,MONTH1`;
    sql = `select trunc(PH.CREATED,'IW') as WEEEK,TP.TEST_TYPE, TP.TEST_PLANNED,TP.TEST_EXECUTED, TP.NO_RUN, TP.PASS, TP.FAIL, TP.DEFECTS from TEST_PLAN TP,PLAN_HEAD PH, EIT_SCOPE ES where TP.PLAN_ID = PH.ID and PH.EIT_SCOPE_ID = ES.ID and ES.NAME='EIT' and TP.TEST_TYPE='AUTOMATION' and PH.CREATED>=trunc(sysdate,'MM') order by PH.CREATED`;
    //process migration data
    function processData(responseData){
      console.log("automationData:"+JSON.stringify(responseData));
      
      
      resolve(responseData);
      
    }
    dbOperations.runQuery(sql,processData);
  });

  var manualPromise = new Promise(function(resolve, reject){
    //sql = `select to_char(MONTH1,'MON-YYYY') MONTH, sum(MIGRATION_COUNT) MIGRATION_COUNT,ENVIRONMENT_ID,MONTH1 from (select count(PRODUCT_ID) MIGRATION_COUNT,ENVIRONMENT_ID,trunc( MIGRATION_DATE,'MON') MONTH1 from MIGRATIONS group by trunc( MIGRATION_DATE,'MON'),ENVIRONMENT_ID) group by MONTH1,ENVIRONMENT_ID order by ENVIRONMENT_ID,MONTH1`;
    sql = `select trunc(PH.CREATED,'IW') as WEEEK,TP.TEST_TYPE, TP.TEST_PLANNED,TP.TEST_EXECUTED, TP.NO_RUN, TP.PASS, TP.FAIL, TP.DEFECTS from TEST_PLAN TP,PLAN_HEAD PH, EIT_SCOPE ES where TP.PLAN_ID = PH.ID and PH.EIT_SCOPE_ID = ES.ID and ES.NAME='EIT' and TP.TEST_TYPE='MANUAL' and PH.CREATED>=trunc(sysdate,'MM') order by PH.CREATED`;
    //process migration data
    function processData(responseData){
      console.log("plan dd:"+JSON.stringify(responseData));
      
      
      resolve(responseData);
      
    }
    dbOperations.runQuery(sql,processData);
  });

  var issuesPromise = new Promise(function(resolve, reject){
    //sql = `select to_char(MONTH1,'MON-YYYY') MONTH, sum(MIGRATION_COUNT) MIGRATION_COUNT,ENVIRONMENT_ID,MONTH1 from (select count(PRODUCT_ID) MIGRATION_COUNT,ENVIRONMENT_ID,trunc( MIGRATION_DATE,'MON') MONTH1 from MIGRATIONS group by trunc( MIGRATION_DATE,'MON'),ENVIRONMENT_ID) group by MONTH1,ENVIRONMENT_ID order by ENVIRONMENT_ID,MONTH1`;
    sql = `select CATEGORY,SEVERITY,ISSUE_DESCRIPTION,WORKAROUND from ISSUES`;
    //process migration data
    function processData(responseData){
      console.log("plan dd:"+JSON.stringify(responseData));
      
      
      resolve(responseData);
      
    }
    dbOperations.runQuery(sql,processData);
  });

  var bugProductPromise = new Promise(function(resolve, reject){
    //sql = `select to_char(MONTH1,'MON-YYYY') MONTH, sum(MIGRATION_COUNT) MIGRATION_COUNT,ENVIRONMENT_ID,MONTH1 from (select count(PRODUCT_ID) MIGRATION_COUNT,ENVIRONMENT_ID,trunc( MIGRATION_DATE,'MON') MONTH1 from MIGRATIONS group by trunc( MIGRATION_DATE,'MON'),ENVIRONMENT_ID) group by MONTH1,ENVIRONMENT_ID order by ENVIRONMENT_ID,MONTH1`;
    
    sql = `SELECT COUNT(BUGNO) as DEFECTS,P.ALIAS from selive_rpthead h,SELIVEPLUS.SELIVE_PRODUCT P
    where H.PRODUCT_ID=P.PRODUCT_ID and h.status in (11,26,36,39,15,82,94,86,60) and h.BUG_DATE >= '01-JULY-2017' and h.BUGNO in
        (SELECT distinct bugno from selive_rpthd_trcking_grps where tracking_group_id =2671 and tracking_group_value_id IN 
                (SELECT id FROM selive_tracking_group_values WHERE UPPER(name) LIKE UPPER('EIT (Enterprise Integration Defects)'))) group by P.ALIAS`;
    sql1 = `SELECT COUNT(BUGNO) as DEFECTS,PRODUCT_ID from selive_rpthead h
    where h.status in (11,26,36,39,15,82,94,86,60) and h.BUG_DATE >= '01-JULY-2017' and h.BUGNO in
        (SELECT distinct bugno from selive_rpthd_trcking_grps where tracking_group_id =2671 and tracking_group_value_id IN 
                (SELECT id FROM selive_tracking_group_values WHERE UPPER(name) LIKE UPPER('EIT (Enterprise Integration Defects)'))) group by PRODUCT_ID`;
    //process migration data
    function processData(responseData){
      console.log("plan dd:"+JSON.stringify(responseData));
      
      
      resolve(responseData);
    }
    dbOperations.runQuerySE(sql,processData);
  });
  
  var testMatrixPromise = new Promise(function(resolve, reject){
    //sql = `select to_char(MONTH1,'MON-YYYY') MONTH, sum(MIGRATION_COUNT) MIGRATION_COUNT,ENVIRONMENT_ID,MONTH1 from (select count(PRODUCT_ID) MIGRATION_COUNT,ENVIRONMENT_ID,trunc( MIGRATION_DATE,'MON') MONTH1 from MIGRATIONS group by trunc( MIGRATION_DATE,'MON'),ENVIRONMENT_ID) group by MONTH1,ENVIRONMENT_ID order by ENVIRONMENT_ID,MONTH1`;
    
    var sql  = `select T2.NAME as INTEGRATION, T3.NAME as ENVIRONMENT ,to_char(CREATED,'MON-YYYY') as MONTH,trunc(CREATED,'MM') as MONTH1,initCap(STATUS) as STATUS,VERSION from EXECUTION_PLANNING T1, INTEGRATION T2, ENVIRONMENTS T3 
                where T1.INTEGRATION_ID = T2.ID and T1.ENVIRONMENT_ID = T3.ID and ENVIRONMENT_ID = '3' and trunc(CREATED,'MM') in (trunc (add_months(sysdate,1),'MM'),trunc (sysdate,'MM'),trunc (add_months(sysdate,-1),'MM')) order by INTEGRATION,MONTH1`;
    //process migration data
    function processData(responseData){
      console.log("plan dd:"+JSON.stringify(responseData));
      var testMatrix=[];
      var currInt = '',prevInt='';
      var intData = {};
      var monthData = [];
      for(var i=0;i<responseData.length;i++){
        var entry = responseData[i];
        currInt  = entry.INTEGRATION;

        if(currInt!=prevInt && currInt!=''){
          if(intData.integration!=null){
            intData.monthData = monthData;
            testMatrix.push(intData);
          }

          intData = {};
          monthData = [];
          intData.integration = currInt;
          
        }

        var version = {};
        version.month = entry.MONTH;
        version.status = entry.STATUS;
        version.version = entry.VERSION;
        monthData.push(version);
        prevInt = currInt;
      }

      if(intData.integration!=null){
        intData.monthData = monthData;
        testMatrix.push(intData);
      }
      
      
      resolve(testMatrix);
    }
    dbOperations.runQuery(sql,processData);
  });

  var monthPromise = new Promise(function(resolve, reject){
    //sql = `select to_char(MONTH1,'MON-YYYY') MONTH, sum(MIGRATION_COUNT) MIGRATION_COUNT,ENVIRONMENT_ID,MONTH1 from (select count(PRODUCT_ID) MIGRATION_COUNT,ENVIRONMENT_ID,trunc( MIGRATION_DATE,'MON') MONTH1 from MIGRATIONS group by trunc( MIGRATION_DATE,'MON'),ENVIRONMENT_ID) group by MONTH1,ENVIRONMENT_ID order by ENVIRONMENT_ID,MONTH1`;
    
    var sql  = `select to_char(sysdate,'MON-YYYY') as MONTH from dual`;
    //process migration data
    function processData(responseData){
      resolve(responseData);
    }
    dbOperations.runQuery(sql,processData);
  });
   


  
  var renderCallback = function(data){
    res.render('eit_dashboard', { title: 'EIT Dashboard' ,data:data});
  } 

  

  Promise.all([monthPromise,notesPromise,manualTestPromise,executionPlanPromise,bugProductPromise,testMatrixPromise,automationPromise,manualPromise,issuesPromise])
    .then(function([monthData,notesData,manualTestData,executionPlanData,bugProductData,testMatrixData,automationData,manualData,issuesData]) {
            //respond to client
            console.log("respond to client now");
            var jsonResult = {};
            jsonResult.currentMonth = monthData[0].MONTH;
            jsonResult.notes = notesData;
            
            jsonResult.manualTestData = manualTestData;
            jsonResult.executionPlanData = executionPlanData;
            jsonResult.bugProductData = bugProductData;
            jsonResult.testMatrixData = testMatrixData;
            jsonResult.automationData = automationData;
            jsonResult.manualData = manualData;
            jsonResult.issuesData = issuesData;
            console.log("Notes:"+JSON.stringify(notesData));
            console.log("Plan:"+JSON.stringify(jsonResult.executionPlanData));
            console.log("bugProductPromise:"+JSON.stringify(bugProductData));
            console.log("testMatrixData:"+JSON.stringify(jsonResult.testMatrixData));
            console.log("month:"+JSON.stringify(monthData));
            console.log("automationData:"+JSON.stringify(jsonResult.automationData));
            console.log("render call back");
            renderCallback(jsonResult);

        })
        .catch(function(error) {
            //catch an error generated from either request
        })
  //request.get({ host:'bur00bir.us.oracle.com',family: 4, path: '/CIT_RESULTS_SERVER/cit/servers/tas/velocity', port: 8080,agent: false}, responsCallback).end();
  //request.get({ host:'bur00bir.us.oracle.com',family: 4, path: '/CIT_RESULTS_SERVER/cit/servers/dashboardData', port: 8080,agent: false}, responsCallback).end();
   
  
});

  

function getData(dates,id,resolve){
    
  var testPromise = new Promise(function(resolve, reject){
    
    sql = `select TEST_TYPE, TEST_PLANNED, TEST_EXECUTED, 
    NO_RUN, PASS, FAIL,DEFECTS from TEST_PLAN where PLAN_ID in('`+id+`')`;
    //process migration data
    function processData(responseData){
      console.log("res:"+JSON.stringify(responseData));
      
      resolve(responseData);
    }
    dbOperations.runQuery(sql,processData);
  });

  var productPromise = new Promise(function(resolve, reject){
    //sql = `select to_char(MONTH1,'MON-YYYY') MONTH, sum(MIGRATION_COUNT) MIGRATION_COUNT,ENVIRONMENT_ID,MONTH1 from (select count(PRODUCT_ID) MIGRATION_COUNT,ENVIRONMENT_ID,trunc( MIGRATION_DATE,'MON') MONTH1 from MIGRATIONS group by trunc( MIGRATION_DATE,'MON'),ENVIRONMENT_ID) group by MONTH1,ENVIRONMENT_ID order by ENVIRONMENT_ID,MONTH1`;
    sql = `select PRODUCT, VERSION,STATUS from PRODUCT_PLAN  where PLAN_ID = '`+id+`'`;
    //process migration data
    function processData(responseData){
      console.log("res:"+JSON.stringify(responseData));
      
      resolve(responseData);
    }
    dbOperations.runQuery(sql,processData);
  });

  var categoryPromise = new Promise(function(resolve, reject){
    //sql = `select to_char(MONTH1,'MON-YYYY') MONTH, sum(MIGRATION_COUNT) MIGRATION_COUNT,ENVIRONMENT_ID,MONTH1 from (select count(PRODUCT_ID) MIGRATION_COUNT,ENVIRONMENT_ID,trunc( MIGRATION_DATE,'MON') MONTH1 from MIGRATIONS group by trunc( MIGRATION_DATE,'MON'),ENVIRONMENT_ID) group by MONTH1,ENVIRONMENT_ID order by ENVIRONMENT_ID,MONTH1`;
    sql = `select CATEGORY, METHOD, STATUS from TEST_CATEGORY_PLAN  where PLAN_ID ='`+id+`'`;
    //process migration data
    function processData(responseData){
      console.log("res:"+JSON.stringify(responseData));
      
      resolve(responseData);
    }
    dbOperations.runQuery(sql,processData);
  });

  Promise.all([testPromise,productPromise,categoryPromise])
  .then(function([testData,productData,categoryData]) {
          //respond to client
          console.log("respond to client now");
          var jsonResult = {};
          jsonResult.dates = dates;
          jsonResult.testData = testData;
          jsonResult.productData = productData;
          jsonResult.categoryData = categoryData;
          
          console.log("testData:"+JSON.stringify(jsonResult.testData));
          console.log("productData:"+JSON.stringify(jsonResult.productData));
          console.log("categoryData:"+JSON.stringify(jsonResult.categoryData));
          console.log("render call back");
          resolve(jsonResult);

      })
      .catch(function(error) {
          //catch an error generated from either request
      })

  

}

function getplDashboardData(req,res,next){

    var datesPromise = new Promise(function(resolve, reject){
      sql = '';
      var date = req.body.date;
      var scope = req.body.scope;
      console.log("OBODY:"+JSON.stringify(req.body));
      if(date==null){
        console.log('get request');
        sql = `select ID,to_char (trunc(CREATED,'IW'),'DD-MON-YYYY') WEEK from PLAN_HEAD where EIT_SCOPE_ID in 
          (select ID from EIT_SCOPE where NAME='`+scope+`') order by CREATED DESC`;
      }else{
        sql = `select ID,to_char (trunc(CREATED,'IW'),'DD-MON-YYYY') WEEK from PLAN_HEAD where EIT_SCOPE_ID in 
          (select ID from EIT_SCOPE where NAME='`+scope+`') and trunc(CREATED,'IW') = to_date('`+date+`','DD-MON-YYYY') order by CREATED DESC`;
          console.log("SQL:"+sql);
      }
      //sql = `select to_char(MONTH1,'MON-YYYY') MONTH, sum(MIGRATION_COUNT) MIGRATION_COUNT,ENVIRONMENT_ID,MONTH1 from (select count(PRODUCT_ID) MIGRATION_COUNT,ENVIRONMENT_ID,trunc( MIGRATION_DATE,'MON') MONTH1 from MIGRATIONS group by trunc( MIGRATION_DATE,'MON'),ENVIRONMENT_ID) group by MONTH1,ENVIRONMENT_ID order by ENVIRONMENT_ID,MONTH1`;
      
      //process migration data
      function processData(responseData){
        console.log("res:"+JSON.stringify(responseData));
        if(responseData.length>0){
          var date  = responseData[0].WEEK;
          var id = responseData[0].ID;
          getData(responseData,id,resolve);
        }else{
          resolve(responseData);
        }


        
      }
      dbOperations.runQuery(sql,processData);
    });

    
    

    
    var issuesPromise = new Promise(function(resolve, reject){
      //sql = `select to_char(MONTH1,'MON-YYYY') MONTH, sum(MIGRATION_COUNT) MIGRATION_COUNT,ENVIRONMENT_ID,MONTH1 from (select count(PRODUCT_ID) MIGRATION_COUNT,ENVIRONMENT_ID,trunc( MIGRATION_DATE,'MON') MONTH1 from MIGRATIONS group by trunc( MIGRATION_DATE,'MON'),ENVIRONMENT_ID) group by MONTH1,ENVIRONMENT_ID order by ENVIRONMENT_ID,MONTH1`;
      sql = `select CATEGORY,SEVERITY,ISSUE_DESCRIPTION,WORKAROUND from ISSUES`;
      //process migration data
      function processData(responseData){
        console.log("plan dd:"+JSON.stringify(responseData));
        
        
        resolve(responseData);
        
      }
      dbOperations.runQuery(sql,processData);
    });

    var bugProductPromise = new Promise(function(resolve, reject){
      //sql = `select to_char(MONTH1,'MON-YYYY') MONTH, sum(MIGRATION_COUNT) MIGRATION_COUNT,ENVIRONMENT_ID,MONTH1 from (select count(PRODUCT_ID) MIGRATION_COUNT,ENVIRONMENT_ID,trunc( MIGRATION_DATE,'MON') MONTH1 from MIGRATIONS group by trunc( MIGRATION_DATE,'MON'),ENVIRONMENT_ID) group by MONTH1,ENVIRONMENT_ID order by ENVIRONMENT_ID,MONTH1`;
      
      sql = `SELECT COUNT(BUGNO) as DEFECTS,P.ALIAS from selive_rpthead h,SELIVEPLUS.SELIVE_PRODUCT P
      where H.PRODUCT_ID=P.PRODUCT_ID and h.status in (11,26,36,39,15,82,94,86,60) and h.BUG_DATE >= '01-JULY-2017' and h.BUGNO in
          (SELECT distinct bugno from selive_rpthd_trcking_grps where tracking_group_id =2671 and tracking_group_value_id IN 
                  (SELECT id FROM selive_tracking_group_values WHERE UPPER(name) LIKE UPPER('EIT (Enterprise Integration Defects)'))) group by P.ALIAS`;
      sql1 = `SELECT COUNT(BUGNO) as DEFECTS,PRODUCT_ID from selive_rpthead h
      where h.status in (11,26,36,39,15,82,94,86,60) and h.BUG_DATE >= '01-JULY-2017' and h.BUGNO in
          (SELECT distinct bugno from selive_rpthd_trcking_grps where tracking_group_id =2671 and tracking_group_value_id IN 
                  (SELECT id FROM selive_tracking_group_values WHERE UPPER(name) LIKE UPPER('EIT (Enterprise Integration Defects)'))) group by PRODUCT_ID`;
      //process migration data
      function processData(responseData){
        console.log("plan dd:"+JSON.stringify(responseData));
        
        
        resolve(responseData);
      }
      dbOperations.runQuerySE(sql,processData);
    });
    
      
    var renderCallback = function(data){
      res.render('production_live', { title: 'PL Dashboard' ,data:data});
    } 

    

    Promise.all([datesPromise,bugProductPromise,issuesPromise])
      .then(function([datesData,bugData,issuesData]) {
              //respond to client
              console.log("respond to client now");
              var jsonResult = {};
              jsonResult.dates = datesData.dates;
              jsonResult.testData = datesData.testData;
              jsonResult.productData = datesData.productData;
              jsonResult.categoryData = datesData.categoryData;
              jsonResult.bugData = bugData;
              jsonResult.issuesData = issuesData;
              console.log("datesData:"+JSON.stringify(jsonResult.datesData));
              console.log("bugData:"+JSON.stringify(jsonResult.bugData));
              console.log("issuesData:"+JSON.stringify(jsonResult.issuesData));
              console.log("render call back");
              renderCallback(jsonResult);

          })
          .catch(function(error) {
              //catch an error generated from either request
          })
    //request.get({ host:'bur00bir.us.oracle.com',family: 4, path: '/CIT_RESULTS_SERVER/cit/servers/tas/velocity', port: 8080,agent: false}, responsCallback).end();
    //request.get({ host:'bur00bir.us.oracle.com',family: 4, path: '/CIT_RESULTS_SERVER/cit/servers/dashboardData', port: 8080,agent: false}, responsCallback).end();
    
}
router.get('/dashboard/prod_live', function(req, res, next) {

    req.body.scope = 'PRODUCTION_LIVE';
    getplDashboardData(req,res,next); 
  
});

router.post('/dashboard/prod_live', function(req, res, next) {
  req.body.scope = 'PRODUCTION_LIVE';
  getplDashboardData(req,res,next); 

});


  

router.get('/box', function(req, res, next) {
    console.log('inside get for echarts');
    var date='';
    var pass='';
    var fail='';
    var total='';
    var fre=req.body.lov;
    //console.log(lov);
    var dateObj = new Date();
    var month = dateObj.getUTCMonth() + 1; //months from 1-12
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();
    var newdate = day + "-" + month + "-" + year;
    var url='/CIT_RESULTS_SERVER/cit/servers/pp/first/'+newdate;
    var renderCallback = function(pass,fail,total,date,boxes,response){
    //var month=["JAN","FEB","MAR","APR","MAY","JUN","JULY","AUG","SEPT","OCT","NOV","DEC"];
    //var g1=date.split("-");
    //date=g1[0]+' '+month[g1[1]];
    console.log(pass);
    console.log(fail);
    console.log(total);
    console.log(date);
    var da=newdate.split("-");
    newdate=da[1]+'/'+da[0]+'/'+da[2];
    //var boxes=['DESKTOP3','DESKTOP5','Auto_Prod_2','msp52458','Desktop1_New','EIT_Auto_Desktop_NEW','Desktop-7'];
    //res.render('box', { title: 'box' ,pass:pass,fail:fail,total:total,date:date,dat:newdate,selectedBox:boxes[0],boxes: boxes,response:response});
    res.render('box', { title: 'box' ,dat:newdate,selectedBox:boxes[0],boxes: boxes,response:response});
    } 

  var responsCallback = function(res) { 
    console.log('inside');
    console.log(fre);
    var b='';
     
    res.on('data', function(chunk){
      b+=chunk;
      //console.log(chunk);
      });

      res.on('end', function() {
        //console.log(b);
        //var date= b.substring(0,15);
        //console.log(date);
        //result = b.substring(15, b.length);
        console.log(b);
        jsonResult= JSON.parse(b);
        var response = b.substring(0, b.length);
        var i=0;
        //console.log(jsonResult.DESKTOP5);
        console.log(jsonResult);
        console.log(Object.keys(jsonResult));
        var keys=Object.keys(jsonResult);
        console.log(jsonResult);
        var weeklyData = jsonResult.weeklyData;
        for (var month in weeklyData){
            if (weeklyData.hasOwnProperty(month)) {
              var val = weeklyData[month];
              date+="'"+month+"',";
              pass+=val.pass+",";
              fail+=val.fail+",";
              total+=val.total+",";
              //pass_per+=val.pass_percentage+",";
              //fail_per+=val.fail_percentage+",";
              console.log(val);
            }
          }
        
        //dailyLabels= "["+dailyLabels.substring(0,dailyLabels.length-1)+"]";
        //dailySeries="[["+dailySeries.substring(0,dailySeries.length-1)+"]]";
        date= date.substring(0,date.length-1);
        pass=pass.substring(0,pass.length-1);
        fail=fail.substring(0,fail.length-1);
        total=total.substring(0,total.length-1);
        //executed=executed.substring(0,executed.length-1);
        //pass_per=pass_per.substring(0,pass_per.length-1);
        //fail_per=fail_per.substring(0,fail_per.length-1);
       // newly_added=newly_added.substring(0,newly_added.length-1);
        //console.log(month_name);
        //console.log(actual);
        //console.log(fail);
        console.log("about to render");
        console.log(date);
        console.log("DD:"+jsonResult.weeklyData);
        renderCallback(pass,fail,total,date, jsonResult.serverList,response);

      });
  };

  request.get({ host: 'bur00bir.us.oracle.com',family: 4, path: url, port: 8080,agent: false}, responsCallback).end();
  
   
  

});

//var boxes=['DESKTOP3','DESKTOP5','Auto_Prod_2','msp52458','Desktop1_New','EIT_Auto_Desktop_NEW','Desktop-7'];
router.post('/box', function(req, res, next) {
  console.log('inside get for echarts');
  var date='';
  var pass='';
  var fail='';
  var total='';
  var fre=req.body.lov;
  var dat=req.body.datetext;
  var g1=dat.split("/");
  g=g1[1]+'-'+g1[0]+'-'+g1[2];
  dat=g1[0]+'/'+g1[1]+'/'+g1[2];
  console.log(dat);
  console.log(fre);
  var url='/CIT_RESULTS_SERVER/cit/servers/pp/'
  url=url+fre+'/'+g;
  console.log(url);
  var renderCallback = function(pass,fail,total,date,boxes,response){
    //var month=["JAN","FEB","MAR","APR","MAY","JUN","JULY","AUG","SEPT","OCT","NOV","DEC"];
    //var g1=date.split("-");
    //date=g1[0]+' '+month[g1[1]];
    console.log(pass);
    console.log(fail);
    console.log(total);
    console.log(date);
    
    //res.render('box', { title: 'box' ,pass:pass,fail:fail,total:total,date:date,dat:dat,selectedBox:fre,boxes:boxes,response:response});
    res.render('box', { title: 'box' ,dat:dat,selectedBox:fre,boxes:boxes,response:response});
  } 

  var responsCallback = function(res) { 
    console.log('inside');
    console.log(fre);
    var b='';
     
    res.on('data', function(chunk){
      b+=chunk;
      //console.log(chunk);
      });

      res.on('end', function() {
        //console.log(b);
        //var date= b.substring(0,15);
        //console.log(date);
        //result = b.substring(15, b.length);
        console.log(b);
        jsonResult= JSON.parse(b);
        var response = b.substring(0, b.length);
        jsonResult= JSON.parse(b);
        var i=0;
        //console.log(jsonResult.fre);
        console.log(jsonResult);
        console.log(Object.keys(jsonResult));
        var keys=Object.keys(jsonResult);
        console.log(jsonResult);
       
        var weeklyData = jsonResult.weeklyData;
        for (var month in weeklyData){
          if (weeklyData.hasOwnProperty(month)) {
              var val = weeklyData[month];
              date+="'"+month+"',";
              pass+=val.pass+",";
              fail+=val.fail+",";
              total+=val.total+",";
              //pass_per+=val.pass_percentage+",";
              //fail_per+=val.fail_percentage+",";
              console.log(val);
          }
        }
        
        //dailyLabels= "["+dailyLabels.substring(0,dailyLabels.length-1)+"]";
        //dailySeries="[["+dailySeries.substring(0,dailySeries.length-1)+"]]";
        date= date.substring(0,date.length-1);
        pass=pass.substring(0,pass.length-1);
        fail=fail.substring(0,fail.length-1);
        total=total.substring(0,total.length-1);
        //executed=executed.substring(0,executed.length-1);
        //pass_per=pass_per.substring(0,pass_per.length-1);
        //fail_per=fail_per.substring(0,fail_per.length-1);
       // newly_added=newly_added.substring(0,newly_added.length-1);
        //console.log(month_name);
        //console.log(actual);
        //console.log(fail);
        console.log("about to render");
        console.log(date);
        renderCallback(pass,fail,total,date,jsonResult.serverList,response);

      });
  };

  request.get({ host: 'bur00bir.us.oracle.com',family: 4, path:url, port: 8080,agent: false}, responsCallback).end();
  
   
  
});

router.get('/box-trend',async function(req, res, next) {
  var dateObj = new Date();
  var month = dateObj.getUTCMonth() + 1; //months from 1-12
  var day = dateObj.getUTCDate();
  var year = dateObj.getUTCFullYear();
  var date = day + "-" + month + "-" + year;
  console.log("Date:"+date);
  var data = await reports.boxTrend(date);
  data.date = date.split('-').join('/');
  var response = {"success":"true","data":data};
  //res.send(JSON.stringify(response,null,4) );
  
  res.render('box-trend', { title: 'Box Trend' ,response:response});

});

router.post('/box-trend',async function(req, res, next) {
  
  var date = req.body.date;
  date=date.split('/').join('-');
  var host = req.body.lovHost;
  var env = req.body.lovEnv;
  console.log("Date:"+JSON.stringify(req.body));
  console.log("Date:"+date);
  console.log("host:"+host);
  console.log("env:"+env);
  var data = await reports.boxTrend(date,host,env);
  data.date = date.split('-').join('/');
  var response = {"success":"true","data":data};
  //res.send(JSON.stringify(response,null,4) );
  
  res.render('box-trend', { title: 'Box Trend' ,response:response});

});

/* GET script listing. */


router.get('/scriptlist', async function(req, res, next) {
  //res.send('respond with a resource');
  try{
    let con = await dbOperations1.getConnection();
    sql = `SELECT distinct FUNCTIONALITY, MANUAL_TC_NAME  from AUTOMATION_RUN_SCRIPT_RESULT order by FUNCTIONALITY`;
    const scriptList = await dbOperations1.runQuery(con,sql,{});
    console.log("Script:"+JSON.stringify(scriptList.rows) );
  
    res.render('scriptlist', { title: 'Testcases',response:scriptList.rows});    
  }catch{

  }
  

  
  
});

router.post('/notes',function(req,res,next){
  function responseCallback(response){
    console.log('response:'+response.rowsAffected);
    if(response.rowsAffected>0){
      res.send(JSON.stringify({'success':'true'}) );
    }else{
      res.send(JSON.stringify({'success':'false'}) );
    }
  }
  var name = req.body.name;
    var content = req.body.content;
    //var content = "<li>sample note</li>";
    var binds = {content: content, name: name};
    var sql=`update NOTE set content = :content where name = :name`;
    //process migration data
    console.log('sql:'+sql);
    dbOperations.runInsert(sql,binds,responseCallback);

});

router.get('/avgexe', function(req, res, next) {
  console.log('inside get for echarts');
  var servername='';
  var pass='';
  var fail='';
  var total='';
  var pass_per='';
  var fail_per='';
  var avg_it='';
  var duration='';
  var dateObj = new Date();
  var month = dateObj.getUTCMonth() + 1; //months from 1-12
  var day = dateObj.getUTCDate();
  var year = dateObj.getUTCFullYear();
  var newdate = day + "-" + month + "-" + year;
  var date=month + "/" + day + "/" + year;
  var url='/CIT_RESULTS_SERVER/cit/servers/ta/avg/'+newdate;
  console.log(req);
  var renderCallback = function(servername,pass,fail,total,avg_it,duration){
    //console.log(month_name);
    var totalSum = total.split(",").reduce(add, 0);
    var passSum = pass.split(",").reduce(add, 0);
    function add(a, b) {
        return parseInt(a) + parseInt(b);
    }
    console.log(servername);
    console.log("Total"+totalSum);
    var perc=Math.round((passSum/totalSum)*100);
    console.log("percentage"+perc);
    res.render('avgexe', { title: 'Average Execution' , servername: servername, pass: pass, fail: fail, total: total,avg_it: avg_it,duration:duration,date:date});
  } 

  var responsCallback = function(res) { 
    console.log('inside');
    var b='';
     
    res.on('data', function(chunk){
      b+=chunk;
      //console.log(chunk);
      });

      res.on('end', function() {
        //console.log(b);
        //var date= b.substring(0,15);
        //console.log(date);
        result = b.substring(34,b.length);
        console.log(b);

        jsonResult= JSON.parse(result);
        var i=0;
        var sum=0;
        var count=0;
        for (var server in jsonResult) {
            if (jsonResult.hasOwnProperty(server)) {
              var val = jsonResult[server];
              servername+= "'"+val.servername+"',";
              pass+=val.pass+",";
              fail+=val.fail+",";
              avg_it+=val.iterations+",";
              total+=val.total+",";
              duration+=val.duration+",";
              //pass_per+=val.pass_percentage+",";
              //fail_per+=val.fail_percentage+",";
              console.log(val);
            }
          }
          
        //dailyLabels= "["+dailyLabels.substring(0,dailyLabels.length-1)+"]";
        //dailySeries="[["+dailySeries.substring(0,dailySeries.length-1)+"]]";
        console.log(servername);
        servername=servername.substring(0,servername.length-1);
        console.log(servername);
        pass=pass.substring(0,pass.length-1);
        fail=fail.substring(0,fail.length-1);
        total=total.substring(0,total.length-1);

        //pass_per=pass_per.substring(0,pass_per.length-1);
        //fail_per=fail_per.substring(0,fail_per.length-1);
        avg_it=avg_it.substring(0,avg_it.length-1);
        duration=duration.substring(0,duration.length-1);
       
        console.log(pass);
        console.log(fail);
        console.log(total);
       
        console.log(avg_it);
        console.log("about to render");
        renderCallback(servername,pass,fail,total,avg_it,duration);

      });
  };
  request.get({ host:'bur00bir.us.oracle.com',family: 4, path:url, port: 8080,agent: false}, responsCallback).end();
});
router.post('/avgexe', function(req, res, next) {
  var date='';
  var g='';
  var url='/CIT_RESULTS_SERVER/cit/servers/ta/avg/'
  date=req.body.datetext;
  var g1=date.split("/");
  g=g1[1]+'-'+g1[0]+'-'+g1[2];
  date=g1[0]+'/'+g1[1]+'/'+g1[2];
  url=url+g;
  var servername='';
  var pass='';
  var fail='';
  var total='';
  var pass_per='';
  var fail_per='';
  var avg_it='';
  var duration='';
  console.log(req);
  var renderCallback = function(servername,pass,fail,total,avg_it,duration){
    //console.log(month_name);
    var totalSum = total.split(",").reduce(add, 0);
    var passSum = pass.split(",").reduce(add, 0);
    function add(a, b) {
        return parseInt(a) + parseInt(b);
    }
    console.log(servername);
    console.log("Total"+totalSum);
    var perc=Math.round((passSum/totalSum)*100);
    console.log("percentage"+perc);
    res.render('avgexe', { title: 'Average Execution' , servername: servername, pass: pass, fail: fail, total: total,avg_it: avg_it,duration:duration,date:date});
  } 

  var responsCallback = function(res) { 
    console.log('inside');
    var b='';
     
    res.on('data', function(chunk){
      b+=chunk;
      //console.log(chunk);
      });

      res.on('end', function() {
        //console.log(b);
        //var date= b.substring(0,15);
        //console.log(date);
        result = b.substring(34,b.length);
        console.log(b);

        jsonResult= JSON.parse(result);
        var i=0;
        var sum=0;
        var count=0;
        for (var server in jsonResult) {
            if (jsonResult.hasOwnProperty(server)) {
              var val = jsonResult[server];
              servername+= "'"+val.servername+"',";
              pass+=val.pass+",";
              fail+=val.fail+",";
              avg_it+=val.iterations+",";
              total+=val.total+",";
              duration+=val.duration+",";
              //pass_per+=val.pass_percentage+",";
              //fail_per+=val.fail_percentage+",";
              console.log(val);
            }
          }
          
        //dailyLabels= "["+dailyLabels.substring(0,dailyLabels.length-1)+"]";
        //dailySeries="[["+dailySeries.substring(0,dailySeries.length-1)+"]]";
        console.log(servername);
        servername=servername.substring(0,servername.length-1);
        console.log(servername);
        pass=pass.substring(0,pass.length-1);
        fail=fail.substring(0,fail.length-1);
        total=total.substring(0,total.length-1);

        //pass_per=pass_per.substring(0,pass_per.length-1);
        //fail_per=fail_per.substring(0,fail_per.length-1);
        avg_it=avg_it.substring(0,avg_it.length-1);
        duration=duration.substring(0,duration.length-1);
       
        console.log(pass);
        console.log(fail);
        console.log(total);
       
        console.log(avg_it);
        console.log("about to render");
        renderCallback(servername,pass,fail,total,avg_it,duration);

      });
  };
  request.get({ host:'bur00bir.us.oracle.com',family: 4, path: url, port: 8080,agent: false}, responsCallback).end();
});

router.post('/migrations',function(req,res,next){
  function responseCallback(response){
    console.log('response:'+response.rowsAffected);
    if(response.rowsAffected>0){
      res.send(JSON.stringify({'success':'true'}) );
    }else{
      res.send(JSON.stringify({'success':'false'}) );
    }
  }
  
  var env = req.body.environment;
  var prod = req.body.product;
  var version = req.body.version;
  var date = req.body.mDate;
  var comments = req.body.comments;

    /*
    var env = '1';
    var prod = '1';
    var version = 'ver';
    var date = '2019-02-05';
    var comments = 'ccc';
    */
    var binds = {env: env, prod: prod,mdate:date,ver:version,comm:comments};
    //var sql=`update NOTE set content = :content where name = :name`;
    var sql=`insert into migrations(PRODUCT_ID, ENVIRONMENT_ID, MIGRATION_DATE, VERSION, DESCRIPTION) VALUES(:prod,:env,to_date(:mdate,'YYYY-MM-DD') ,:ver,:comm)`;
    //process migration data
    console.log('sql:'+sql);
    dbOperations.runInsert(sql,binds,responseCallback);

});


