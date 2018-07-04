import './ShowMoreBatchDetails.html'
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
var fs=require('fs')

var moreBatchDetails = new ReactiveArray();
var batchNumber;
var hash;
var name;
Template["components_Show_more_batch_details"].onCreated(function (template) {
	batchNumber=FlowRouter.getQueryParam("batchNumber")
	var template = this;
	TemplateVar.set(template, 'moreBatchInfo', { list: false });
});

Template['components_Show_more_batch_details'].helpers({
	"getMoreBatchDetail": function () {
		return moreBatchDetails.list();
	}
});

Template['components_Show_more_batch_details'].events({

	"click #reportFile": function(event, template){
		Meteor.call('downloadReport',hash,function(error,result){
        if(error){
			console.log(error)
		}
        else {
			
			//fs.writeFileSync(__dirname+"/report.txt")
			var uri="data:"+ result['content-type'] +";base64," + result;
			var downloadLink=document.createElement("a")
			downloadLink.href=uri;
			name=name.split(".")
			name=name[0]
		    downloadLink.download=name+".txt";
			document.body.appendChild(downloadLink)
			downloadLink.click()
			document.body.removeChild(downloadLink)
			}
		})		
		},
	
		
});
Template['components_Show_more_batch_details'].onRendered(function () {
	var template = this;
	TemplateVar.set(template, 'moreBatchInfo', { list: true });
	moreBatchDetails.clear();
	Meteor.call('getMoreBatchDetails',batchNumber, function (error, result) {
		if (result) {
			hash=result[0].reportHash
			name=result[0].reportName
			if (result.length > 0) {
				for (var index = 0; index < result.length; index++) {
					moreBatchDetails.push(result[index]);
				}
			
			}
		}
		return moreBatchDetails.list();
	});
});