import './user_dashboard.html';



import { Meteor } from 'meteor/meteor';

import { Session } from 'meteor/session'



var shipmentList = new ReactiveArray();



Template["components_user_dashboard"].onCreated(function (template) {



    var template = this;

    TemplateVar.set(template, 'shipmentInfo', { list: false });

});



Template['components_user_dashboard'].helpers({

    "getShipmentList": function () {

        return shipmentList.list();

    }

});



Template['components_user_dashboard'].onRendered(function () {

    var template = this;

    TemplateVar.set(template, 'shipmentInfo', { list: true });

    shipmentList.clear();

    Meteor.call('getAllShipments', function (error, result) {

        if (result) {

            if (result.length > 0) {

                for (var index = 0; index < result.length; index++) {

                    shipmentList.push(result[index]);

                }



            }

        }


        return shipmentList.list();

    });

})