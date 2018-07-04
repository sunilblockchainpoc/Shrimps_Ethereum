import './create_batch.html';
import { Meteor } from 'meteor/meteor';

Template['components_create_batch'].events({

    "submit form": function (event, template) {
        
        event.preventDefault();
		template.find("#btnCreateBatch").disabled = true;

        var data = {

            batchNumber: template.find("#batchNumber").value,
            submittedBy: template.find("#submittedBy").value,
            batchSize: template.find("#batchSize").value,
            batchDescription: template.find("#batchDescription").value,
            prawnType: template.find("#prawnType").value,
            createdBy: template.find("#createdBy").value,
            minimumTemperature:template.find("#minimumTemperature").value,
            maximumTemperature:template.find("#maximumTemperature").value,
            storageUnit:template.find("#storageUnit").value
        };
        console.log(data)

        TemplateVar.set(template, 'state', { isMining: true });
        Meteor.call('createBatch', data, function (error, result) {
            if (!error) {
                template.find("#btnCreateBatch").disabled = false;

                return TemplateVar.set(template, 'state', { isMined: true, batchEventText: result });
            }
            else {
                TemplateVar.set(template, 'state', { isError: true });
            }
            template.find("#btnCreateBatch").disabled = false;
        });
    },
});