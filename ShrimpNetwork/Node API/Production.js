var Web3 = require('web3');
var request = require("request");
var express = require('express');
var bodyparser = require('body-parser')
var util = require('util')
var fs = require('fs')
var path = require('path')
var app = express()
var IPFS=require('ipfs-api')
var ipfs=new IPFS()
var jsonparser = bodyparser.json();
var Enum = require('enum');
app.set("json spaces", 0);
app.use(bodyparser.urlencoded());
app.use(bodyparser.json())
app.listen(4029)
console.log("listening to 4029 PRODUCTION.JS..................................")
var prawntypeEnum = new Enum({
    'SCAMPI': 0,
    'VANNAMAEI': 1,
    'BLACK_TIGER': 2
});

if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
}
else {
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}
const input = JSON.parse(fs.readFileSync('./config/config.json', 'utf8'));
const ABIPath = input.Productionabipath;
const ByteCodePath = input.Productionbytecodepath;
var ContractAddress = input.ProductionContractAddress;
const ContractABI = JSON.parse(fs.readFileSync(ABIPath, 'utf8'));
const ContractByteCode = fs.readFileSync(ByteCodePath, 'utf8');
var ContractInstance = web3.eth.contract(ContractABI).at(ContractAddress);

//=====================================================================================
//============================================================================================

//===========================================================================================
//upload&download
//==========================================================================================
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
//===========================================================================================  
//======================================================================================
//createSaleable

app.post('/createSaleable', jsonparser, function (req, res) {
    web3.personal.unlockAccount(web3.eth.coinbase, "admin")
    var SKU_code = req.body.skucode;
    var BatchId = req.body.BatchId;
    var packageId = req.body.packageid;
    var saleble_unit_createdby = req.body.createdby;
    //var saleble_unit_createddate = req.body.createddate;
    var saleble_unit_createddate = Number(new Date());

    //TransactionObject

    var transactionObject = {
        data: '0x' + ContractByteCode,
        from: web3.eth.coinbase, // account address
        gasPrice: web3.eth.gasPrice,
        gas: 8000000
    };

    ContractInstance.createSaleable.sendTransaction(
        SKU_code, BatchId, packageId, saleble_unit_createdby, saleble_unit_createddate, transactionObject, function (err, result) {
            if (err) {
                console.log(err);
            }
            else {
                var SaleableUnitCreated = ContractInstance.SaleableUnitCreated()
                SaleableUnitCreated.watch(function (error, result) {
                    if (error) {
                        console.log(error)
                    }
                    else {
                        res.send(JSON.stringify("SALEBLE_UNIT_ID:" + result.args.SALEBLE_UNIT_ID + "SKU_Code:" + result.args.SKU_code + "BatchId:" + result.args.BatchId))
                        SaleableUnitCreated.stopWatching();
                    }
                });
            }
        });
});

//=======================================================================================

//getSaleable(get method)

app.get('/SALEBLE_UNIT_ID', jsonparser, function (req, res) {
    web3.personal.unlockAccount(web3.eth.coinbase, "admin")
    var SALEBLE_UNIT_ID = req.query.saleableunitid;
    res.setHeader('Content-type', 'application/json')
    var details = ContractInstance.getSaleable(SALEBLE_UNIT_ID);
    res.send(details);
})
app.get('/getAllSaleable', jsonparser, function (req, res) {
    res.setHeader('Content-type', 'application/json')
    var SaleableList = new Array();
    var SaleableCount = ContractInstance.getSaleableUnitCount();
    for (var index = 0; index < SaleableCount; index++) {
        var SaleableDetails = ContractInstance.getSaleable(index);
        var saleableunitid=index;
        var skucode = SaleableDetails[0];
        var BatchId = SaleableDetails[1];
        var packageid = parseInt(SaleableDetails[2]);
        var createdby = SaleableDetails[3];
     
        var createddate = (new Date(Number(SaleableDetails[4]))).getDate() + "-" + (new Date(Number(SaleableDetails[4]))).getMonth() + "-" + (new Date(Number(SaleableDetails[4]))).getFullYear() + " " + (new Date(Number(SaleableDetails[4]))).getHours() + ":" + (new Date(Number(SaleableDetails[4]))).getMinutes()
        var data = {
            saleableunitid:saleableunitid,
            skucode: skucode,
            BatchId: BatchId,
            packageid: packageid,
            createdby: createdby,
            createddate: createddate
        };
        console.log(data);
        SaleableList.push(data);
    }
    res.send(SaleableList);
});

app.get('/getSaleableUnitCount', jsonparser, function (req, res) {
    web3.personal.unlockAccount(web3.eth.coinbase, "admin")
    var SALEBLE_UNIT_ID = req.query.saleableunitid;
    res.setHeader('Content-type', 'application/json')
    var details = ContractInstance.getSaleableUnitCount();
    res.send(details);
})

//======================================================================================
//updatePackag_Id

app.post('/updatePackag_Id', jsonparser, function (req, res) {
    web3.personal.unlockAccount(web3.eth.coinbase, "admin")
    var SalebleUnitId = req.body.saleableunitid;
    var packageId = req.body.packageid;
    var UpdatePackageId = ContractInstance.UpdatePackageId()

    //TransactionObject

    var transactionObject = {
        data: '0x' + ContractByteCode,
        from: web3.eth.coinbase, // account address
        gasPrice: web3.eth.gasPrice,
        gas: 8000000
    };

    ContractInstance.updatePackag_Id.sendTransaction(
        SalebleUnitId, packageId, transactionObject, function (err, result) {
            if (err) {
                console.log(err);
            }
            else {
                UpdatePackageId.watch(function (error, result) {
                    if (error) {
                        console.log("error")
                        console.log(error)
                    }
                    else {
                        res.send(JSON.stringify(result.args.message + "packageId:" + result.args.packageId));
                        UpdatePackageId.stopWatching();
                    }
                });
            }
        })
});
