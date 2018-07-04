import './Production_getPackagedetails.html'
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session'

var PACKAGEList = new ReactiveArray();
Template["components_Production_getPackagedetails"].onCreated(function (template) {
	var template = this;
	TemplateVar.set(template, 'PACKAGEInfo', { list: false });
});
Template['components_Production_getPackagedetails'].helpers({
	"getPackagedetails": function () {
		return PACKAGEList.list();
	}
});

Template['components_Production_getPackagedetails'].onRendered(function () {
	var template = this;

	TemplateVar.set(template, 'PACKAGEInfo', { list: true });
	PACKAGEList.clear();

	Meteor.call('getAllPACKAGE', function (error, result) {
		console.log(result)
		if (result) {
			console.log(result)
			if (result.length > 0) {
				for (var index = 0; index < result.length; index++) {
					PACKAGEList.push(result[index]);
					console.log(result[index])
				}
			}
		}
		console.log(PACKAGEList.list())
		return PACKAGEList.list();
	});
});