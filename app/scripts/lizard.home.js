Lizard.Home = {};

Lizard.Home.DefaultView = Backbone.Marionette.ItemView.extend({
  template: '#home-template',
  className: 'home'
});

Lizard.Home.Router = Backbone.Marionette.AppRouter.extend({
    appRoutes: {
      '': 'home'
    }
});

Lizard.Home.home = function(){
  console.log('Lizard.Home.home()');
  
  var homeView = new Lizard.Home.DefaultView();
  Lizard.content.show(homeView);
  Backbone.history.navigate('home');
};

Lizard.addInitializer(function(){
  Lizard.Home.router = new Lizard.Home.Router({
    controller: Lizard.Home
  });
  
  Lizard.vent.trigger('routing:started');
});