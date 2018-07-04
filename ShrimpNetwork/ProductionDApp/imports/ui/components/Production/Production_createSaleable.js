import './Production_createSaleable.html'
import { Meteor } from 'meteor/meteor';

var batchList = new ReactiveArray();
var SKUList = new ReactiveArray();

Template["components_Production_createSaleable"].onCreated(function (template) {

	var template = this;
	TemplateVar.set(template, 'batchInfo', { list: false });
	TemplateVar.set(template, 'SKUInfo', { resultSet: false });
});

Template['components_Production_createSaleable'].helpers({
	"getBatchList": function () {
		return batchList.list();
	},
	"getSKUdetails": function () {
		return SKUList.list();
	}
});

Template['components_Production_createSaleable'].onRendered(function () {
	var template = this;
	TemplateVar.set(template, 'batchInfo', { list: true });
	TemplateVar.set(template, 'SKUInfo', { resultSet: true });
	batchList.clear();
	SKUList.clear();
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

Template['components_Production_createSaleable'].events({
	"click #createSaleablebtn": function (event, template) {
		template.find("#createSaleablebtn").disabled = true;
		var SKU_code = template.find("#skucode").value;
		var BatchId = template.find("#batchNumber").value;
		var packageId = 0;
		var saleble_unit_createdby = template.find("#createdby").value;

		TemplateVar.set(template, 'state', { isMining: true });
		var data = {
			skucode: SKU_code,
			BatchId: BatchId,
			packageid: packageId,
			createdby: saleble_unit_createdby
		};
		console.log("createSaleable-Meteor invoke")
		Meteor.call('createSaleable', data, function (error, result) {
			if (!error) {
				template.find("#createSaleablebtn").disabled = false;
				console.log("createSaleable-Result")
				if (typeof result !== 'undefined') {
					console.log(result);
					if (result)
						TemplateVar.set(template, 'state', { isMined: true });
					else
						TemplateVar.set(template, 'state', { isError: true });
				}
			}
			template.find("#createSaleablebtn").disabled = false;
		});

	},
});
