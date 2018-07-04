import './dashboard.html';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

var batchList = new ReactiveArray();

Template["components_dashboard"].onCreated(function (template) {

	var template = this;
	TemplateVar.set(template, 'batchInfo', { list: false });
});

Template['components_dashboard'].helpers({
	"getBatchList": function () {
		return batchList.list();
	}
});

Template['components_dashboard'].onRendered(function () {
	var template = this;
	TemplateVar.set(template, 'batchInfo', { list: true });
	batchList.clear();
	Meteor.call('getAllBatches', function (error, result) {
		if (result) {
			if (result.length > 0) {
				for (var index = 0; index < result.length; index++) {
					batchList.push(result[index]);
				}
			
			}
		}
		return batchList.list();
	});
});