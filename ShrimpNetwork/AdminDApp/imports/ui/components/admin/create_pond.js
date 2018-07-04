import './create_pond.html'
import { Meteor } from 'meteor/meteor';

Template['components_create_pond'].events({

	"submit form": function (event, template) {
		
		event.preventDefault();
		template.find("#btnCreatePond").disabled = true;

		TemplateVar.set(template, 'state', { isMining: true });

		var data = {
			participantID: template.find("#participantID").value,
			name: template.find("#name").value,
			location: template.find("#location").value,
			description: template.find("#description").value,
		};

		Meteor.call('createPond', data, function (error, result) {

			if (!error) {
				template.find("#btnCreatePond").disabled = false;

				return TemplateVar.set(template, 'state', { isMined: true, pondEventText: result });
			}
			else {
				TemplateVar.set(template, 'state', { isError: true });
			}
			template.find("#btnCreatePond").disabled = false;

		});
	}
});
