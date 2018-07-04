import './ponds_available.html'
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session'

var pondList = new ReactiveArray();

Template["components_ponds_available"].onCreated(function (template) {

	var template = this;
	TemplateVar.set(template, 'pondInfo', { list: false });
});

Template['components_ponds_available'].helpers({
	"getPondList": function () {
		return pondList.list();
	}
});

Template['components_ponds_available'].onRendered(function () {
	var template = this;
	TemplateVar.set(template, 'pondInfo', { list: true });
	pondList.clear();
	Meteor.call('getAllPonds', function (error, result) {
		if (result) {
			if (result.length > 0) {
				for (var index = 0; index < result.length; index++) {
					pondList.push(result[index]);
				}
			
			}
		}
		return pondList.list();
	});
});