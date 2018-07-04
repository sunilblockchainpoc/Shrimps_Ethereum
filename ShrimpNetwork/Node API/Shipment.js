var Web3 = require('web3');
var request = require("request");
var express = require('express');
var bodyparser = require('body-parser')
var util = require('util')
var fs = require('fs')
var path = require('path')
var app = express()
app.use(bodyparser.urlencoded())
var Enum = require('enum');
var jsonparser = bodyparser.json();
app.set("json spaces", 0);
app.use(bodyparser.json())
app.listen(3888);
console.log("LISTENING TO PORT 3888 SHIPMENT.JS......................")

var participantTypeEnum = new Enum({
    'SUBMITTED': 0,
    'RECEIVED_OK': 1,
    'SPOILED': 2,
});
if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
} else {
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}

const input = JSON.parse(fs.readFileSync('./config/config.json', 'utf8'));
const ABIPath = input.Shipmentabipath;
const ByteCodePath = input.Shipmentbytecodepath;
var ContractAddress = input.ShipmentContractAddress;
const ContractABI = JSON.parse(fs.readFileSync(ABIPath, 'utf8'));
const ContractByteCode = fs.readFileSync(ByteCodePath, 'utf8');
var ContractInstance = web3.eth.contract(ContractABI).at(ContractAddress);
//==========================================================================================
//===========================================================================================
app.post('/createShipment', jsonparser, function (req, res) {
    console.log("create")
    web3.personal.unlockAccount(web3.eth.coinbase, "admin");
    var package_id = req.body.package_id;
    var weight = req.body.weight;
    var description = req.body.description;
    var created_by = req.body.created_by;
    var created_date = Number(new Date());
    // var created_date = req.body.created_date;
    var transactionObject = {
        data: '0x' + ContractByteCode,
        from: web3.eth.coinbase,    // account address
        gasPrice: web3.eth.gasPrice,
        gas: 8000000
    };
    var shipment_Created = ContractInstance.shipment_Created();
    ContractInstance.createShipping.sendTransaction(
        package_id, weight, description, created_by, created_date, transactionObject, function (err, result) {
            if (err) {
                console.log(err);
            }
            else {
                shipment_Created.watch(function (error, result1) {
                    if (!error) {
                        res.send(JSON.stringify(result1.args.CONSIGNMENT_NO + " " + result1.args.package_id + " " + result1.args.state))
                        shipment_Created.stopWatching();
                    }
                    else {
                        console.log(error)
                    }
                });
            }
        });
});

app.post('/updateShippingStatus', jsonparser, function (req, res) {
    web3.personal.unlockAccount(web3.eth.coinbase, "admin");
    var CONSIGNMENT_NO = parseInt(req.body.CONSIGNMENT_NO);
    var package_id = req.body.package_id;
    var state = parseInt(req.body.state);
    var shipment_Updated = ContractInstance.shipment_Updated();
    var transactionObject = {
        data: '0x' + ContractByteCode,
        from: web3.eth.coinbase,    // account address
        gasPrice: web3.eth.gasPrice,
        gas: 800000
    };

    ContractInstance.updateShippingStatus.sendTransaction(
        CONSIGNMENT_NO, package_id, state, transactionObject, function (err, result) {
            if (err) {
                console.log(err);
            }
            else {
                shipment_Updated.watch(function (error, result1) {
                    if (!error) {
                        res.send(JSON.stringify(result1.args.CONSIGNMENT_NO + " " + result1.args.package_id + " " + result1.args.state))
                        shipment_Updated.stopWatching();
                    }
                    else {
                        console.log(error)
                    }
                });
            }
        });
});
app.get('/getShipment', jsonparser, function (req, res) {
    web3.personal.unlockAccount(web3.eth.coinbase, "admin");
    console.log("unlocked")
    var consignment_no = req.query.CONSIGNMENT_NO;
    res.setHeader('Content-type', 'application/json')
    var Details = ContractInstance.getShippingdetails(consignment_no);
    var CONSIGNMENT_NO = Details[0];
    var package_id = Details[1]
    var weight = Details[2];
    var description = Details[3];
    var created_by = Details[4];
    var created_date = Details[5];
    var state = participantTypeEnum.get(parseInt(Details[6])).key
    var data = {
        CONSIGNMENT_NO: CONSIGNMENT_NO,
        package_id: package_id,
        weight: weight,
        description: description,
        created_by: created_by,
        created_date: created_date,
        state: state
    };
    res.send(data);
});
app.get('/getAllShipment', jsonparser, function (req, res) {
    res.setHeader('Content-type', 'application/json')
    var ShipmentList = new Array();
    var count = ContractInstance.count();
    for (var CONSIGNMENT_NO = 0; CONSIGNMENT_NO < count; CONSIGNMENT_NO++) {
        var Details = ContractInstance.getShippingdetails(CONSIGNMENT_NO);
        var CONSIGNMENT_NO = Details[0];
        var package_id = Details[1]
        var weight = Details[2];
        var description = Details[3];
        var created_by = Details[4];
        var created_date = (new Date(Number(Details[5]))).getDate() + "-" + (new Date(Number(Details[5]))).getMonth() + "-" + (new Date(Number(Details[5]))).getFullYear() + "-" + (new Date(Number(Details[5]))).getHours() + "-" + (new Date(Number(Details[5]))).getMinutes();
      
        var state = participantTypeEnum.get(parseInt(Details[6])).key
        var data = {
            CONSIGNMENT_NO: CONSIGNMENT_NO,
            package_id: package_id,
            weight: weight,
            description: description,
            created_by: created_by,
            created_date: created_date,
            state: state
        };
        ShipmentList.push(data);
    }
    res.send(ShipmentList);
});
//=======================================================================================
//getSKUCount(getmethod)
//no parameter

app.get('/getShipmentount', jsonparser, function (req, res) {
    web3.personal.unlockAccount(web3.eth.coinbase, "admin")
    console.log("unlocked")
    var consignment_no = req.query.CONSIGNMENT_NO;
    res.setHeader('Content-type', 'application/json')
    var details = ContractInstance.count();
    res.send(details);
})
