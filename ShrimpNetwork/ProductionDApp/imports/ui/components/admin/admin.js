import './admin.html'
import { Meteor } from 'meteor/meteor';

Template['components_admin'].events({


"click #createProductionbtn": function(event, template){ 
	template.find("#createProductionbtn").disabled=true;
	
		TemplateVar.set(template,'state', {isMining: true});
		console.log("####")
		Meteor.call('deployProduction',function(error, result){
		if (!error) 
		{
			console.log("----")

			template.find("#createProductionbtn").disabled=false;
			
			if(typeof result !== 'undefined'){
				TemplateVar.set(template, 'state', {isMined: true, address: result});
			}
		}

		template.find("#createProductionbtn").disabled=false;
		
	});
}
});
