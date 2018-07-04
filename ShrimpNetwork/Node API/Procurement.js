var Web3 = require('web3');
var request = require("request");
var express = require('express');
var bodyparser = require('body-parser')
var util = require('util')
var fs = require('fs');
var path = require('path')
var app = express()
var jsonparser = bodyparser.json();
var IPFS=require('ipfs-api')
var ipfs=new IPFS()
var Enum = require('enum');
app.set("json spaces", 0);
app.use(bodyparser.urlencoded());
app.use(bodyparser.json())
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

 var batchStateEnum=new Enum({
       
        'RECEIVED_BY_PROCUREMENT':0,
        'ACKNOWLEDGED_BY_FARMER':1,
        'APPROVED_BY_PROCUREMENT':2,
        'REJECTED_BY_PROCUREMENT':3,
        'RECEIVED_FOR_QA_APPROVAL':4,
        'INTERNAL_QA_APPROVED':5,
        'INTERNAL_QA_REJECT':6,
        'RECEIVED_BY_PRODUCTION':7,
        'APPROVED_BY_PRODUCTION':8,
        'REJECTED_BY_PRODUCTION':9

    });

var prawnTypeEnum = new Enum({
  'SCAMPI': 0,
  'VANNAMAEI': 1,
  'BLACK_TIGER': 2
});
var participantTypeEnum=new Enum({ 
'FARMER':0,
'PROCUREMENT':1,
'PRODUCTION':2,
'INTERNAL_QA':3,
'EXTERNAL_QA':4,
'RETAILER':5,
'IMPORTER':6,
'EXPORTER':7
});
app.listen(3889);
console.log("LISTENING TO PORT 3889 PROCUREMENT.JS...........................")

if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider);
}
else {
  web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}

const input = JSON.parse(fs.readFileSync('./config/config.json', 'utf8'));
const ABIPath = input.Procurementabipath;
const ByteCodePath = input.Procurementbytecodepath;
var ContractAddress = input.ProcurementContractAddress;
const ContractABI = JSON.parse(fs.readFileSync(ABIPath, 'utf8'));
const ContractByteCode = fs.readFileSync(ByteCodePath, 'utf8');
var ContractInstance = web3.eth.contract(ContractABI).at(ContractAddress);
//============================================================================================
app.get('/getMoreBatchDetails', jsonparser, function (req, res) {
  var moreBatchDetail=new Array; 
  res.setHeader('Content-type', 'application/json');
  var batchNumber = req.query.batchNumber;
  var moreBatchDetails = ContractInstance.getMoreBatchDetails(batchNumber);
  var data={
  batchNumber:batchNumber,
  maximumTemperature : moreBatchDetails[0],
  minimumTemperature : moreBatchDetails[1],
  storageUnit : moreBatchDetails[2],
  reportName : moreBatchDetails[3],
  reportHash : moreBatchDetails[4]
  }
  moreBatchDetail.push(data)
  res.send(moreBatchDetail);
});
//======================================================================================================
app.post('/upload',jsonparser,function(req,res){
var report=[{
  path:'/uploads/'+req.body.fileName,
  content:Buffer.from(req.body.fileContent.data)
  }]

ipfs.add(report,function(err,files){
if(err){
}
else{
  res.send(files[0].hash)
}
})
});
//====================================================================================


app.get('/download',jsonparser,function(req,res){
   var hash=req.query.hash
   ipfs.cat(hash,function(err,files){
  if(err){
    console.log(err)
  }
  else{
    res.send(files)
  }
  })
  });
//====================================================================================
app.post('/createBatch', jsonparser, function (req, res) {
  web3.personal.unlockAccount(web3.eth.coinbase, "admin");
  console.log("Account Unlocked");
  var batchNumber = req.body.batchNumber;
  var submittedBy = req.body.submittedBy;
  var batchSize = req.body.batchSize;
  var batchDescription = req.body.batchDescription;
  var prawnType = req.body.prawnType;
  var batchCreatedBy = req.body.createdBy;
  var batchCreatedDate = Number(new Date());
  var maximumTemperature=req.body.maximumTemperature;
  var minimumTemperature=req.body.minimumTemperature;
  var coldStorageName=req.body.storageUnit;
  var reportName="";
  var reportHash="";
  console.log(batchNumber,submittedBy, batchSize, batchDescription, prawnType, batchCreatedBy, batchCreatedDate);

  var BatchCreatedEvent = ContractInstance.BatchCreatedEvent();  //event
  var block = web3.eth.getBlock('latest').number;
  res.setHeader('Content-type', 'application/json')
   
// Transaction object
    var transactionObject = {
      data: ContractByteCode,
      from: web3.eth.coinbase,
      gasPrice: web3.eth.gasPrice,
      gas: 8000000
    };

    ContractInstance.createBatch.sendTransaction(
      batchNumber, submittedBy, batchSize, batchDescription, prawnType, 
      batchCreatedBy, batchCreatedDate,maximumTemperature,minimumTemperature, 
      coldStorageName,reportName,reportHash,transactionObject, function (err, result) {
        if (err) {
          console.log(err);
        }
        else {
          BatchCreatedEvent.watch(function (error, result) {
            if (result.blockNumber > block) {
              res.send(JSON.stringify("Batch ID: " + result.args.batchNumber + " created by: " + result.args.participantID));
              BatchCreatedEvent.stopWatching();
            }
            else {
              console.log(error);
            }
          });
        }
      });
  
});
//=============================================================================================================
app.get('/getBatchDetails', jsonparser, function (req, res) {

  res.setHeader('Content-type', 'application/json');

  var batchResult = new Array;

  var batchNumber = req.query.batchNumber;
  var batchDetails = ContractInstance.getBatchDetails(batchNumber);
  var data = {
    batchNumber: batchNumber,
    participantID: batchDetails[0],
    batchSize: batchDetails[1],
    batchDescription: batchDetails[2],
    prawnType: prawnTypeEnum.get(parseInt(batchDetails[3])).key,
    createdBy: batchDetails[4],
    createdDate: (new Date(Number(batchDetails[5]))).getDate() + "-" + (new Date(Number(batchDetails[5]))).getMonth() + "-" + (new Date(Number(batchDetails[5]))).getFullYear() + " " + (new Date(Number(batchDetails[5]))).getHours() + ":" + (new Date(Number(batchDetails[5]))).getMinutes(),
    batchState: batchStateEnum.get(parseInt(batchDetails[6])).key
  };
  batchResult.push(data);

  res.send(batchResult);
});
//======================================================================================================
app.get('/viewAllBatches', jsonparser, function (req, res) {

  res.setHeader('Content-type', 'application/json');
  var batchList = new Array;

  var batchCount = ContractInstance.getBatchCount();
  console.log("Batch Count: " + parseInt(batchCount));
  for (var index = 0; index < batchCount; index++) {

    var batchNumber = "BAT" + index;
    var batchDetails = ContractInstance.getBatchDetails(batchNumber);

    var participantID = batchDetails[0];
    var batchSize = batchDetails[1];
    var batchDescription = batchDetails[2];
    var prawnType = batchDetails[3];
    var createdBy = batchDetails[4];
    var createdDate = (new Date(Number(batchDetails[5]))).getDate() + "-" + (new Date(Number(batchDetails[5]))).getMonth() + "-" + (new Date(Number(batchDetails[5]))).getFullYear() + " " + (new Date(Number(batchDetails[5]))).getHours() + ":" + (new Date(Number(batchDetails[5]))).getMinutes();
    var batchState = batchDetails[6];

    var data = {
      batchNumber: batchNumber,
      participantID: participantID,
      batchSize: batchSize,
      batchDescription: batchDescription,
      prawnType: prawnTypeEnum.get(parseInt(prawnType)).key,
      createdBy: createdBy,
      createdDate: createdDate,
      batchState: batchStateEnum.get(parseInt(batchState)).key
    };
    batchList.push(data);
  }
  res.send(batchList);
});
//=========================================================================================================
app.post('/updateBatchState', jsonparser, function (req, res) {

  web3.personal.unlockAccount(web3.eth.coinbase, "admin");
  console.log("Account Unlocked");
  var batchNumber = req.body.batchNumber;
  var participantID = req.body.participantID;
  var batchState = req.body.batchState;
  var reportName=req.body.reportName;
  var reportHash=req.body.reportHash;
  var BatchStateUpdateEvent = ContractInstance.BatchStateUpdateEvent();  //event
  var block = web3.eth.getBlock('latest').number;

  // Transaction object
  var transactionObject = {
    data: ContractByteCode,
    from: web3.eth.coinbase,
    gasPrice: web3.eth.gasPrice,
    gas: 8000000
  };

  ContractInstance.updateBatchState.sendTransaction(
    batchNumber, participantID, batchState,reportName,reportHash,  transactionObject, function (err, result) {
      if (err) {
        console.log(err);
      }
      else {
        BatchStateUpdateEvent.watch(function (error, result) {
          if (result.blockNumber > block) {
            res.send(JSON.stringify("Batch: " + result.args.batchNumber + " Status: " + batchStateEnum.get(parseInt(result.args.batchState)).key + " By: " + result.args.participantID +
          " With Report Name Of "+result.args.reportName+" And the Report Hash of "+result.args.reportHash));
            BatchStateUpdateEvent.stopWatching();
          }
          else {
            console.log(error);
          }
        });
      }
    });
});
//==================================================================================================================
app.post('/acknowledgedByFarmer', jsonparser, function (req, res) {

  web3.personal.unlockAccount(web3.eth.coinbase, "admin");
  console.log("Account Unlocked");

  var batchNumber = req.body.batchNumber;
  var participantID = req.body.participantID;

  var BatchStateUpdateEvent = ContractInstance.BatchStateUpdateEvent();  //event
  var block = web3.eth.getBlock('latest').number;
  // Transaction object
  var transactionObject = {
    data: ContractByteCode,
    from: web3.eth.coinbase,
    gasPrice: web3.eth.gasPrice,
    gas: 8000000
  };

  ContractInstance.acknowledgedByFarmer.sendTransaction(
    batchNumber, participantID, transactionObject, function (err, result) {
      if (err) {
        console.log(err);
      }
      else {
        BatchStateUpdateEvent.watch(function (error, result) {
          if (result.blockNumber > block) {
            res.send(JSON.stringify("Batch: " + result.args.batchNumber + " Status: " + batchStateEnum.get(parseInt(result.args.batchState)).key + " By: " + result.args.participantID));
            BatchStateUpdateEvent.stopWatching();
          }
          else {
            console.log(error);
          }
        });
      }
    });
});
//==============================================================================================================
app.get('/getBatchCount', jsonparser, function (req, res) {

  res.setHeader('Content-type', 'application/json');
  var batchCount = ContractInstance.getBatchCount();
  res.send(JSON.stringify(batchCount));
});
