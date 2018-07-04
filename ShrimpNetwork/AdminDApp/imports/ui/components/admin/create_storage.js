import './create_storage.html'


import { Meteor } from 'meteor/meteor';

Template['components_createstorage'].events({

	"click #createSTORAGEbtn": function (event, template) {
		
		event.preventDefault();
		template.find("#createSTORAGEbtn").disabled = true;

		TemplateVar.set(template, 'state', { isMining: true });

		var data = {
			storageUnitName: template.find("#storageUnitName").value,
			storageUnitCapacity: template.find("#storageUnitCapacity").value,
			storageUnitLocation: template.find("#storageUnitLocation").value
			
		};

		Meteor.call('createStorageUnit', data, function (error, result) {

			if (!error) {
				template.find("#createSTORAGEbtn").disabled = false;

				return TemplateVar.set(template, 'state', { isMined: true, pondEventText: result });
			}
			else {
				TemplateVar.set(template, 'state', { isError: true });
			}
			template.find("#createSTORAGEbtn").disabled = false;

		});
	}
});
