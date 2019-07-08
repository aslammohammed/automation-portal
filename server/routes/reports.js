//var express = require('express');
var dbOperations1 = require('./dboperations1');
//var router = express.Router();

//module.exports = router;


var reports = {
  executionTrend : async function(date){
    var data ={}
    var dailySql = `select T1.AUTOMATION_HOST,T2.HOST_NAME,T1.ENVIRONMENT,T1.TOTAL_PASSED,T1.TOTAL_FAILED,T1.TOTAL_SCRIPTS,T1.FEATURE from(
      select AUTOMATION_HOST,ENVIRONMENT,TOTAL_PASSED as TOTAL_PASSED , TOTAL_FAILED as TOTAL_FAILED, TOTAL_SCRIPTS as TOTAL_SCRIPTS,FEATURE from AUTOMATION_RUN_HEAD where trunc(RUN_STARTED) = to_date('`+date+`','DD-MM-YYYY') and STATUS ='Completed') T1 
          left join AUTOMATION_HOST_SERVER_MAP T2 on T1.AUTOMATION_HOST = T2.SERVER`;
    console.log("qyr:"+dailySql);
    var weeklySql = `select T1.AUTOMATION_HOST,T2.HOST_NAME,T1.ENVIRONMENT,T1.TOTAL_PASSED,T1.TOTAL_FAILED,T1.TOTAL_SCRIPTS,T1.FEATURE from(
      select AUTOMATION_HOST,ENVIRONMENT,SUM(TOTAL_PASSED) as TOTAL_PASSED , SUM(TOTAL_FAILED) as TOTAL_FAILED, SUM(TOTAL_SCRIPTS) as TOTAL_SCRIPTS,FEATURE from AUTOMATION_RUN_HEAD where RUN_STARTED>= trunc(to_date('`+date+`','DD-MM-YYYY'),'IW') and STATUS ='Completed' group by AUTOMATION_HOST,ENVIRONMENT,FEATURE) T1 
          left join AUTOMATION_HOST_SERVER_MAP T2 on T1.AUTOMATION_HOST = T2.SERVER`;
    var monthlySql = `select T1.AUTOMATION_HOST,T2.HOST_NAME,T1.ENVIRONMENT,T1.TOTAL_PASSED,T1.TOTAL_FAILED,T1.TOTAL_SCRIPTS,T1.FEATURE from(
            select AUTOMATION_HOST,ENVIRONMENT,SUM(TOTAL_PASSED) as TOTAL_PASSED , SUM(TOTAL_FAILED) as TOTAL_FAILED, SUM(TOTAL_SCRIPTS) as TOTAL_SCRIPTS,FEATURE from AUTOMATION_RUN_HEAD where RUN_STARTED>= trunc(to_date('`+date+`','DD-MM-YYYY'),'MM') and STATUS ='Completed' group by AUTOMATION_HOST,ENVIRONMENT,FEATURE) T1 
                left join AUTOMATION_HOST_SERVER_MAP T2 on T1.AUTOMATION_HOST = T2.SERVER`;
    let con = await dbOperations1.getConnection();

    var dayResults = await dbOperations1.runQuery(con, dailySql,{});
    data.dayData = dayResults.rows;
    var weekResults = await dbOperations1.runQuery(con, weeklySql,{});
    data.weekData = weekResults.rows;
    var monthResults = await dbOperations1.runQuery(con, monthlySql,{});
    data.monthData = monthResults.rows;
    console.log("Report Trend:"+JSON.stringify(data) );
    await dbOperations1.closeConnection(con);
      
    return data;
  },
  hostList : async function(){
    var data ={}
    var boxSql = `select distinct AUTOMATION_HOST from AUTOMATION_RUN_HEAD`;
    console.log("qyr:"+boxSql);
    
    let con = await dbOperations1.getConnection();

    var boxResults = await dbOperations1.runQuery(con, dailySql,{});
    data.boxes = boxResults.rows;
    
    console.log("Report box Trend:"+JSON.stringify(data) );
    await dbOperations1.closeConnection(con);
      
    return data;
  },
  envForHostList : async function(host){
    var data ={}
    var sql = `select distinct ENVIRONMENT from AUTOMATION_RUN_HEAD where automation_host ='`+host+`' `;
    console.log("qyr:"+sql);
    
    let con = await dbOperations1.getConnection();

    var results = await dbOperations1.runQuery(con, sql,{});
    data.boxes = results.rows;
    
    console.log("Report box Trend:"+JSON.stringify(data) );
    await dbOperations1.closeConnection(con);
      
    return data;
  },
  boxTrend : async function(date,host,env){
    console.log("host:"+host);
    console.log("env:"+env);
    var data ={};
    let con = await dbOperations1.getConnection();

    var hostsSql = `select distinct AUTOMATION_HOST from AUTOMATION_RUN_HEAD where AUTOMATION_HOST is not null`;
    var results = await dbOperations1.runQuery(con, hostsSql,{});
    data.hosts = results.rows;

    if(host == undefined){
      host = data.hosts[0].AUTOMATION_HOST;
    }
    data.selectedHost = host;

    var envSql = `select distinct ENVIRONMENT from AUTOMATION_RUN_HEAD where automation_host ='`+host+`' `;
    console.log("envSql:"+envSql);
    var envs = await dbOperations1.runQuery(con, envSql,{});
    data.envs = envs.rows;
    if(env == undefined){
      env = data.envs[0].ENVIRONMENT;
    }
    data.selectedEnv = env;
    
    var dailySql = `SELECT * FROM ( 
      SELECT trunc(RUN_STARTED) as day1,to_char(RUN_STARTED,'DD-MON-YYYY') day, TOTAL_PASSED as pass,TOTAL_FAILED as fail, TOTAL_SCRIPTS as total 
      FROM AUTOMATION_RUN_HEAD where trunc(RUN_STARTED) <= to_date('`+date+`','DD-MM-YYYY') and automation_host='`+host+`' and ENVIRONMENT = '`+env+`' ORDER BY day1 desc)  WHERE rownum <= 7 ORDER BY rownum`;
    console.log("qyr:"+dailySql);
    var weeklySql = `SELECT * FROM (SELECT trunc(RUN_STARTED,'IW') as week1,to_char(trunc(RUN_STARTED,'IW'),'DD-MON-YYYY') as week, sum(TOTAL_PASSED) as pass,sum(TOTAL_FAILED) as fail, sum(TOTAL_SCRIPTS) as total 
    FROM AUTOMATION_RUN_HEAD where trunc(RUN_STARTED) <= to_date('`+date+`','DD-MM-YYYY') and automation_host='`+host+`' and ENVIRONMENT = '`+env+`'
    GROUP BY trunc(RUN_STARTED,'IW'),to_char(trunc(RUN_STARTED,'IW'),'DD-MON-YYYY') ORDER BY week1 desc) WHERE rownum <= 7 ORDER BY rownum`;
    
    var dayResults = await dbOperations1.runQuery(con, dailySql,{});
    data.dailyData = dayResults.rows;
    var weekResults = await dbOperations1.runQuery(con, weeklySql,{});
    data.weeklyData = weekResults.rows;
    console.log("Report box Trend:"+JSON.stringify(data) );
    await dbOperations1.closeConnection(con);
      
    return data;
  } 
};

module.exports = reports;



