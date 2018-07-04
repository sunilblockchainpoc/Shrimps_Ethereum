import './Production_SALEBLE_UNIT_ID.html'
import { Meteor } from 'meteor/meteor';

var SaleableList = new ReactiveArray();
Template["components_Production_SALEBLE_UNIT_ID"].onCreated(function (template) {
	var template = this;
	TemplateVar.set(template, 'SaleableInfo', { list: false });
});
Template['components_Production_SALEBLE_UNIT_ID'].helpers({
	"SALEBLE_UNIT_ID": function () {
		return SaleableList.list();
	}
});

Template['components_Production_SALEBLE_UNIT_ID'].onRendered(function () {
	var template = this;
	TemplateVar.set(template, 'SaleableInfo', { list: true });
	SaleableList.clear();

	Meteor.call('getAllSaleable', function (error, result) {
		console.log("++++++++++++++++++++++++++++++++++++++ss")
		console.log(result)
		if (result) {
			console.log(result)
			if (result.length > 0) {
				for (var saleableunitid = 0; saleableunitid < result.length; saleableunitid++) {
					SaleableList.push(result[saleableunitid]);
					console.log("++++++++++++++++++++++++++++++++++++++ss")
					console.log(result[saleableunitid])
					console.log("++++++++++++++++++++++++++++++++++++++ss")
				}
			}
		}
		console.log(SaleableList.list())
		return SaleableList.list();
	});
});