import { FlowRouter } from 'meteor/kadira:flow-router';
import './PondCreate_view.html';
import '../../components/admin/create_pond.js';
import { ReactiveVar } from 'meteor/reactive-var'

var rfqid = new ReactiveVar();
Template['PondCreate_view'].onCreated(function(){
    //Meta.setSuffix(TAPi18n.__("dapp.view1.title"));
     //rfqid = new ReactiveVar(FlowRouter.getParam("rfq"));
});

Template['PondCreate_view'].helpers({

   /*  getRFQId:function(){
      return rfqid.get();
    } */
  });
  