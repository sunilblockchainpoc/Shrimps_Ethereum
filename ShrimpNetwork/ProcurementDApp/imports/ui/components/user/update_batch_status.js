import './update_batch_status.html';

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session'

var batchNumber;
var batchResult = new ReactiveArray();

Template["components_update_batch_status"].onCreated(function () {
    
    var template = this;
    batchNumber=FlowRouter.getQueryParam("batchNumber");
    TemplateVar.set(template, 'singleBatchInfo', { resultSet: false });
});

Template['components_update_batch_status'].helpers({
    "getBatchResult": function () {
        return batchResult.list();
    }
});

Template['components_update_batch_status'].onRendered(function () {
    var template = this;
    batchResult.clear();
    TemplateVar.set(template, 'singleBatchInfo', { resultSet: true });
    Meteor.call('getBatch', batchNumber, function (error, result) {
        if (result) {
            if (result.length > 0) {
                for (var index = 0; index < result.length; index++) {
                    batchResult.push(result[index]);
                }

            }
        }
        return batchResult.list();
    });
});

Template['components_update_batch_status'].events({

    "submit form": function (event, template) {

        event.preventDefault();
        var reader = new FileReader();

        template.find("#updateBatchStateBtn").disabled = true;
        
        //var fileData=reader.readAsArrayBuffer(template.find("#reportFile").files[0]);
         reader.onload=function(event){
        
        var fileName=template.find("#reportFile").files[0].name
        console.log("fileName======================")
        console.log(fileName)
        console.log("fileName========================")
        var fileData=new Uint8Array(reader.result)
        batchState= template.find("#batchState").value;
        participantID= template.find("#participantID").value;

        if (parseInt(batchState) == 1) {

            var data = {
                batchNumber: batchNumber,
                participantID: participantID
            };
            TemplateVar.set(template, 'state', { isMining: true });
            Meteor.call('acknowledgedByFarmer', data, function (error, result) {
                if (!error) {
                    template.find("#updateBatchStateBtn").disabled = false;
                    return TemplateVar.set(template, 'state', { isMined: true, batchStateEventText: result });
                }
                else {
                    TemplateVar.set(template, 'state', { isError: true });
                }
                template.find("#updateBatchStateBtn").disabled = false;
            });
        }
        else {
            var data = {
                fileName:fileName,
                fileData:fileData,
                batchNumber: batchNumber,
                participantID: participantID,
                batchState: batchState
            };
            TemplateVar.set(template, 'state', { isMining: true });
            Meteor.call('updateBatchState', data, function (error, result) {
                if (!error) {
                    template.find("#updateBatchStateBtn").disabled = false;
                    return TemplateVar.set(template, 'state', { isMined: true, batchStateEventText: result });
                }
                else {
                    TemplateVar.set(template, 'state', { isError: true });
                }
                template.find("#updateBatchStateBtn").disabled = false;
            });
        }
     //=========================0nload
    }
    reader.readAsArrayBuffer(template.find("#reportFile").files[0]);
        //window.close();
    }
});