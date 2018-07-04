/**
Template Controllers

@module Templates
*/

/**
The view1 template

@class [template] views_view1
@constructor
*/
import './BatchCreate_view.html';
import '../../components/user/create_batch.js';

Template['BatchCreate_view'].helpers({
    /**
    Get the name

    @method (name)
    */

  /*  'name': function(){
        return this.name || TAPi18n.__('dapp.view1.defaultName');
    }*/
});

// When the template is created
Template['BatchCreate_view'].onCreated(function(){
	//Meta.setSuffix(TAPi18n.__("dapp.view1.title"));
});
