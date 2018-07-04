import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
var Web3 = require('web3');
var Future = require('fibers/future');
var Enum = require('enum');
var fs=require('fs');
var mime = require("mime"); 
export const ConsignmentTreeData = new Mongo.Collection('ConsignmentTreeData');
export const ConsignmentTreeValueData = new Mongo.Collection('ConsignmentTreeValueData');

Meteor.publish('ConsignmentTreeData',function(){
  ConsignmentTreeData.remove({})
  ConsignmentTreeValueData.remove({})
  if (ConsignmentTreeData.find().count()===0) {
      Meteor.call("trackByConsignmentNo")
  }
   return [ConsignmentTreeData.find(), ConsignmentTreeValueData.find()]
})

Meteor.methods({
  //===========================================================================
  "getAllPACKAGE": function () {
    var future = new Future();
    var response;
    var packageList = new Array();
    HTTP.get("http://localhost:8889/getAllPACKAGE", function (error, result) {
      if (error) {
        console.log(error)
        future.return(error);
      }
      if (result) {
        response = JSON.parse(result.content);
        //Removing blank Package IDs
        future.return(response);
      }
    });
    return future.wait()
  },
 //=============================================================================
  'createShipment': function (params) {
    var future = new Future();
    var url = "http://localhost:3888/createShipment";
    HTTP.post(url, { data: params }, function (error, result) {
      if (error) {
        console.log(error)
        future.return(error)
      }
      else {
        future.return(result.content)
      }
    })
    return future.wait();
  },
  //=============================================================================
  'updateShipment': function (params) {
    var future = new Future();
    var url = "http://localhost:3888/updateShippingStatus";
    HTTP.post(url, { params: params }, function (error, result) {
      if (error) {
        console.log(error)
        future.return(error)
      }
      else {
        future.return(result.content)
      }
    })
    return future.wait();
  },
//================================================================================
"downloadReport": function (params) {
  var future = new Future();
  var response;
  HTTP.get("http://localhost:3889/download?hash="+params, function (error, result) {
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
//================================================================================
  "getShipment": function (params) {
    var future = new Future();
    var response;
    HTTP.get("http://localhost:3888/getShippingDetails?CONSIGNMENT_NO=" + params, function (error, result) {
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
  //===============================================================================
  "getAllShipments": function () {
    var future = new Future();
    var response;
    HTTP.get("http://localhost:3888/getAllShipment", function (error, result) {
      if (error) {
        console.log(error)
        future.return(error);
      }
      if (result) {
        response = JSON.parse(result.content);
        future.return(response);
        
      }
    })
    return future.wait();
  },
  //=================================================================================
  //=================================================================================
  "trackByConsignmentNo": function (params) {
   if(typeof(params)==='undefined'){
     return ""
   }
    var future = new Future();
    var populateValue=new Array;
    var packageTreeInfo=new Array;
    var saleableUnitDetails;
//====================================================================================
//GETTING CONSIGNMENT DETAILS
//====================================================================================
var asyncFun=Meteor.wrapAsync(HTTP.get)
var shipmentDetails=asyncFun("http://localhost:3888/getShipment?CONSIGNMENT_NO="+params)
shipmentDetails=JSON.parse(shipmentDetails.content)
var shipmentDetailsCount=shipmentDetails.length;
            populateValue.push({
            key:"Consignment-No "+[shipmentDetails.CONSIGNMENT_NO],
            label1 : "Package Id",
            value1 : shipmentDetails.package_id,
            label2 : "Weight",
            value2 : shipmentDetails.weight,
            label3 : "Description",
            value3 : shipmentDetails.description,
            label4 : "Status",
            value4 : shipmentDetails.state,
            label5 : "CreatedBy",
            value5 : shipmentDetails.created_by,
            label6 : "CreatedDate",
            value6 : shipmentDetails.created_date
            })


//=================================================================================
//===========GETTING ALL PACKAGES =================================================
var asyncFun=Meteor.wrapAsync(HTTP.get)
var getPackageDetails=asyncFun("http://localhost:8889/getPackagedetails?index="+shipmentDetails.package_id)
getPackageDetails=JSON.parse(getPackageDetails.content)
var getPackageDetailsCount=getPackageDetails.length;
populateValue.push ( {
  key:["pack "+shipmentDetails.package_id],
  label1 : "Quantity",
  value1 : getPackageDetails[0],
  label2 : "Packaging Created By",
  value2 : getPackageDetails[1],
  label3 : "Packaging Created Date",
  value3 : getPackageDetails[2]
 })
//===================================================================================
//GET SALEABLE UNIT
//===================================================================================
//===================================================================================
//===========GETTING ALL SALEABLE UNIT===============================================
var saleableUnitArrayLength=(getPackageDetails[3]).length
var saleableUnitTreeInfo=new Array()
for(var i=0;i<saleableUnitArrayLength;i++){
saleableUnitTreeInfo.push({["unit "+(getPackageDetails[3])[i]]:{}})
var asyncFun=Meteor.wrapAsync(HTTP.get)
     var saleableUnitDetails=asyncFun("http://localhost:4029/SALEBLE_UNIT_ID?saleableunitid="+(getPackageDetails[3])[i])
     saleableUnitDetails=JSON.parse(saleableUnitDetails.content)
     var saleableUnitCount =saleableUnitDetails.length
     var saleableUnitWithSameBatchId=new Array;
     var asyncFun=Meteor.wrapAsync(HTTP.get)
     var batchDetails=asyncFun("http://localhost:3889/getBatchDetails?batchNumber="+saleableUnitDetails[1])
     batchDetails=JSON.parse(batchDetails.content)    
var farmerId=batchDetails[0].participantID


var moreBatchDetails=asyncFun("http://localhost:3889/getMoreBatchDetails?batchNumber="+saleableUnitDetails[1])
moreBatchDetails=JSON.parse(moreBatchDetails.content)    
var asyncFun=Meteor.wrapAsync(HTTP.get)
var pondId=asyncFun("http://localhost:4000/getPondIdFromFarmer?participantID="+farmerId)
pondId=JSON.parse(pondId.content)
var pondIdCount=pondId.length;

//==================================================================================
//===========GETTING POND ID========================================================
var farmerId=batchDetails[0].participantID
var asyncFun=Meteor.wrapAsync(HTTP.get)
var farmerDetails=asyncFun("http://localhost:4000/viewUserDetails?participantID="+farmerId)
farmerDetails=JSON.parse(farmerDetails.content)
var farmerDetailsCount=farmerDetails.length;

var asyncFun=Meteor.wrapAsync(HTTP.get)
var pondId=asyncFun("http://localhost:4000/getPondIdFromFarmer?participantID="+farmerId)
pondId=JSON.parse(pondId.content)
var pondIdCount=pondId.length;

var getAllSKU=asyncFun("http://localhost:4000/getAllSKU")
getAllSKU=JSON.parse(getAllSKU.content)
var getAllSKUCount=getAllSKU.length;
var SKUsize
var prawntype
var description
var SKUcreatedby
var SKUcreateddate
var SKUReportName

for(var j=0;j<getAllSKUCount;j++){
  if(saleableUnitDetails[0]===getAllSKU[j].SKUcode){
    SKUcode=getAllSKU[j].SKUcode
    SKUsize=getAllSKU[j].SKUsize
    prawntype=getAllSKU[j].prawntype
    description=getAllSKU[j].description
    SKUcreatedby=getAllSKU[j].SKUcreatedby
    SKUcreateddate=getAllSKU[j].SKUcreateddate
    SKUReportName=getAllSKU[j].SKUReportName
  }

}
var asyncFun=Meteor.wrapAsync(HTTP.get)
var pondDetails=asyncFun("http://localhost:4000/viewPondDetails?pondID="+pondId.pondId)
pondDetails=JSON.parse(pondDetails.content)
var pondDetailsCount=pondDetails.length;
populateValue.push ( {
key:["unit "+(getPackageDetails[3])[i]],
label1 : "Unit ID",
value1 : "Unit "+(getPackageDetails[3])[i],
label2 : "SkuCode",
value2 : saleableUnitDetails[0],
label3 : "SKU size",
value3 : SKUsize,
label4 : "Description",
value4 : description,
label5 : "saleableUnit createdDate",
value5 : saleableUnitDetails[4],
label6 : "saleableUnit createdBy",
value6 : saleableUnitDetails[3],


// Unit Details
value8 :(getPackageDetails[3])[i],
value9 :SKUsize,
value10:description,
// Shipping Details
value25: "ConsignmentNo "+[shipmentDetails.CONSIGNMENT_NO],
value26: shipmentDetails.state,
value27: shipmentDetails.created_date,
value28: shipmentDetails.created_by,
value30: moreBatchDetails[0].reportHash,
value31: moreBatchDetails[0].reportName,
// Package Details
value11:"pack "+saleableUnitDetails[2],
// Batch Details
value12:saleableUnitDetails[1],
value13:batchDetails[0].prawnType,
value14:batchDetails[0].batchSize,
value15:batchDetails[0].createdDate,
value16:moreBatchDetails[0].minimumTemperature,
value17:moreBatchDetails[0].maximumTemperature,
// Farm Details
value20: farmerDetails[1],
value21: farmerDetails[2],
// Pond Details
value22: pondDetails[1],
value23: pondDetails[2],
value24:"30",
value18 :farmerId,
value19 :"pond "+pondId.pondId

})

//==================================================================================
}
packageTreeInfo.push({["pack "+shipmentDetails.package_id]:{Units:saleableUnitTreeInfo}})
//==========Wriute your code =====================
var treeData = { Consignments : { 
    ["Consignment-No "+params] : {
      
    Packages : packageTreeInfo
   }}}
//INsert DATA
function insertTestData(oldParent,parent,treeData) {
  var oldParent;
for (let name in treeData) {
  let id
 
  if(!isNaN(name)) {
  //console.log(name+ " is an Array index.Skipping !!!")
  id = oldParent
  }
  else {
  var icon_file
  // Setting up relative icons
  if (name=="Consignments")
  icon_file = "Detail_icon@3x.png"
  else if (name.startsWith("Consignment-No"))
  icon_file = "ID_icon@3x.png"
  else 
  if (name==="Packages")
  icon_file = "packege_icon@3x.png"
  else 
  if (name.startsWith("pack"))
  icon_file = "Detail_icon@3x.png"
  else 
  icon_file = "UnitDetail_icon@3x.png"
  id = ConsignmentTreeData.insert({name,parent,icon:icon_file});
  for (var t=0 ; t<populateValue.length;t++) {
  if (name ==populateValue[t].key ) {
  
    ConsignmentTreeValueData.insert({"_id":id,value:populateValue[t]})
  }
  }
  oldParent = id
  }
  if (typeof treeData[name] ==='object')
  insertTestData(oldParent,id,treeData[name]);
  }
}
  ConsignmentTreeData.remove({});
  ConsignmentTreeValueData.remove({})
  insertTestData(null,null,treeData);
  return [ConsignmentTreeData.find({}).fetch(),ConsignmentTreeValueData.find({}).fetch()]
  return future.wait()
},
//===================================================================================
//==============saleable unit========================================================
//===================================================================================

});




