import { Mongo } from 'meteor/mongo';
import React from 'react';
import ViewModel from 'viewmodel-react';
import  {Template} from 'meteor/templating'
import './trackBy_ConsignmentNo.html';

ConsignmentTreeData = new Mongo.Collection('ConsignmentTreeData');
var allConsignment = new ReactiveArray(); 
var treeDetails = new ReactiveArray();
var itemDetails = new ReactiveArray();
var linearView = new ReactiveVar(false);

var temparatureDetails = new ReactiveArray(); 
var BatchID = new ReactiveVar() 

var instance;
var id;

//When the template is created
Template['components_tree_view'].onCreated(function(){
    instance = this;
    });
    

Template['components_tree_view'].onRendered(function(){
    allConsignment.clear();
    linearView = false;

	Meteor.call('getAllShipments',function(error,result){
	if (result) {
		if(result.length >0){
			for(var i=0;i<result.length;i++)
			{
				allConsignment.push((result[i]));
			}
		}
	}
	return allConsignment.list();
	});
})
Template['components_tree_view'].events({
    "click #btnTrackConsignment": function(event, temp){ 
    var template = Template.instance();
    linearView = false;
    var consignmentNo =temp.find("#consignmentNo").value;
    Meteor.call('trackByConsignmentNo',consignmentNo,function(error, result){
        //console.log(result[1])
        
        if (!error) {
            temp.find("#btnTrackConsignment").disabled=false;
                if(typeof result !== 'undefined'){
                    treeDetails = result[1]			
                    }
                }		
                temp.find("#btnTrackConsignment").disabled=false;
            });
        },


	"click .reportFilelink": function(event, template){
        var data = event.currentTarget.id;
		Meteor.call('downloadReport',data,function(error,result){
        if(error){
			console.log(error)
		}
        else {
			
			//fs.writeFileSync(__dirname+"/report.txt")
			var uri="data:"+ result['content-type'] +";base64," + result;
			var downloadLink=document.createElement("a")
		    downloadLink.href=uri;
		    downloadLink.download="report.txt";
			document.body.appendChild(downloadLink)
			downloadLink.click()
			document.body.removeChild(downloadLink)
			}
		})		
		},
          
});
Template['components_tree_view'].helpers({   
    consignmentTreeArgs: {
         "collection": ConsignmentTreeData,
         "subscription":'ConsignmentTreeData',
         "parent": "",
         "select": "",
         "openAll": true,
         "selectAll": false,
         "mapping": {
         "text": "name",
         "icon" :"",
         "aAttr": function(item) {}
         },
         "jstree": {
         "plugins": []
         },
         "events": { 
           "changed": function(e, item, data) {
            id=item[0]
            if(typeof  item[0] !== 'undefined'){
                
               console.log(item[0])
                TemplateVar.set(instance,'state', {treeLoaded: true});
                TemplateVar.set(instance,'state', {key: item[0]});
                instance.view.template.__helpers.get('populateDetails').call();
            }
         }
       },
    },
    
    "populateDetails": function() {
		
        //**var key = instance.view._templateVar.state.curValue.key
        //console.log(treeDetails)
       // console.log(TreeData.find({value:key}).fetch());
        itemDetails.clear();
        for (var k =0 ; k < treeDetails.length ;k++) {
            if(id===treeDetails[k]._id){
                if (treeDetails[k].value.label1 ==="Unit ID")
                    linearView = true;
                else
                    linearView = false;
                BatchID =  treeDetails[k].value.value12;
                var data = { label1 : treeDetails[k].value.label1,
                             label2 : treeDetails[k].value.label2,
                             label3 : treeDetails[k].value.label3,
                             label4 : treeDetails[k].value.label4,
                             label5 : treeDetails[k].value.label5,
                             label6 : treeDetails[k].value.label6,
                             label7 : treeDetails[k].value.label7,
                             value1 : treeDetails[k].value.value1,
                             value2 : treeDetails[k].value.value2,
                             value3 : treeDetails[k].value.value3,
                             value4 : treeDetails[k].value.value4,
                             value5 : treeDetails[k].value.value5,
                             value6 : treeDetails[k].value.value6,
                             value7 : treeDetails[k].value.value7,
                             value8 : treeDetails[k].value.value8,
                             value9 : treeDetails[k].value.value9,
                             value10 : treeDetails[k].value.value10,
                             value11: treeDetails[k].value.value11,
                             value12 : treeDetails[k].value.value12,
                             value13 : treeDetails[k].value.value13,
                             value14 : treeDetails[k].value.value14,
                             value15 : treeDetails[k].value.value15,
                             value16 : treeDetails[k].value.value16,
                             value17 : treeDetails[k].value.value17,
                             value18 : treeDetails[k].value.value18,
                             value19 : treeDetails[k].value.value19,
                             value20 : treeDetails[k].value.value20,
                             value21 : treeDetails[k].value.value21,
                             value22 : treeDetails[k].value.value22,
                             value23 : treeDetails[k].value.value23,
                             value24 : treeDetails[k].value.value24,
                             value25 : treeDetails[k].value.value25,
                             value26 : treeDetails[k].value.value26,
                             value27 : treeDetails[k].value.value27,
                             value28 : treeDetails[k].value.value28,
                             value29 : treeDetails[k].value.value29,
                             value30 : treeDetails[k].value.value30,
                             value31 : treeDetails[k].value.value31
							}
							itemDetails.push(data)
							break;
						}
							//itemDetails.push(data)
               // break;
            }
        
    },

    "getItemDetails" :function() {
        return itemDetails.list();

    },

    "getConsignmentList": function()
       {
           return allConsignment.list();
       },

       "getLinearView": function()
       {
           return linearView;
       },

       
    });
 
    