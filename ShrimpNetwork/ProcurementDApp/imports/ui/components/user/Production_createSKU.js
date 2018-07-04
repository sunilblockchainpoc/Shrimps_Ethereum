import './Production_createSKU.html'
import { Meteor } from 'meteor/meteor';

Template['components_Production_createSKU'].events({
	"click #createSKUbtn": function (event, template) {
    var reader=new FileReader();

        
		template.find("#createSKUbtn").disabled = true;

		reader.onload=function(event){

        var fileName=template.find('#reportFile').files[0].name;
		var fileData=new Uint8Array(reader.result)
		var SKU_code = template.find("#SKUcode").value;
		var SKU_size = template.find("#SKUsize").value;
		var prawn_type = template.find("#prawntype").value;
		var description = template.find("#description").value;
		var SKU_createdby = template.find("#SKUcreatedby").value;

		TemplateVar.set(template, 'state', { isMining: true });
		var data = {
			fileName:fileName,
			fileData:fileData,
			SKUcode: SKU_code,
			SKUsize: SKU_size,
			prawntype: prawn_type,
			description: description,
			SKUcreatedby: SKU_createdby
		};
		console.log(data)
		console.log("createSKU invoke")
		Meteor.call('createSKU', data, function (error, result) {
			if (!error) {
				template.find("#createSKUbtn").disabled = false;
				console.log("createSKU-Result")
				if (typeof result !== 'undefined') {
					console.log(result);
					if (result)
						TemplateVar.set(template, 'state', { isMined: true });
					else
						TemplateVar.set(template, 'state', { isError: true });
				}
			}
			template.find("#createSKUbtn").disabled = false;
		});
	}
   reader.readAsArrayBuffer(template.find('#reportFile').files[0])
},

        
		
});







