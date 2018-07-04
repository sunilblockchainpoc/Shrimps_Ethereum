var Web3 = require('web3');
var request = require("request");
var express = require('express');
var bodyparser = require('body-parser')
var util = require('util')
var fs = require('fs')
var path = require('path')
var app = express()
var jsonparser = bodyparser.json();

app.set("json spaces", 0);
app.use(bodyparser.json())
app.listen(8889)
console.log("LISTENING TO PORT 8889 PACKAGING.JS.....................")
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

app.post('/createPackage', jsonparser, function (req, res) {
    web3.personal.unlockAccount(web3.eth.coinbase, "admin")
    console.log("unlocked")
    var Quantity = req.body.Quantity;
    var packaging_createdby = req.body.packagingcreatedby;
    var packaging_createddate = Number(new Date());
    var package_created = ContractInstance.PackageCreated();
    // Transaction object

    var transactionObject = {
        data: "0x" + ContractByteCode,
        from: web3.eth.coinbase,        // account address
        gasPrice: web3.eth.gasPrice,
        gas: 8000000
    };

    ContractInstance.createPackage.sendTransaction(
        Quantity, packaging_createdby, packaging_createddate, transactionObject, function (err, result) {
            if (err) {
                console.log(err);
            }
            else {
                package_created.watch(function (error, results) {
                    if (error) {
                        console.log(error)
                    }
                    else {
                        res.send(JSON.stringify("Package ID :" + results.args.PACKAGE_ID + " Quantity :" + results.args.Quantity));
                        package_created.stopWatching();
                    }
                });
            }
        });
});

app.get('/getPackagedetails', jsonparser, function (req, res) {
    web3.personal.unlockAccount(web3.eth.coinbase, "admin")
    var package_Id = req.query.index;
    res.setHeader('Content-type', 'application/json')
    var details = ContractInstance.getPackagedetails(package_Id);
    res.send(JSON.stringify(details));
});


app.get('/getAllPACKAGE', jsonparser, function (req, res) {
    res.setHeader('Content-type', 'application/json')
    var PACKAGEList = new Array();
    var PACKAGECount = ContractInstance.getPACKAGECount();
    for (var index = 1; index < PACKAGECount; index++) {
        var PACKAGEDetails = ContractInstance.getPackagedetails(index);
        var Quantity = PACKAGEDetails[0];
        var packagingcreatedby = PACKAGEDetails[1];
        var packagingcreateddate = (new Date(Number(PACKAGEDetails[2]))).getDate() + "-" + (new Date(Number(PACKAGEDetails[2]))).getMonth() + "-" + (new Date(Number(PACKAGEDetails[2]))).getFullYear() + " " + (new Date(Number(PACKAGEDetails[2]))).getHours() + ":" + (new Date(Number(PACKAGEDetails[2]))).getMinutes()
        var saleableUnitsArray=PACKAGEDetails[3];
        var data = {
            Quantity: Quantity,
            packagingcreatedby: packagingcreatedby,
            packagingcreateddate: packagingcreateddate,
            saleableUnitsArray:saleableUnitsArray
        };
        
        PACKAGEList.push(data);
    }
    res.send(PACKAGEList);
});

app.get('/getPACKAGECount', jsonparser, function (req, res) {
    web3.personal.unlockAccount(web3.eth.coinbase, "admin")
    var package_Id = req.query.index;
    res.setHeader('Content-type', 'application/json')
    var details = ContractInstance.getPACKAGECount();
    res.send(details);
})
