import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';

var Web3 = require('web3');
var Future = require('fibers/future');
var Enum = require('enum');
var fs=require('fs');
var mime = require("mime"); 

Meteor.methods({
//==================================================================================
//ADMIN
//===================================================================================
  "deployProcurement": function () {
    var future = new Future();
    var response;
    HTTP.post("http://localhost:4000/deployProcurement", function (error, result) {
      if (error) {
        console.log(error);
        future.return(error);
      }
      if (result) {
        response = result.content;
        future.return(response);
      }
    });
    return future.wait();
  },

  "deployAdmin": function () {
    var future = new Future();
    var response;
    HTTP.post("http://localhost:4000/deployAdmin", function (error, result) {
      if (error) {
        console.log(error);
        future.return(error);
      }
      if (result) {
        response = result.content;
        future.return(response);
      }
    });
    return future.wait();
  },


  "deployProduction": function () {
    var future = new Future();
    var response;
    HTTP.post("http://localhost:4000/deployProduction", function (error, result) {
      if (error) {
        console.log(error);
        future.return(error);
      }
      if (result) {
        response = result.content;
        future.return(response);
      }
    });
    return future.wait();
  },
  "deployShipment": function () {
    var future = new Future();
    var response;
    HTTP.post("http://localhost:4000/deployShipment", function (error, result) {
      if (error) {
        console.log(error);
        future.return(error);
      }
      if (result) {
        response = result.content;
        future.return(response);
      }
    });
    return future.wait();
  },
"createUser": function (params) {
    var future = new Future();
    var response;
    HTTP.post("http://localhost:4000/registerUser", { params: params }, function (error, result) {
      if (error) {
        console.log(error)
        future.return(error);
      }
      if (result) {
        response = result.content;
        future.return(response);
      }
    });
    return future.wait();
  },

  "getAllSKU": function () {
    var future = new Future();
    var response;
    HTTP.get("http://localhost:4000/getAllSKU", function (error, result) {
      if (error) {
        console.log(error)
        future.return(error);
      }
      if (result) {
        console.log("===========================")
        response = JSON.parse(result.content);
        console.log(JSON.parse(result.content))
        console.log("====+++++++++++++++=============================")
        future.return(response);
      }
    });
    return future.wait()
  },

"createPond": function (params) {
    var future = new Future();
    var response;
    HTTP.post("http://localhost:4000/createPond", { params: params }, function (error, result) {
      if (error) {
        console.log(error)
        future.return(error);
      }
      if (result) {
        response = result.content;
        future.return(response);
      }
    });
    return future.wait();
  },
"getAllPonds": function () {
    var future = new Future();
    var response;
    HTTP.get("http://localhost:4000/viewAllPonds", function (error, result) {
      if (error) {
        console.log(error)
        future.return(error);
      }
      if (result) {
        response = JSON.parse(result.content);
        future.return(response);
      }
    });
    return future.wait();
  },

  "createStorageUnit": function (params) {
    var future = new Future();
    var response;
    HTTP.post("http://localhost:4000/createStorageUnit", { params: params }, function (error, result) {
      if (error) {
        console.log(error)
        future.return(error);
      }
      if (result) {
        response = result.content;
        future.return(response);
      }
    });
    return future.wait();
  },

"getMoreBatchDetails": function (params) {
    var future = new Future();
    var response;
    HTTP.get("http://localhost:3889/getMoreBatchDetails?batchNumber="+params, function(error, result) {
      if (error) {
        console.log(error)
        future.return(error);
      }
      if (result) {
        response = JSON.parse(result.content);
        console.log("inside server result")
        console.log(response)
        future.return(response);
      }
    });
    return future.wait();
  },
//========================================================================================
//DOWNLOAD RREPORT
//========================================================================================
"downloadReport": function (params) {
    console.log("=======================")
    console.log(params)
    var future = new Future();
    var response;
    HTTP.get("http://localhost:4000/download?hash="+params, function (error, result) {
      if (error) {
        console.log(error)
        future.return(error);
      }
      if (result) {
        console.log("inside result of server")
        console.log(result.content)
        response = result.content;
        console.log("---------------------------------")
        console.log(Meteor.settings.server.tempPath)
        var tempPath=Meteor.settings.server.tempPath+"/report.txt"
       // var tempPath =(__dirname + "/report.txt")
        fs.writeFileSync(tempPath,response,{encoding:"utf-8"})

        var file = fs.readFileSync(tempPath,{encoding:"base64"})
       // var file = fs.createReadStream(tempPath,{encoding:'utf-8'});
        
        console.log("+++++++++++++++++++++++++")
        console.log(file)
        console.log("+++++++++++++++++++++++++")
        future.return(file);
      }
    });
    return future.wait();
  },

//========================================================================================
  "createSKU": function (params) {
   
    //========================================
    var data={fileName:params.fileName,fileContent:new Buffer(params.fileData)}
    var future = new Future();
    var response;
    var asyncFun=Meteor.wrapAsync(HTTP.post)
    var uploadResult=asyncFun("http://localhost:4000/upload",{
     headers:{
       'Content-Type':'application/json'
     },
     content:JSON.stringify(data)
   })
   var data = {
    reportName:params.fileName,
    reportHash:uploadResult.content,
    SKUcode: params.SKUcode,
		SKUsize: params.SKUsize,
		prawntype: params.prawntype,
		description: params.description,
		SKUcreatedby: params.SKUcreatedby
};
//=========================================
    var future = new Future();
    var response;
    HTTP.post("http://localhost:4000/createSKU", { data: data },
      function (error, result) {
        if (error) {
          console.log(error)
          future.return(error);
        }
        if (result) {
          console.log(result.content)
          response = result.content;
          
          future.return(response);
        }
      });
    return future.wait();
  },
  //=================================================================================
  //GET EVENTS 
  //==================================================================================
  "getEventDetails": function (params) {
    var future = new Future();
    var response;
    HTTP.get("http://localhost:4000/getEventDetails",function(error, result) {
      if (error) {
        console.log(error)
        future.return(error);
      }
      if (result) {
        response = JSON.parse(result.content);
        console.log("inside event server result")
        console.log(response)
        future.return(response);
      }
    });
    return future.wait();
  },


})
  
 
