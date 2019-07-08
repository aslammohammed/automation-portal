var express = require('express');
var request = require('http');

var router = express.Router();

function getData(req,res,date){
  var from_date=date;
  var newdate=date;
  console.log('inside get for echarts');
    var month_name='';
    var pass='';
    var fail='';
    var total='';
    var pass_per='';
    var fail_per='';
    var avg_it='';

    //hist
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
    //console.log(req);
    var renderCallback = function(month_name,pass,fail,total,currentMonthTotal,prevMonthTotal,avg_it,count,env,servers1,pass1,fail1,total1,servers2,pass2,fail2,total2,servers3,pass3,fail3,total3,from_date){
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

      //hist
      var totalSum = total1.split(",").reduce(add, 0);
      var passSum = pass1.split(",").reduce(add, 0);
      var totalSum1 = total2.split(",").reduce(add, 0);
      var passSum1 = pass2.split(",").reduce(add, 0);
      var totalSum2 = total3.split(",").reduce(add, 0);
      var passSum2 = pass3.split(",").reduce(add, 0);
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
      //month_name: month_name, pass: pass, fail: fail, total: total,prev_total:prevMonthTotal, percentage: perc,pass_per: pass_per,fail_per: fail_per,avg_it: avg_it,sum:currentMonthTotal,
      res.render('environment', { title: 'Environment' ,total: prevMonthTotal, count:count,env:env,
      daily_servers: servers1,daily_pass: pass1,daily_fail: fail1,daily_total: total1, percentage: perc,dailyPass:passSum,dailyFail:(totalSum-passSum)
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
          //console.log(b);
          //var date= b.substring(0,15);
          //console.log(date);
          //result = b.substring(15, b.length);
          result = b.substring(0, b.length);
          console.log(result);
          jsonResult= JSON.parse(result);
            
          //renderCallback(jsonResult);
          
          //console.log(b);
          jsonResult= JSON.parse(b);
          jsonResult=jsonResult['data'];
          var count=jsonResult['serverCount'];
          var env=jsonResult['environment'];
          var prevMonthTotal ='';
            var currentMonthTotal = '';
            var i=0;
          var sum=0;
          
          var velocity = '';

          if(jsonResult['velocity']!=null){
            var prevMonthTotal = jsonResult['velocity'][2]['total_scripts'];
            var currentMonthTotal = jsonResult['velocity'][1]['total_scripts'];
            var i=0;
            var sum=0;
          
            var velocity = jsonResult['velocity'];
            /*
            for (var month in velocity) {
                if (velocity.hasOwnProperty(month)) {
                  var val = velocity[month];
                  month_name+= "'"+val.month+"',";
                  pass+=val.total_pass+",";
                  fail+=val.total_fail+",";
                  avg_it+=val.avg_iteration+",";
                  total+=val.aggregate_runs+",";
                  if(i==0)
                  {
                    sum=val.total_scripts;
                    //count=val.serverCount;
                    //env=val.Environment;
                  }
                  i++;
                  //pass_per+=val.pass_percentage+",";
                  //fail_per+=val.fail_percentage+",";
                  console.log(val);
                }
              }
              */
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
            }

          jsonResult=jsonResult['history'];
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
        //var from_date=jsonResult.From_Date;
          renderCallback(month_name,pass,fail,total,currentMonthTotal,prevMonthTotal,avg_it,count,env,
            daily_servers,daily_pass,daily_fail,daily_total,weekly_servers,weekly_pass,weekly_fail,weekly_total,monthly_servers,monthly_pass,monthly_fail,monthly_total,from_date);
          
  
        });
    };
  
    //request.get({ host:'bur00bir.us.oracle.com',family: 4, path: '/CIT_RESULTS_SERVER/cit/servers/tas/velocity', port: 8080,agent: false}, responsCallback).end();
    request.get({ host:'bur00bir.us.oracle.com',family: 4, path: '/CIT_RESULTS_SERVER/cit/servers/environmentData/'+date, port: 8080,agent: false}, responsCallback).end();
     
}

router.get('/environment', function(req, res, next) {
  var dateObj = new Date();
  var month = dateObj.getUTCMonth() + 1; //months from 1-12
  var day = dateObj.getUTCDate();
  var year = dateObj.getUTCFullYear();
  var newdate = day + "-" + month + "-" + year;
  getData(req,res,newdate);
        
});
router.post('/environment', function(req, res, next) {
  date=req.body.datetext;
    var g1=date.split("/");
    g=g1[1]+'-'+g1[0]+'-'+g1[2];
    date=g1[0]+'-'+g1[1]+'-'+g1[2];
  getData(req,res,g);
        
});

module.exports = router;
