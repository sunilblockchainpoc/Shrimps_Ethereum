import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';

var Web3 = require('web3');
var Future = require('fibers/future');
var Enum = require('enum');
var fs=require('fs')
Meteor.methods({

  "deployProduction": function () {
    var future = new Future();
    var response;
    HTTP.post("http://localhost:4029/deployProduction", function (error, result) {
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

  "createSKU": function (params) {
   
    //========================================
    var data={fileName:params.fileName,fileContent:new Buffer(params.fileData)}
    var future = new Future();
    var response;
    var asyncFun=Meteor.wrapAsync(HTTP.post)
    var uploadResult=asyncFun("http://localhost:4029/upload",{
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
    HTTP.post("http://localhost:4029/createSKU", { data: data },
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

  /*"getSKUdetails": function (data) {        
          var future = new Future();
          var response;
         var response = HTTP.get("http://localhost:4029/getSKUdetails?index="+data,
         function(error, result){
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
      },*/

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

  "getAllBatches": function () {

    var future = new Future();
    var response;
    HTTP.get("http://localhost:3889/viewAllBatches", function (error, result) {
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
  "downloadReport": function (params) {


    console.log("=======================")
    console.log(params)
    var future = new Future();
    var response;
    HTTP.get("http://localhost:4029/download?hash="+params, function (error, result) {
      if (error) {
        console.log(error)
        future.return(error);
      }
      if (result) {
        response = result.content;
        var tempPath=Meteor.settings.server.tempPath+"/report.txt"
       // var tempPath =(__dirname + "/report.txt")
        fs.writeFileSync(tempPath,response,{encoding:"utf-8"})

        var file = fs.readFileSync(tempPath,{encoding:"base64"})
       // var file = fs.createReadStream(tempPath,{encoding:'utf-8'});
        future.return(file);
      }
    });
    return future.wait();
  },


  "createSaleable": function (data) {
    var future = new Future();
    var response;
    var response = HTTP.post("http://localhost:4029/createSaleable", { data: data },
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
  /*
  "SALEBLE_UNIT_ID": function (data) {        
        var future = new Future();
        var response;
       var response = HTTP.get("http://localhost:4029/SALEBLE_UNIT_ID?saleableunitid="+data,
       function(error, result){
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
    },*/

  "getAllSaleable": function () {
    var future = new Future();
    var response;
    HTTP.get("http://localhost:4029/getAllSaleable", function (error, result) {
      if (error) {
        console.log(error)
        future.return(error);
      }
      if (result) {
        console.log("===========================")
        response = JSON.parse(result.content);
        console.log(JSON.parse(result.content))
        future.return(response);
      }
    });
    return future.wait()
  },

  "createPackage": function (data) {
    var future = new Future();
    var response;
    var response = HTTP.post("http://localhost:8889/createPackage", { data: data },
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

  /*
  "getPackagedetails": function (data) {
      var future = new Future();
      var response;
     var response = HTTP.get("http://localhost:8889/getPackagedetails?index="+data,
     function(error, result){
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
      */

  "getAllPACKAGE": function () {
    var future = new Future();
    var response;
    HTTP.get("http://localhost:8889/getAllPACKAGE", function (error, result) {
      if (error) {
        console.log(error)
        future.return(error);
      }
      if (result) {
        console.log("===========================")
        response = JSON.parse(result.content);
        console.log(JSON.parse(result.content))
        future.return(response);
      }
    });
    return future.wait()
  },

  "updatePackag_Id": function (data) {
    var future = new Future();
    var response;
    var response = HTTP.post("http://localhost:4029/updatePackag_Id", { data: data },
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
});
