/**
Template Controllers

@module Templates
*/

/**
The view1 template

@class [template] views_view1
@constructor
*/
import './Admin_view.html';
import '../../components/Production/Production_createSaleable.js';

Template['Admin_view'].helpers({
    /**
    Get the name

    @method (name)
    */

  /*  'name': function(){
        return this.name || TAPi18n.__('dapp.view1.defaultName');
    }*/
});

// When the template is created
Template['Admin_view'].onCreated(function(){
	//Meta.setSuffix(TAPi18n.__("dapp.view1.title"));
});
