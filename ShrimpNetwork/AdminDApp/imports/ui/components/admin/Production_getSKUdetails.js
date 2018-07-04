import './Production_getSKUdetails.html'
import { Meteor } from 'meteor/meteor';

var SKUList = new ReactiveArray();
Template["components_Production_getSKUdetails"].onCreated(function (template) {
	var template = this;
	TemplateVar.set(template, 'SKUInfo', { list: false });
});
Template['components_Production_getSKUdetails'].helpers({
	"getSKUdetails": function () {
		return SKUList.list();
	}
});
Template['components_Production_getSKUdetails'].onRendered(function () {
	var template = this;
	TemplateVar.set(template, 'SKUInfo', { list: true });
	SKUList.clear();
	Meteor.call('getAllSKU', function (error, result) {
		console.log(result)
		if (result) {
			console.log(result)
			if (result.length > 0) {
				for (var index = 0; index < result.length; index++) {
					SKUList.push(result[index]);
					console.log(result[index])
				}
			}
		}
		console.log(SKUList.list())
		return SKUList.list();
	});
});

Template['components_Production_getSKUdetails'].events({

"click .reportFile": function(event, template){
	console.log("iiiiiiiiiiiiiinnnnnnnnnnnnnnnn")
	var hash=event.currentTarget.id;
	console.log("hahahahah")
	console.log(hash)
	console.log("hahahahah")
	Meteor.call('downloadReport',hash,function(error,result){
	if(error){
		console.log(error)
	}
	else {
		console.log("in result of client download")
		console.log(result)
		//fs.writeFileSync(__dirname+"/report.txt")
		var uri="data:"+ result['content-type'] +";base64," + result;
		var downloadLink=document.createElement("a")
		downloadLink.href=uri;
		downloadLink.download="report.txt";
		document.body.appendChild(downloadLink)
		downloadLink.click()
		document.body.removeChild(downloadLink)
		}
	})		
	},
})
