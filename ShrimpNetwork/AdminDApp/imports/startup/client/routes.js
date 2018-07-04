import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { Session } from 'meteor/session';

// Import needed templates
import '../../ui/layouts/body/body.js';
import '../../ui/layouts/header/header.js';
import '../../ui/layouts/footer/footer.js';
import '../../ui/pages/views/Dashboard_view.js';
import '../../ui/pages/views/Admin_view.js';
import '../../ui/pages/views/PondCreate_view.js';
import '../../ui/pages/not-found/not-found.js'

//import '../../ui/layouts/header/loginheader.js';
import '../../ui/pages/views/Events_view.js';

// Set up all routes in the app

FlowRouter.route('/admin', {
  name: 'App.admin',
  triggersEnter: [function (context, redirect) {
  }],
  action() {
    BlazeLayout.render('App_body', { top: 'header', main: 'Admin_view', footer: 'footer' });
  },
});


FlowRouter.route('/events', {
   name: 'App.events',
  /* triggersEnter: [function (context, redirect) {
   }],*/
   action() {
   BlazeLayout.render('App_body', { top: 'header', main: 'Events_view', footer: 'footer' });
   },
 });


FlowRouter.route('/', {
  name: 'App.home',
  triggersEnter: [function (context, redirect) {
    // if(!Session.get("BuyerUserName"))
    redirect('/admin');
  }],
  action() {
    BlazeLayout.render('App_body', { top: 'header', main: 'Admin_view', footer: 'footer' });
  },
});

FlowRouter.route('/dashboard', {
  name: 'App.dashboard',
  triggersEnter: [function (context, redirect) {
    //if (!Session.get("BuyerUserName"))
    //redirect('/login');
  }],
  action() {
    BlazeLayout.render('App_body', { top: 'header', main: 'Dashboard_view', footer: 'footer' });
  },
});

FlowRouter.route('/createPond', {
  name: 'App.createPond',
  triggersEnter: [function (context, redirect) {
    // if(!Session.get("BuyerUserName"))
    //   redirect('/login');
  }],
  action() {
    BlazeLayout.render('App_body', { top: 'header', main: 'PondCreate_view', footer: 'footer' });
  },
});




FlowRouter.notFound = {
  action() {
    BlazeLayout.render('App_body', { top: 'header', main: 'App_notFound', footer: 'footer' });
  }
};
