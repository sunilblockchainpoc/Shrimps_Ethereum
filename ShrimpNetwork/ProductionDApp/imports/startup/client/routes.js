import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { Session } from 'meteor/session';

// Import needed templates
import '../../ui/layouts/body/body.js';
import '../../ui/layouts/header/header.js';
import '../../ui/layouts/header/loginheader.js';
import '../../ui/layouts/footer/footer.js';
import '../../ui/pages/views/Admin_view.js';
import '../../ui/pages/views/Events_view.js';
import '../../ui/pages/views/Saleable_view.js';
//import '../../ui/pages/views/SKU_view.js';
import '../../ui/pages/views/Package_view.js';
import '../../ui/pages/views/Update_view.js';
import '../../ui/pages/views/Details_view.js';
import '../../ui/pages/not-found/not-found.js';


// Set up all routes in the app

FlowRouter.route('/admin', {
  name: 'App.admin',
  triggersEnter: [function(context, redirect) {
  }],
  action() {
    BlazeLayout.render('App_body', { top:'header', main: 'Admin_view', footer:'footer' });
  },
});


// FlowRouter.route('/events', {
//   name: 'App.events',
//   triggersEnter: [function(context, redirect) {
//   }],
//   action() {
//     BlazeLayout.render('App_body', { top:'header', main: 'Events_view', footer:'footer' });
//   },
// });




FlowRouter.route('/createSaleableUnit', {
  name: 'App.Saleable',
  triggersEnter: [function(context, redirect) {
  }],
  action() {
    BlazeLayout.render('App_body', { top:'header', main: 'Saleable_view', footer:'footer' });
  },
});


FlowRouter.route('/createPackage', {
  name: 'App.Package',
  triggersEnter: [function(context, redirect) {
  }],
  action() {
    BlazeLayout.render('App_body', { top:'header', main: 'Package_view', footer:'footer' });
  },
});

FlowRouter.route('/updatePackageID', {
  name: 'App.Update',
  triggersEnter: [function(context, redirect) {
  }],
  action() {
    BlazeLayout.render('App_body', { top:'header', main: 'Update_view', footer:'footer' });
  },
});


FlowRouter.route('/dashboard', {
  name: 'App.Details',
  triggersEnter: [function(context, redirect) {
  }],
  action() {
    BlazeLayout.render('App_body', { top:'header', main: 'Details_view', footer:'footer' });
  },
});

FlowRouter.route('/', {
  name: 'App.home',
  triggersEnter: [function(context, redirect) {
    //if(!Session.get("BuyerUserName"))
      redirect('/admin');
  }],
  action() {
    BlazeLayout.render('App_body', { top:'header', main: 'Buyer_view', footer:'footer' });
  },
});

FlowRouter.notFound = {
  action() {
    BlazeLayout.render('App_body', { top: 'header', main: 'App_notFound', footer: 'footer' });
  }
};
  
