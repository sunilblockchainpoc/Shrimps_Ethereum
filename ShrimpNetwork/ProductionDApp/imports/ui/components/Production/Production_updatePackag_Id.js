import './Production_updatePackag_Id.html'
import { Meteor } from 'meteor/meteor';

var saleableunitId;
Template["components_Production_updatePackag_Id"].onCreated(function (template) {
	 saleableunitId=FlowRouter.getQueryParam("saleableunitid")
	var template = this;
TemplateVar.set(template, 'SaleableInfo', { list: false });
})

Template['components_Production_updatePackag_Id'].helpers({
	"getsaleableunitId": function () {
		return saleableunitId;
	}
});

Template['components_Production_updatePackag_Id'].events({
	"click #updatePackag_Idbtn": function (event, template) {
		template.find("#updatePackag_Idbtn").disabled = true;
		var SalebleUnitId = template.find("#saleableunitid").value;
		var packageId = template.find("#packageid").value;
		TemplateVar.set(template, 'state', { isMining: true });
		var data = { saleableunitid: SalebleUnitId,
			 packageid: packageId };
		console.log("updatePackag_Id-Meteor invoke")

		Meteor.call('updatePackag_Id', data, function (error, result) {
			if (!error) {
				template.find("#updatePackag_Idbtn").disabled = false;
				console.log("updatePackag_Id-Result")
				if (typeof result !== 'undefined') {
					console.log(result);
					if (result)
						TemplateVar.set(template, 'state', { isMined: true });
					else
						TemplateVar.set(template, 'state', { isError: true });
				}
			}
			template.find("#updatePackag_Idbtn").disabled = false;
		});
	},
});
