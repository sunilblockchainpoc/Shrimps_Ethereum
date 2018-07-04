import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';

var Web3 = require('web3');
var Future = require('fibers/future');
var Enum = require('enum');
var fs=require('fs');
var mime = require("mime"); 
var packagesListInABatch=new Array;
export const TreeData = new Mongo.Collection('TreeData');
export const TreeValueData = new Mongo.Collection('TreeValueData');

Meteor.publish('TreeData',function(){
  TreeData.remove({})
  TreeValueData.remove({})
  if (TreeData.find().count()===0) {
      Meteor.call("trackByBatchId")
  }
  return [TreeData.find(), TreeValueData.find()]
})


  //============================================================================
  //============================================================================
  //PROCUREMENT++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  //==============================================================================
  //==============================================================================
Meteor.methods({

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
        future.return(response);
      }
    });
    return future.wait();
  },
  
//=======================================================================================
//=======================================================================================  

"createBatch": function (params) {
    var future = new Future();
    var response;
    HTTP.post("http://localhost:3889/createBatch", { params: params }, function (error, result) {
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
  //====================================================================================
  //======================================================================================
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
  //======================================================================================
  //======================================================================================
 "acknowledgedByFarmer": function (params) {
    var future = new Future();
    var response;
    HTTP.post("http://localhost:3889/acknowledgedByFarmer", { params: params }, function (error, result) {
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
 //========================================================================================
 //========================================================================================
  "updateBatchState": function (params) {

    
    console.log(params)
    var data={fileName:params.fileName,fileContent:new Buffer(params.fileData)}
    var future = new Future();
    var response;
    var asyncFun=Meteor.wrapAsync(HTTP.post)
    var uploadResult=asyncFun("http://localhost:3889/upload",{
     headers:{
       'Content-Type':'application/json'
     },
     content:JSON.stringify(data)
    })
    var data = {
      reportName:params.fileName,
      reportHash:uploadResult.content,
      batchNumber: params.batchNumber,
      participantID: params.participantID,
      batchState: params.batchState
     };

    HTTP.post("http://localhost:3889/updateBatchState", { data: data }, function (error, result) {
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
  //======================================================================================
  //======================================================================================
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
  //======================================================================================
  //======================================================================================
  "getBatch": function (params) {

    var future = new Future();
    var response;
    HTTP.get("http://localhost:3889/getBatchDetails?batchNumber="+params, function (error, result) {
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
  //=====================================================================================
  //TRACK BY BATCH ID          
  //=====================================================================================
  "trackByBatchId": function (params) {
    if(typeof(params)==='undefined'){
      return ""
    }
    
    var future = new Future();
    var populateValue=new Array;
    var packageTreeInfo=new Array;
    var saleableUnitDetails;
     
//======GETTING BATCH DETAILS=======================================================
     var asyncFun=Meteor.wrapAsync(HTTP.get)
     var batchDetails=asyncFun("http://localhost:3889/getBatchDetails?batchNumber="+params)
     batchDetails=JSON.parse(batchDetails.content)


     var moreBatchDetails=asyncFun("http://localhost:3889/getMoreBatchDetails?batchNumber="+params)
     moreBatchDetails=JSON.parse(moreBatchDetails.content)  
     
//==================================================================================
//==================================================================================
//===========GETTING ALL SALEABLE UNIT=============================================
var asyncFun=Meteor.wrapAsync(HTTP.get)
     var saleableUnitDetails=asyncFun("http://localhost:4029/getAllSaleable")
     saleableUnitDetails=JSON.parse(saleableUnitDetails.content)
     var saleableUnitCount =saleableUnitDetails.length
     var saleableUnitWithSameBatchId=new Array;
     console.log(saleableUnitDetails)
//==================================================================================
         /* saleableunitid: 0,
          skucode: 'sku02',
          BatchId: 'BAT0',
          packageid: 'pack1',
          createdby: 'shubham',
          createddate: '22-5-2018 13:30' */
//==================================================================================
//===========GETTING ALL SKU DETAILS =============================================
var asyncFun=Meteor.wrapAsync(HTTP.get)
var getAllSKU=asyncFun("http://localhost:4000/getAllSKU")
getAllSKU=JSON.parse(getAllSKU.content)
var getAllSKUCount=getAllSKU.length;
//==================================================================================
//==================================================================================
//==================================================================================
//===========GETTING ALL SKU DETAILS =============================================
var asyncFun=Meteor.wrapAsync(HTTP.get)
var allShipment=asyncFun("http://localhost:3888/getAllShipment")
allShipment=JSON.parse(allShipment.content)
var allShipmentCount=allShipment.length;
console.log("allShipment=====================")
console.log(allShipment)
console.log("allShipment=====================")

//==================================================================================
//==================================================================================
//==================================================================================
//===========GETTING ALL PACKAGES =============================================
var asyncFun=Meteor.wrapAsync(HTTP.get)
var allPackage=asyncFun("http://localhost:8889/getAllPACKAGE")
allPackage=JSON.parse(allPackage.content)
var allPackageCount=allPackage.length;

//==================================================================================
//==================================================================================
//===========GETTING POND ID=============================================

var farmerId=batchDetails[0].participantID
var asyncFun=Meteor.wrapAsync(HTTP.get)
var pondId=asyncFun("http://localhost:4000/getPondIdFromFarmer?participantID="+farmerId)
pondId=JSON.parse(pondId.content)
var pondIdCount=pondId.length;
//==================================================================================
//===========GETTING FARMER DETAILS=============================================
var farmerId=batchDetails[0].participantID
var asyncFun=Meteor.wrapAsync(HTTP.get)
var FarmerDetails=asyncFun("http://localhost:4000/viewUserDetails?participantID="+farmerId)
FarmerDetails=JSON.parse(FarmerDetails.content)
var FarmerDetailsCount=FarmerDetails.length;
//==================================================================================
//==================================================================================
//==================================================================================
//===========GETTING POND DETAILS=============================================
var farmerId=batchDetails[0].participantID
var asyncFun=Meteor.wrapAsync(HTTP.get)
var pondDetails=asyncFun("http://localhost:4000/viewPondDetails?pondID="+pondId.pondId)
pondDetails=JSON.parse(pondDetails.content)
var pondDetailsCount=pondDetails.length;

//==================================================================================
//descriptionunitTreeInfo[0].saleableUnitDetails[0].saleableunitid.push({name:"suvam"})
populateValue.push ( {
  key:[params],
    label1 : "Submitted By",
    value1 : batchDetails[0].participantID,
    label2 : "Batch Size",
    value2 : batchDetails[0].batchSize,
    label3 : "Batch Description",
    value3 : batchDetails[0].batchDescription,
    label4 : "Prawn Type",
    value4 : batchDetails[0].prawnType,
    label5 : "Created By",
    value5 : batchDetails[0].createdBy,
    label6 : "Created Date",
    value6 : batchDetails[0].createdDate
  })
 populateValue.push ( {
  key:["Pond"],
    label1 : "Pond Name",
    value1 : pondDetails[0],
    label2 : "Location",
    value2 : pondDetails[1],
    label3 : "Pond Description",
    value3 : pondDetails[2],
   
 
})
populateValue.push ( {
 key:["Farmer"],
   label1 : "First Name",
   value1 : FarmerDetails[1],
   label2 : "Last Name",
   value2 : FarmerDetails[2],
   label3 : "Email",
   value3 : FarmerDetails[3],
   label4 : "Phone",
   value4 : FarmerDetails[4]
  
})
   for(var i=0;i<saleableUnitCount;i++){
    if(saleableUnitDetails[i].BatchId===params){ 
      if(!(_.contains(packagesListInABatch,saleableUnitDetails[i].packageid)||saleableUnitDetails[i].packageid===0)){
      packagesListInABatch.push(saleableUnitDetails[i].packageid)
      }
      var SKUcode
      var SKUsize
      var prawntype
      var description
      var SKUcreatedby
      var SKUcreateddate
      var SKUReportName
      
      for(var j=0;j<getAllSKUCount;j++){
        console.log(saleableUnitDetails[i].skucode,getAllSKU[j].SKUcode)
        if(saleableUnitDetails[i].skucode===getAllSKU[j].SKUcode){
          SKUcode=getAllSKU[j].SKUcode
          SKUsize=getAllSKU[j].SKUsize
          prawntype=getAllSKU[j].prawntype
          description=getAllSKU[j].description
          SKUcreatedby=getAllSKU[j].SKUcreatedby
          SKUcreateddate=getAllSKU[j].SKUcreateddate
          SKUReportName=getAllSKU[j].SKUReportName
        }
      
      }

     var consignmnetNO
     var shippingStatus
     var shippingReqDate
     var shippingReqBy
     var package_id
      for(var j=0;j<allShipmentCount;j++){
       if(saleableUnitDetails[i].packageid===parseInt(allShipment[j].package_id)) {
        
        consignmnetNO=allShipment[j].CONSIGNMENT_NO
        shippingReqBy=allShipment[j].created_by
        shippingReqDate=allShipment[j].created_date
        shippingStatus=allShipment[j].state
        package_id=allShipment[j].package_id
       }

      }


      populateValue.push ( {
        key:["unit"+saleableUnitDetails[i].saleableunitid],
          label1 : "Unit ID",
          value1 : "Unit "+saleableUnitDetails[i].saleableunitid,
          label2 : "Sku Code",
          value2 : saleableUnitDetails[i].skucode,
          label3 : "Size",
          value3 : SKUsize,
          label4 : "Description",
          value4 : description,
          label5 : "UnitCreated Date",
          value5 : saleableUnitDetails[i].createddate,
          label6 : "CreatedDate",
          value6 : saleableUnitDetails[i].createdby,
          // Unit Details
          value8 :"Unit "+saleableUnitDetails[i].saleableunitid,
          value9 :SKUsize,
          value10 :description,
          // Shipping Details
          value25: "Consignment-No "+consignmnetNO,
          value26: shippingStatus,
          value27: shippingReqDate,
          value28: shippingReqBy,
          value30: moreBatchDetails[0].reportHash,
          value31: moreBatchDetails[0].reportName,
          // Package Details
          value11:"pack "+package_id,
          // Batch Details
          value12:params,
          value13:batchDetails[0].prawnType,
          value14:batchDetails[0].batchSize,
          value15:batchDetails[0].createdDate,
          value16:moreBatchDetails[0].minimumTemperature,
          value17:moreBatchDetails[0].maximumTemperature,
          // Farm Details
          value20:FarmerDetails[1],
          value21:FarmerDetails[2],
          // Pond Details
          value22: pondDetails[0],
          value23: "85",
          value24: "66",
          value18 :farmerId,
          value19 :"Pond Id "+pondId.pondId,


       /*/**key:[unitID],
label1 : "Unit ID",
value1 : unitID,
label2 : "SkuCode",
value2 : skuCode,
label3 : "Size",
value3 : skuSize,
label4 : "Description",
value4 : skuDesc,
label5 : "UnitCreated Date",
value5 : unitCreatedDate,
label6 : "UnitProduced By",
value6 : uintCreatedBy,
// Unit Details
value8 :unitID,
value9 :skuSize,
value10 :skuDesc,
// Shipping Details
value25: consignmnetNO,
value26: shippingStatus,
value27: shippingReqDate,
value28: shippingReqBy,
value30: reportURL,
value31: labReportFilename,
// Package Details
value11:packageID,
// Batch Details
value12:batchID,
value13:batchShrimpType,
value14:batchSize,
value15:batchCreatedDate,
value16:batchMinAcceptTemp,
value17:batchMaxAcceptTemp,
// Farm Details
value20: farmerFname,
value21: farmerLname,
// Pond Details
value22: pondName,
value23: Latitude,
value24: Longitude,
value18 :FARMER,
value19 :pondID,
 */ 



          })
        }
      }
        for(var j=0;j<packagesListInABatch.length;j++){      
          populateValue.push ( {
            key:"pack"+[packagesListInABatch[j]],
            label1 : "Quantity",
            value1 : allPackage[j].Quantity,
            label2 : "Packaging Created By",
            value2 : allPackage[j].packagingcreatedby,
            label3 : "Packaging Created Date",
            value3 : allPackage[j].packagingcreateddate,
           })
           var pArray=allPackage[packagesListInABatch[j]-1].saleableUnitsArray
           var salebleUnitTreeInfo=new Array;
           for(var k=0;k<pArray.length;k++){
           salebleUnitTreeInfo.push({["unit"+pArray[k]]:{}})

           }
           var data={["pack"+packagesListInABatch[j]]:{units:salebleUnitTreeInfo}}
           packageTreeInfo.push(data) 
         /* if(parseInt(allShipment[j].package_id)){
              var consignmentTreeInfo=new Array;
              consignmentTreeInfo.push({[allShipment[j].CONSIGNMENT_NO]:{}})
              //var consignmentData={["pack"+saleableUnitDetails[i].packageid]:{CNO:JSON.stringify(consignmentTreeInfo)}}
              //packageTreeInfo.push(consignmentData) 
             }*/
           }
         


//==========Wriute your code =====================

  var treeData = { Batches : { 
    [params] : { 
    Pond : "pondID",
    Farmer : "farmerID",
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
  if (name=="Batches")
  icon_file = "Detail_icon@3x.png"
  else if (name.startsWith("BAT"))
  icon_file = "ID_icon@3x.png"
  else 
  if (name=="Pond")
  icon_file = "pond_name_icon@3x.png"
  else 
  if (name==="Farmer")
  icon_file = "farmer_icon@3x.png"
  else 
  if (name==="Packages")
  icon_file = "packege_icon@3x.png"
  else 
  if (name.startsWith("pack"))
  icon_file = "Detail_icon@3x.png"
  else 
  icon_file = "UnitDetail_icon@3x.png"
  id = TreeData.insert({name,parent,icon:icon_file});
  for (var t=0 ; t<populateValue.length;t++) {
  if (name ==populateValue[t].key ) {
  
  TreeValueData.insert({"_id":id,value:populateValue[t]})
  }
  }
  oldParent = id
  }
  if (typeof treeData[name] ==='object')
  insertTestData(oldParent,id,treeData[name]);
  }
}
  
  TreeData.remove({});
  TreeValueData.remove({})
  insertTestData(null,null,treeData);
  return [TreeData.find({}).fetch(),TreeValueData.find({}).fetch()]
  return future.wait()
}, 
});
