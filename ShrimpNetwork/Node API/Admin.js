var Web3 = require('web3');
var request = require("request");
var express = require('express');
var bodyparser = require('body-parser')
var util = require('util')
var fs = require('fs');
var path = require('path')
var app = express()
var jsonparser = bodyparser.json();
var Fiber = require('fibers')
var Future = require('fibers/future');
var Enum = require('enum');
var IPFS=require('ipfs-api');
var ipfs=new IPFS();
app.set("json spaces", 0);
app.use(bodyparser.urlencoded());
app.use(bodyparser.json())
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
var prawntypeEnum = new Enum({
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


app.listen(4000);
console.log("listening to Port 4000 ADMIN.JS......................")

if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider);
}
else {
  web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}
const input = JSON.parse(fs.readFileSync('./config/config.json', 'utf8'));
//Admin
//======================================================================================================
const AdminABIPath = input.Adminabipath;
const AdminByteCodePath = input.Adminbytecodepath;
var AdminContractAddress = input.AdminContractAddress;
const AdminContractABI = JSON.parse(fs.readFileSync(AdminABIPath, 'utf8'));
const AdminContractByteCode = fs.readFileSync(AdminByteCodePath, 'utf8');
var AdminContractInstance = web3.eth.contract(AdminContractABI).at(AdminContractAddress);
//=======================================================================================================
//procurement
//=======================================================================================================
const ProcurementABIPath = input.Procurementabipath;
const ProcurementByteCodePath = input.Procurementbytecodepath;
var ProcurementContractAddress = input.ProcurementContractAddress;
const ProcurementContractABI = JSON.parse(fs.readFileSync(ProcurementABIPath, 'utf8'));
const ProcurementContractByteCode = fs.readFileSync(ProcurementByteCodePath, 'utf8');
var ProcurementContractInstance = web3.eth.contract(ProcurementContractABI).at(ProcurementContractAddress);
//=========================================================================================================
//production
//========================================================================================================
const ProductionABIPath = input.Productionabipath;
const ProductionByteCodePath = input.Productionbytecodepath;
var ProductionContractAddress = input.ProductionContractAddress;
const ProductionContractABI = JSON.parse(fs.readFileSync(ProductionABIPath, 'utf8'));
const ProductionContractByteCode = fs.readFileSync(ProductionByteCodePath, 'utf8');
var ProductionContractInstance = web3.eth.contract(ProductionContractABI).at(ProductionContractAddress);
//=========================================================================================================
//Shipment
//=========================================================================================================
const ShipmentABIPath = input.Shipmentabipath;
const ShipmentByteCodePath = input.Shipmentbytecodepath;
var ShipmentContractAddress = input.ShipmentContractAddress;
const ShipmentContractABI = JSON.parse(fs.readFileSync(ShipmentABIPath, 'utf8'));
const ShipmentContractByteCode = fs.readFileSync(ShipmentByteCodePath, 'utf8');
var ShipmentContractInstance = web3.eth.contract(ShipmentContractABI).at(ShipmentContractAddress);
//============================================================================================
//DEPLOY ADMIN
//============================================================================================

app.post('/deployAdmin', jsonparser, function (request, response) {

  web3.personal.unlockAccount(web3.eth.coinbase, "admin")
  console.log("unlocked");

  const ContractObject = web3.eth.contract(AdminContractABI);
  AdminContractInstance = ContractObject.new({
    data: '0x' + AdminContractByteCode.toString(),
    from: web3.eth.coinbase,
    gas: 8000000

  }, function (err, res) {
    if (err) {
      console.log(err.toString());
      return;
    }

    console.log(res.transactionHash);
    if (res.address) {
      ContractAddress = res.address;
      console.log(res.address);
      response.send(JSON.stringify(res.address))
    }
  });
});

//============================================================================================
//DEPLOY PROCUREMENT
//============================================================================================

app.post('/deployProcurement', jsonparser, function (request, response) {

  web3.personal.unlockAccount(web3.eth.coinbase, "admin")
  console.log("unlocked");

  const ContractObject = web3.eth.contract(ProcurementContractABI);
  ProcurementContractInstance = ContractObject.new({
    data: '0x' + ProcurementContractByteCode.toString(),
    from: web3.eth.coinbase,
    gas: 8000000

  }, function (err, res) {
    if (err) {
      console.log(err.toString());
      return;
    }

    console.log(res.transactionHash);
    if (res.address) {
      ContractAddress = res.address;
      console.log(res.address);
      response.send(JSON.stringify(res.address))
    }
  });
});
//==============================================================================================
//DEPLOY PRODUCTION
//==============================================================================================

app.post('/deployProduction', jsonparser, function (request, response) {

    web3.personal.unlockAccount(web3.eth.coinbase, "admin")
    console.log("unlocked");
  
    const ContractObject = web3.eth.contract(ProductionContractABI);
    ProductionContractInstance= ContractObject.new({
      data: '0x' + ProductionContractByteCode.toString(),
      from: web3.eth.coinbase,
      gas: 8000000
  
    }, function (err, res) {
      if (err) {
        console.log(err.toString());
        return;
      }
      
        if (res.address) {
        ContractAddress = res.address;
        console.log(res.address);
        response.send(JSON.stringify(res.address))
      }
    });
     
  });
//==============================================================================================
//DEPLOY SHIPMENT
//==============================================================================================
app.post('/deployShipment', jsonparser, function (req, res) {
    web3.personal.unlockAccount(web3.eth.coinbase, "admin");
    var contract = web3.eth.contract(ShipmentContractABI);
    var contractInstance = contract.new({
        data: '0x' + ShipmentContractByteCode,
        from: web3.eth.coinbase, // account address
        gasPrice: web3.eth.gasPrice,
        gas: 8000000
    }, (err, result) => {
        if (err) {
            console.log(err);
            return;
        }
        if (result.address) {
            res.send(JSON.stringify(result.address))
        }
    });
});

//========================================================================================================
//REGISTER USER
//========================================================================================================
app.post('/registerUser', jsonparser, function (req, res) {

  web3.personal.unlockAccount(web3.eth.coinbase, "admin");
  console.log("Account Unlocked");

  var participantID = req.body.participantID;
  var participantType = req.body.participantType;
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var description = req.body.description;
  var publicKey = req.body.publicKey;
  var email = req.body.email;
  var phone = req.body.phone;
  var RegisterUserEvent = AdminContractInstance.RegisterUserEvent();  //event
  var block = web3.eth.getBlock('latest').number;
  //var future = new Future();
  console.log(block);

  // Transaction object
  var transactionObject = {
    data: ProcurementContractByteCode,
    from: web3.eth.coinbase,
    gasPrice: web3.eth.gasPrice,
    gas: 8000000
  };

  AdminContractInstance.registerUser.sendTransaction(
    participantID, participantType, firstName, lastName, description, publicKey, email, phone, transactionObject, function (err, result) {
      if (err) {
        console.log(err);
      }
      else {
        RegisterUserEvent.watch(function (error, result) {
          if (result.blockNumber > block) {
            res.send(JSON.stringify("Participant ID: " + result.args.participantID + " Name: " + result.args.firstName + " " + result.args.lastName + " Role: " + participantTypeEnum.get(parseInt(result.args.participantType)).key));
            RegisterUserEvent.stopWatching();
          }
          else {
            console.log(error);
          }
        });
      }
    });
});
//======================================================================================
//CREATE STORAGE UNIT
//=======================================================================================
app.post('/createStorageUnit', jsonparser, function (req, res) {

  web3.personal.unlockAccount(web3.eth.coinbase, "admin");
  console.log("Account Unlocked");

  var storageUnitName = req.body.storageUnitName;
  var storageUnitCapacity = req.body.storageUnitCapacity;
  var storageUnitLocation = req.body.storageUnitLocation;
  var storageCreatedEvent=AdminContractInstance.StorageUnitCreatedEvent();
  var block = web3.eth.getBlock('latest').number;
  // Transaction object
  var transactionObject = {
    data: AdminContractByteCode,
    from: web3.eth.coinbase,
    gasPrice: web3.eth.gasPrice,
    gas: 8000000
  };

  AdminContractInstance.createStorageUnit.sendTransaction(
    storageUnitName, storageUnitCapacity, storageUnitLocation, transactionObject, function (err, result) {
      if (err) {
        console.log(err);
      }
      else {
        storageCreatedEvent.watch(function (error, result) {
            if (result.blockNumber > block) {
            res.send(JSON.stringify("SORAGE UNIT ID: " + result.args.storageUnitId + " is registered with Storage Unit Name Of: " +        result.args.storageUnitName));
            storageCreatedEvent.stopWatching();
          }
          else {
            console.log(error);
          }
        });
       
      }
    });
});
//=======================================================================================
//=======================================================================================

//=============================================================================================
//VIEW USER DETAILS
//=============================================================================================
app.get('/viewUserDetails', jsonparser, function (req, res) {

  res.setHeader('Content-type', 'application/json');
  var participantID = req.query.participantID;
  var userDetails = AdminContractInstance.viewUserDetails(participantID);
  res.send(userDetails);

});
//==============================================================================================
//ADDITIONAL USER DETAILS
//==============================================================================================

app.get('/viewAdditionalUserDetails', jsonparser, function (req, res) {

  res.setHeader('Content-type', 'application/json');
  var participantID = req.query.participantID;
  var additionalUserDetails = AdminContractInstance.viewAdditionalUserDetails(participantID);
  res.send(JSON.stringify(additionalUserDetails));

});
//==============================================================================================
//GET FARMER TO POND
//==============================================================================================

app.get('/getPondIdFromFarmer', jsonparser, function (req, res) {
     var farmerID = req.query.participantID;
     var pondId=AdminContractInstance.getPondFromFarmerId(farmerID)
     res.setHeader('Content-type', 'application/json');
     res.send({pondId:pondId});

});
//===============================================================================================
//CREATE POND
//===============================================================================================
app.post('/createPond', jsonparser, function (req, res) {

  web3.personal.unlockAccount(web3.eth.coinbase, "admin");
  console.log("Account Unlocked");

  var participantID = req.body.participantID;
  var name = req.body.name;
  var location = req.body.location;
  var description = req.body.description;
  var PondCreatedEvent = AdminContractInstance.PondCreatedEvent();  //events
  var PondCheckEvent = AdminContractInstance.PondCheckEvent();
  var block = web3.eth.getBlock('latest').number;

  console.log(participantID, name, location, description);

  // Transaction object
  var transactionObject = {
    data: ProcurementContractByteCode,
    from: web3.eth.coinbase,
    gasPrice: web3.eth.gasPrice,
    gas: 8000000
  };

  AdminContractInstance.createPond.sendTransaction(
    participantID, name, location, description, transactionObject, function (err, result) {
      if (err) {
        console.log(err);
      }
      else {
        PondCreatedEvent.watch(function (error, result) {
          if (result.blockNumber > block) {
            res.send(JSON.stringify("Pond ID: " + result.args.pondID + " is registered for Participant ID: " + result.args.participantID));
            PondCreatedEvent.stopWatching();
          }
          else {
            console.log(error);
          }
        });
        PondCheckEvent.watch(function (error1, result1) {
          if (result1.blockNumber > block) {
            res.send(JSON.stringify("Participant ID: " + result1.args.participantID + " " + result1.args.message));
            PondCheckEvent.stopWatching();
          }
          else {
            console.log(error1);
          }
        });
      }
    });
});
//====================================================================================================
//VIEW POND DETAILS
//====================================================================================================
app.get('/viewPondDetails', jsonparser, function (req, res) {

  res.setHeader('Content-type', 'application/json');
  var pondID = req.query.pondID;
  var pondDetails = AdminContractInstance.viewPondDetails(pondID);
  res.send(pondDetails);
});

//====================================================================================================
//CREATE SKU
//====================================================================================================
app.post('/createSKU', jsonparser, function (req, res) {
    web3.personal.unlockAccount(web3.eth.coinbase, "admin")
    var reportName=req.body.reportName;
    var reportHash=req.body.reportHash;
    var SKU_code = req.body.SKUcode;
    var SKU_size = req.body.SKUsize;
    var prawn_type = req.body.prawntype;
    var description = req.body.description;
    var SKU_createdby = req.body.SKUcreatedby;
    //var SKU_createddate = req.body.SKUcreateddate;
    var SKU_createddate = Number(new Date());
    res.setHeader('Content-type', 'application/json')

    //TransactionObject

    var transactionObject = {
        data: "0x" + ProductionContractByteCode,
        from: web3.eth.coinbase, // account address
        gasPrice: web3.eth.gasPrice,
        gas: 8000000
    };

    var sku_created = AdminContractInstance.SKUCreated();
    AdminContractInstance.createSKU.sendTransaction(
        SKU_code, SKU_size, prawn_type, description, SKU_createdby, SKU_createddate, 
        reportName,reportHash,transactionObject, function (err, result) {
            if (err) {
                console.log(err);
            }
            else {
                sku_created.watch(function (error, results) {
                    if (error) {
                        console.log("error")
                    }
                    else {
                        res.send(JSON.stringify("index :" + results.args.SKU_INDEX + "code :" + results.args.SKU_code
                        +" reportName "+results.args.SKU_ReportName+" reportHash "+results.args.SKU_ReportHash))
                        sku_created.stopWatching()
                    }
                });
            }
        })
});

//=======================================================================================
//getSKUdetails(get method)
//=======================================================================================

app.get('/getSKUdetails', jsonparser, function (req, res) {
    web3.personal.unlockAccount(web3.eth.coinbase, "admin")
    var SKU_INDEX = req.query.index;
    res.setHeader('Content-type', 'application/json')
    var details = AdminContractInstance.getSKUdetails(SKU_INDEX);
    res.send(JSON.stringify(details));
})
//========================================================================================
//GET ALL SKU'S
//========================================================================================
app.get('/getAllSKU', jsonparser, function (req, res) {
    res.setHeader('Content-type', 'application/json')
    var SKUList = new Array();
    var SKUCount = AdminContractInstance.getSKUCount();
    for (var index = 0; index < SKUCount; index++) {
        var SKUDetails = AdminContractInstance.getSKUdetails(index);
        var SKUcode = SKUDetails[0];
        var SKUsize = SKUDetails[1];
        var prawntype = prawntypeEnum.get(parseInt(SKUDetails[2])).key;
        var description = SKUDetails[3];
        var SKUcreatedby = SKUDetails[4];
        var SKUcreateddate = (new Date(Number(SKUDetails[5]))).getDate() + "-" + (new Date(Number(SKUDetails[5]))).getMonth() + "-" + (new Date(Number(SKUDetails[5]))).getFullYear() + " " + (new Date(Number(SKUDetails[5]))).getHours() + ":" + (new Date(Number(SKUDetails[5]))).getMinutes()
        var SKUReportName=SKUDetails[6];
        var SKUReportHash=SKUDetails[7];

        var data = {
            SKUcode: SKUcode,
            SKUsize: SKUsize,
            prawntype: prawntype,
            description: description,
            SKUcreatedby: SKUcreatedby,
            SKUcreateddate: SKUcreateddate,
            SKUReportName:SKUReportName,
            SKUReportHash:SKUReportHash
    
        };
        SKUList.push(data);
    }
    res.send(SKUList);
});

//========================================================================================
//UPLOAD
//========================================================================================
app.post('/upload',jsonparser,function(req,res){
var report=[{
  path:'/uploads/'+req.body.fileName,
  content:Buffer.from(req.body.fileContent.data)
  }]

ipfs.add(report,function(err,files){
if(err){
  console.log(err)
}
else{
  res.send(files[0].hash)
}
})
});
//====================================================================================
//DOWNLOAD
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
//GET ALL EVENT LIST
//====================================================================================
app.get('/getEventDetails',jsonparser,function(req,res){
  res.setHeader('Content-type', 'application/json')
  var EventList=new Array;
  var adminEvents = AdminContractInstance.allEvents({fromBlock: 0, toBlock: 'latest'})
  adminEvents.get(function(adminError, adminLogs) {
  if (!adminError) {
    console.log("Capturing all Admin Contracts events ....");
    adminLogs.forEach(function(result) {

        var transactionHash = result.transactionHash;
        var blockNumber = result.blockNumber;
        var eventType = result.event;
        var category ="Admin Contract";
        var primary_id 
        var secondary_id 
        //var state  = rfqStatusEnum.get(parseInt(result.args.state)).key;
        var status="Failed";
        var additionalInfo = {};
//======================================================================================
//switch case
//======================================================================================
switch(eventType) {

  case "RegisterUserEvent":
      status="Successful";
      primary_id = "User_firstName-"+result.args.firstName;
      secondary_id = "User_lastName-"+result.args.lastName;
      additionalInfo = { pId:result.args.participantID,pType:participantTypeEnum.get(parseInt(result.args.participantType)).key }
      break;
  case "PondCreatedEvent":
  status="Successful";
  primary_id = "pondId-"+parseInt(result.args.pondID);
  secondary_id = "participantId-"+result.args.participantID;
  additionalInfo = {}
      break;
  case "SKUCreated":
  status="Successful";
  primary_id = "SKU_CODE-"+result.args.SKU_code;
  secondary_id = "SKU_reportName-"+result.args.SKU_ReportName;
  additionalInfo = {skuIndex:result.args.SKU_INDEX,skuReportHash:result.args.SKU_ReportHash }
  break;
  case "StorageUnitCreatedEvent":
  status="Successful";
  primary_id = "STRG_unitId-"+parseInt(result.args.storageUnitId);
  secondary_id = "STRG_unitName-"+result.args.storageUnitName;
  additionalInfo = {}
      break;
  default:
      additionalInfo = "Unknown event...";
}              
//======================================================================================
//======================================================================================
          var data = {
                    transactionHash:transactionHash,
                    blockNumber:blockNumber,
                    eventType:eventType,
                    category:category,
                    primary_id:primary_id,
                    secondary_id:secondary_id,
                    //state:state,
                    status:status,
                    additionalInfo:additionalInfo
                  };
                 console.log("nai bhai") 
                 EventList.push(data);
      });  
    }
   res.send(EventList) 
   });
     
})






