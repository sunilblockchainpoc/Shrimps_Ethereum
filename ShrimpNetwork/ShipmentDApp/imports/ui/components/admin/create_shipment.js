import './create_shipment.html'
import { Meteor } from 'meteor/meteor';

var SaleableList = new ReactiveArray();

Template["components_create_shipment"].onCreated(function (template) {
	var template = this;
	TemplateVar.set(template, 'SaleableInfo', { list: false });
});
Template['components_create_shipment'].helpers({
	"SALEBLE_UNIT_ID": function () {
		return SaleableList.list();
	}
});

Template['components_create_shipment'].onRendered(function () {
	var template = this;
	TemplateVar.set(template, 'SaleableInfo', { list: true });
	SaleableList.clear();
       Meteor.call('getAllPACKAGE', function (error, result) {
			if (result) {
			if (result.length > 0) {
				for (var package_id = 0; package_id < result.length; package_id++) {
                    if(result[package_id].saleableUnitsArray.length>0){
					SaleableList.push({packageid:"pack"+(package_id+1)});
					}
				}
			}
		}
		return SaleableList.list();
	});
});

Template['components_create_shipment'].events({


	"click #createUserbtn": function (event, template) {
		template.find("#createUserbtn").disabled = true;
		var p_id=(template.find("#package_id").value).slice(4);
		var package_id = p_id
		var weight = template.find("#weight").value;
		var description = template.find("#description").value;
		var created_by = template.find("#created_by").value;

        TemplateVar.set(template, 'state', { isMining: true });
		var data = { package_id: package_id, weight: weight, description: description, created_by: created_by };
		Meteor.call('createShipment', data, function (error, result) {
			if (!error) {
				template.find("#createUserbtn").disabled = false;

				if (typeof result !== 'undefined') {
					if (result)
						TemplateVar.set(template, 'state', { isMined: true });
					else
						TemplateVar.set(template, 'state', { isError: true });
				}
			}
			template.find("#createUserbtn").disabled = false;
		});
	},

});
