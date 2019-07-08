var express = require('express');
var request = require('http');

var router = express.Router();
var boxes=[ 
      //{name:'DESKTOP1',value:'10.176.241.168'},
      //{name:'NIGHTLY-DESKTOP1NEW',value:'10.176.241.11'},
      {name:'NIGHTLY-BUR00BIX',value:'bur00bix.us.oracle.com'},
      {name:'NIGHTLY-BUR00BML',value:'bur00bml.us.oracle.com'},
      {name:'NIGHTLY-BUR00BIW',value:'bur00biw.us.oracle.com'},
      {name:'NIGHTLY-BUR00BIQ',value:'bur00biq.us.oracle.com'},

      {name:'NIGHTLY-BUR00BIS',value:'bur00bis.us.oracle.com'},
      {name:'NIGHTLY-BUR00BIR',value:'bur00bir.us.oracle.com'},
      
      //{name:'NIGHTLY-DESKTOP2',value:'10.176.241.64'},
      {name:'NIGHTLY-DESKTOP2NEW',value:'10.176.243.56'},
      //{name:'NIGHTLY-DESKTOP3',value:'10.141.51.176'},
            //{name:'DESKTOP4',value:'10.141.23.96'},
			{name:'NIGHTLY-DESKTOP5',value:'10.141.51.168'},
      {name:'NIGHTLY-DESKTOP7',value:'10.176.241.151'}, 
      {name:'NIGHTLY-DESKTOP8',value:'10.176.243.10'},

      //{name:'FOUNDATION-MSP52458',value:'msp52458.us.oracle.com'},
			//{name:'NIGHTLY-BurlingtonSGD',value:'bur00bir.us.oracle.com'},
            //{name:'BangaloreSGD1',value:'blr00avn.idc.oracle.com'},
            //{name:'CONFIG-BangaloreSGD2',value:'blr2223131.in.oracle.com'},
        ];
function getLiveResult(res,box){
  try{
    var url='http://'+box+':8080/Automation_Web/ws/portalServices/getLiveExec';
    //http://10.141.21.77:8080/Automation_Web/ws/portalServices/getLiveExec
  
    var renderCallback = function(response){
      console.log(response);
  
      
      res.render('liveResult', { title: 'Live Result' , date:response.date,response: response,boxes: boxes,selectedBox:box});
    } 
  
    var responsCallback = function(res) { 
      console.log('inside');
      var b='';
       
      res.on('data', function(chunk){
        b+=chunk;
        //console.log(chunk);
        });
  
        res.on('end', function() {
            console.log("result is");  
          console.log(b);
          //var date= b.substring(0,15);
          //console.log(date);
          result = b.substring(0, b.length);
          console.log(result);
          //jsonResult= JSON.parse(result);
          //console.log(jsonResult.daily);
          renderCallback(result);
  
        });
    };
    /*
    function(e){
      console.log(e);
      res.render('liveResult', { title: 'Live Result' , error:"Error in conecting to server, Please check if the server is down"});
      //throw e;
    }
    */
  
    request.get({ host: box,family: 4, path: url, port: 8080,agent: false}, responsCallback).on('error',renderCallback ).end();  
  }catch(e){
    res.render('liveResult', { title: 'Live Result' , error:"An error occured please contact administrator"});
  }
}
  
/* GET home page. */
router.get('/liveResult', function(req, res, next) {
    console.log("result is");  
    
    getLiveResult(res,boxes[0].value);
      
    });
  
  router.post('/liveResult',function(req, res, next){
    console.log("box:"+req.body.box);
      
      getLiveResult(res,req.body.box);
    });
  module.exports = router;
  