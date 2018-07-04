import './deploy_procurement.html'
import { Meteor } from 'meteor/meteor';

Template['components_deploy_procurement'].events({
//=======================================================================================================
//DEPLOY ADMIN
//=======================================================================================================
"click #deployAdminBtn": function(event, template){ 
	template.find("#deployAdminBtn").disabled=true;
	
		TemplateVar.set(template,'state', {isMining: true});
		console.log("####")
		Meteor.call('deployAdmin',function(error, result){
		if (!error) 
		{
			console.log(result)

			template.find("#deployAdminBtn").disabled=false;
			
			if(typeof result !== 'undefined'){
				TemplateVar.set(template, 'state', {isMined: true, address: result});
			}
		}

		template.find("#deployAdminBtn").disabled=false;
		
	});
},



//=======================================================================================================
//DEPLOY PROCUREMENT
//=======================================================================================================
"click #deployProcurementBtn": function(event, template){ 
	template.find("#deployProcurementBtn").disabled=true;
	
		TemplateVar.set(template,'state', {isMining: true});
		console.log("####")
		Meteor.call('deployProcurement',function(error, result){
		if (!error) 
		{
			console.log(result)

			template.find("#deployProcurementBtn").disabled=false;
			
			if(typeof result !== 'undefined'){
				TemplateVar.set(template, 'state', {isMined: true, address: result});
			}
		}

		template.find("#deployProcurementBtn").disabled=false;
		
	});
},
//=====================================================================================================
//DEPLOY PRODUCTION
//=====================================================================================================
"click #deployProductionBtn": function(event, template){ 
	template.find("#deployProductionBtn").disabled=true;
	
		TemplateVar.set(template,'state', {isMining: true});
		console.log("####")
		Meteor.call('deployProduction',function(error, result){
		if (!error) 
		{
			console.log(result)

			template.find("#deployProductionBtn").disabled=false;
			
			if(typeof result !== 'undefined'){
				TemplateVar.set(template, 'state', {isMined: true, address: result});
			}
		}

		template.find("#deployProductionBtn").disabled=false;
		
	});
},
//==================================================================
//shipment
//==================================================================
"click #deployShipmentBtn": function(event, template){ 
	template.find("#deployShipmentBtn").disabled=true;
	
		TemplateVar.set(template,'state', {isMining: true});
		console.log("####")
		Meteor.call('deployShipment',function(error, result){
		if (!error) 
		{
			console.log(result)

			template.find("#deployShipmentBtn").disabled=false;
			
			if(typeof result !== 'undefined'){
				TemplateVar.set(template, 'state', {isMined: true, address: result});
			}
		}

		template.find("#deployShipmentBtn").disabled=false;
		
	});
},

});

