import './user_shipment_update.html';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session'
var CONSIGNMENT_NO;
var package_id;
var shipmentResult = new ReactiveArray();
Template["components_user_shipment_update"].onCreated(function () {
  CONSIGNMENT_NO= FlowRouter.getQueryParam('CONSIGNMENT_NO')
  package_id= FlowRouter.getQueryParam('package_id')
  
    var template = this;
    TemplateVar.set(template, 'singleShipmentInfo', { resultSet: false });
});
Template['components_user_shipment_update'].helpers({
    "getShipmentResult": function () {
         return shipmentResult.list();
        }
});
Template['components_user_shipment_update'].onRendered(function () {
    var template = this;
    shipmentResult.clear();
    TemplateVar.set(template, 'singleShipmentInfo', { resultSet: true });
    Meteor.call('getShipment', CONSIGNMENT_NO, function (error, result) {
        if (result) {
              shipmentResult.push(result);
             }
        return shipmentResult.list();

    });

});

Template['components_user_shipment_update'].events({

       "submit form": function (event, template) {
        event.preventDefault();
        template.find("#updateShipmentStateBtn").disabled = true;
        State= template.find("#state").value;
             var data = {
             CONSIGNMENT_NO: CONSIGNMENT_NO,
             package_id: package_id,
             state:State
             };

            TemplateVar.set(template, 'state', { isMining: true });
            Meteor.call('updateShipment', data, function (error, result) {
            if (!error) {
                template.find("#updateShipmentStateBtn").disabled = false;
                TemplateVar.set(template, 'state', { isMined: true, shipmentStateEventText: result });
                }
                else {
                    TemplateVar.set(template, 'state', { isError: true });
                }
                template.find("#updateShipmentStateBtn").disabled = false;
           });
        }      
    })