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
import '../../components/admin/deploy_procurement.js';
import '../../components/admin/ponds_available.js';
import '../../components/admin/create_user.js';
import '../../components/admin/create_pond.js';
import '../../components/admin/Production_createSKU.js';
import '../../components/admin/create_storage.js';





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
