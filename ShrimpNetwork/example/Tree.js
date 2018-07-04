/*******************************************************************************

* GET COMPLETE DETAILS BASED ON BATCH ID *

******************************************************************************//*

batchResponse ==ALL BATCH DETAILS
farmer_response=all farmer details
pond_response=all pond information
shipping_response=all shipping information
unit_response=all saleable unit information
package_response=all package details
skuResponse=all sku deatils
//***************************************************************************** */
/*

BATCH0002

-POND1

-FARMER1

-SHIP1

- PACK1

- UNIT1 + SKU INFO

- UNIT2 + SKU INFO

- PACK2

- UNIT3 + SKU INFO

- UNIT4 + SKU INFO

*/


"getTreeData": 
function(params){
console.log("getTreeData")
// Fetch all batch details
try {
var populateValue = new Array();
var packageTreeInfo = new Array();
if (typeof params ==='undefined')
return ""
console.log("Track Batch - " +params.batchID)
var BATCH_GET_BY_ID = BATCH_GET_ALL + '/' + params.batchID//params.batchID
var batchResponse = HTTP.get(BATCH_GET_BY_ID)
console.log("\n\n\nRetrieved Batch Response successfully !!!\n\n\n")
// Get the status code
var return_code = batchResponse.statusCode
var output = JSON.parse(JSON.stringify(batchResponse));
var content = JSON.parse(output.content);
// Get the Procurer ID and append each ID
//console.log(content)
const PROCURER = content.batchCreatedBy.split('%23')[1].split('%7D')[0]
const FARMER = content.farmer.split('%23')[1].split('%7D')[0]
var 
batchCreatedDate = new Date(content.batchCreatedDate)
///////// 1. BATCH DETAILS ////////////////////////////////////
var batchID = content.batchID
var batchShrimpType = content.type
var batchSize = content.batchSize
var batchCreatedDate = batchCreatedDate.toISOString().slice(0,10)
var batchSize = content.batchSize
var batchProcuredBY = PROCURER
var batchSubmittedBY = FARMER
var batchStorageUnit = content.storageUnit
// Temparature update
var batchMinAcceptTemp = content.minAcceptedTemparature
var batchMaxAcceptTemp = content.maxAcceptedTemparature
var reportURL = "?name=" +content.antibioticReportName +
"&filehash=" +content.antibioticReportHash;
var labReportFilename = content.antibioticReportName
var batchStatus = content.state
var numOfPackages = content.package.length
var allPackageContent = content
/////// 0. FARMER DETAILS ///////////
var farmer_response = HTTP.get(FARMER_GET_ALL+ '/'+FARMER) ;
var farmerOutput = JSON.parse(JSON.stringify(farmer_response))
var farmerContent = JSON.parse(farmerOutput.content);
var farmerFname = farmerContent.firstName
var farmerLname = farmerContent.lastName
var farmerEmail = farmerContent.email
////////// 1. POND DETAILS ////////////////////////////////////////
//console.log("Fetch all information about pond")
var pond_response = HTTP.get(POND_GET_ALL) ;
var pondOutput = JSON.parse(JSON.stringify(pond_response))
var pondContent = JSON.parse(pondOutput.content);
var numPonds = pondContent.length
var pondID
var pondName
var Latitude
var Longitude
for (var a=0 ; a<numPonds ; a++ ) {
// Get the Procurer ID and append each ID
farmerID = pondContent[a].farmer.split('%23')[1].split('%7D')[0]
if (farmerID!=FARMER)
continue;
pondID = pondContent[a].pondID
pondName = pondContent[a].pondName
Latitude = pondContent[a].latitude
Longitude = pondContent[a].longitutde
}
////////// 2. PACKAGE DETAILS ////////////////////////////////////
var PACKAGE_ALL = REST_API_URL + 'Package';
var packageArray = new Array();
var unitTreeInfo;
for (var i=0 ; i < numOfPackages; i++) {
unitTreeInfo = new Array()
var packageID = allPackageContent.package[i].split('#')[1]
//console.log("Fetch all information about package "+ packageID)
var PACKAGE_URL = PACKAGE_ALL + '/' + packageID
//console.log(PACKAGE_URL)
// GET PACKAGE DATA
//console.log("\nRetrieve Package Information of Pack "+ packageID )
var package_response = HTTP.get(PACKAGE_URL) ;
//console.log("\nRetrieve Package Information of Pack "+ packageID + " success" )
var package_response_return_code = package_response.statusCode
var packOutput = JSON.parse(JSON.stringify(package_response))
var packContent = JSON.parse(packOutput.content);
var packCreateDate = packContent.packageCreatedDate
// Get the number of products inside each package
//console.log(package_response)
var unitInfo = JSON.parse(JSON.stringify(package_response.data.productIDs))
///// Retrieve Shipping Details /////////
var shipping_response = HTTP.get(SHIPMENT_GET_ALL) ;
var shipping_return_code = shipping_response.statusCode
var shipping_output = JSON.parse(JSON.stringify(shipping_response));
var shipping_content = JSON.parse(shipping_output.content);
var numship = shipping_content.length
var consignmnetNO
var shippingStatus
var shippingReqDate
var shippingReqBy
for (varu=0 ; u<numship ; u++ ) {
if (shipping_content[u].packageID !=packageID)
continue;
else {
var shipRequestedDate = new
Date(shipping_content[u].requestedDate)
consignmnetNO = shipping_content[u].consignmentNo
shippingStatus = shipping_content[u].statusshippingReqDate = 
shipRequestedDate.toISOString().slice(0,10)
shippingReqBy = shipping_content[u].requestedBy
break;

}
}
// GET SELLABLE UNIT's INFORMATION
for (varj=0 ; j<unitInfo.length ;j++ ) { 
// Product Array
var SELLABLE_UNIT_URL = REST_API_URL + 'SALEABLE_UNIT'+ '/' + unitInfo[j].split('#') [1];
// console.log("\nRetrieve Sellable unit Information of "+ unitInfo[j] )
var unit_response = HTTP.get(SELLABLE_UNIT_URL) ;
// console.log("\nRetrieve Sellable unit Information of "+ unitInfo[j] + " success" )
var output = JSON.parse(JSON.stringify(unit_response));
var content = JSON.parse(output.content);
var unitID = unitInfo[j].split('#') [1]
var skuCode = content.skuCode.split('%23')[1].split('%7D')[0]
var batch = content.batchID.split('%23')[1].split('%7D')[0]
var pack = content.packageID.split('%23')[1].split('%7D')[0]
var unitCreatedDate = newDate(content.createdDate).toISOString().slice(0,10)
var uintCreatedBy = content.createdBy

if (batch!=params.batchID)
continue;
//console.log("Pack value ======= "+pack +" "+packageID )
if (pack!=packageID)
continue;
////////// Get SKU DETAILS //////////////////////
SKU_BY_ID = SKU_GET_ALL +'/' + skuCode
//console.log("\nRetrieve SKU Information of "+ skuCode )
var skuResponse = HTTP.get(SKU_BY_ID )
//console.log("\nRetrieve SKU Information of "+ skuCode + " success" )
var skuOutput = JSON.parse(JSON.stringify(skuResponse))
var skuContent = JSON.parse(skuOutput.content);
var skuSize = skuContent.size
var skuDesc = skuContent.descriptionunitTreeInfo.push( {[unitID]:{}} )
unitTreeInfo.push({[unitID]:{}})
populateValue.push ( {
key:[unitID],
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
})
}

var data = { [packageID]: { Units: unitTreeInfo }}
populateValue.push ({key:[packageID],
label1 : "Package",
value1 : [packageID],
label2 : "Requested Date",
value2 : new Date(packCreateDate).toISOString().slice(0,10),
label3 : "Packed BY",
value3 : "ITC Foods",
label4 : "Packing Location",
value4 : "Bengaluru"
})
packageTreeInfo.push(data)
}
// Batch is associated with a single Pond and a Farmer
populateValue.push ({key:"Pond",
label1 : "Pond ID",
value1 : pondID,
label2 : "Pond Name",
value2 : pondName,
label3 : "Latitude",
value3 : Latitude,
label4 : "Longitude",
value4 : Longitude,
})
populateValue.push ({key:"Farmer",
label1 : "Farmer",
value1 : FARMER,
label2 : "First Name",
value2 : farmerFname,
label3 : "Last Name",
value3 : farmerLname,
label4 : "Email ",
value4 : farmerEmail,
})
populateValue.push ({key:batchID,
label1 : "Shrimp Type",
value1 : batchShrimpType,
label2 : "Batch size",
value2 : batchSize,
label3 : "Min Accepted Temparature",
value3 : batchMinAcceptTemp,
label4 : "Max Accepted Temparature",
value4 : batchMaxAcceptTemp,
label5 : "Storage Unit",
value5 : batchStorageUnit,
label6 : "Batch Creation Date",
value6 : batchCreatedDate,
label7 : "Procured By",
value7 : batchProcuredBY
})

var treeData = { Batches : { 
[batchID] : { 
Pond : pondID,
Farmer : farmerID,
Packages : packageTreeInfo
}}}
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
else if (name.startsWith("BATCH"))
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
if (name.startsWith("PACK"))
icon_file = "Detail_icon@3x.png"
else 
icon_file = "UnitDetail_icon@3x.png"
id = TreeData.insert({name,parent,icon:icon_file});
for (var t=0 ; t<populateValue.length;t++) {
if (name ==populateValue[t].key ) {
//console.log("MATCH KEY"+name)
//console.log("MATCH KEY VALUE "+populateValue[t])
//console.log(populateValue[t])
// Populate data for Unit Trace
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
// console.log(TreeData.find({}).fetch());
return [TreeData.find({}).fetch(),TreeValueData.find({}).fetch()]
}
catch (exp){
console.log(exp)
}
},
})




