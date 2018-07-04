import './Production_createPackage.html'
import { Meteor } from 'meteor/meteor';

Template['components_Production_createPackage'].events({
	"click #createPackagebtn": function (event, template) {
		template.find("#createPackagebtn").disabled = true;
		var Quantity = template.find("#Quantity").value;
		var packaging_createdby = template.find("#packagingcreatedby").value;

		TemplateVar.set(template, 'state', { isMining: true });
		var data = {
			Quantity: Quantity,
			packagingcreatedby: packaging_createdby
		};
		console.log("createPackage-Meteor invoke")

		Meteor.call('createPackage', data, function (error, result) {
			if (!error) {
				template.find("#createPackagebtn").disabled = false;
				console.log("createPackage-Result")
				if (typeof result !== 'undefined') {
					console.log(result);
					if (result)
						TemplateVar.set(template, 'state', { isMined: true });
					else
						TemplateVar.set(template, 'state', { isError: true });
				}
			}
			template.find("#createPackagebtn").disabled = false;
		});
	},
});
