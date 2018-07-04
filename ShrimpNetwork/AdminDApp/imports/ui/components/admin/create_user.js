import './create_user.html'
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session'

Template['components_create_user'].events({

	"submit form": function (event, template) {
		
		event.preventDefault();
		template.find("#createUserbtn").disabled = true;

		TemplateVar.set(template, 'state', { isMining: true });
		var data = {
			participantID: template.find("#participantID").value,
			participantType: template.find("#participantType").value,
			firstName: template.find("#firstName").value,
			lastName: template.find("#lastName").value,
			description: template.find("#description").value,
			publicKey: template.find('#publicKey').value,
			email: template.find("#email").value,
			phone: template.find("#phone").value
		};
		Meteor.call('createUser', data, function (error, result) {
			if (!error) {
				template.find("#createUserbtn").disabled = false;

				if (typeof result !== 'undefined') {
					if (result) {
						TemplateVar.set(template, 'state', { isMined: true, userEventText: result });
					}
					else
						TemplateVar.set(template, 'state', { isError: true });
				}
			}
			template.find("#createUserbtn").disabled = false;
		});
	}
});
