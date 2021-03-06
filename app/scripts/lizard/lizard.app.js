Backbone.Collection.prototype.move = function(model, toIndex) {
  var fromIndex = this.indexOf(model);
  if (fromIndex === -1) {
    throw new Error("Can't move a model that's not in the collection");
  }
  if (fromIndex !== toIndex) {
    this.models.splice(toIndex, 0, this.models.splice(fromIndex, 1)[0]);
    this.trigger('sort', this);
  }
};

Backbone.Collection.prototype.parse = function(response){
  return response.results;
};

Proj4js.defs["EPSG:28992"]= "+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +towgs84=565.417,50.3319,465.552,-0.398957,0.343988,-1.8774,4.0725 +units=m +no_def";
// Define Lizard namespace
Lizard = {};

Lizard.geo = {};
Lizard.geo.Layers = {};
Lizard.geo.Popups = {};

Lizard.ui = {};
Lizard.ui.Widgets = {};

Lizard.data = {};
Lizard.data.Dummy = {};

Lizard.Map = {};

Lizard.Collections = {};
Lizard.Models = {};

// Instantiate the Application()
Lizard.App = new Backbone.Marionette.Application();

// Add regions for Lizards main interface (menu + content)
Lizard.App.addRegions({
  content: '#content',
  hidden: '#hidden'
});


Lizard.App.on('initialize:before', function() {
  account = new Lizard.Models.Account();
  account.fetch({
    error: function(){
    $('#iecrossdomain').modal();
  },
  success: function(model){
      if (!model.get('authenticated')) {
        $('.top-right').notify({
          type: 'warning',
          message: {text: 'U bent niet ingelogd.'},
          fadeOut: {enabled: true, delay: 6000}
        }).show();
      }
    }
  });

  Lizard.App.on('initialize:after', function() {
    

    $.getJSON(settings.version_url, function(json) {
      $('span#APIVersionNumber').html(json.version);
    });
    $('span#webclientVersionNumber').html(settings.webclient_version);
  });

  workspaceCollection = new Lizard.Collections.Workspace();
  workspaceCollection.fetch();

  currentStatus = new Lizard.Models.CurrentState();
  liveFeedCollection = new Lizard.Collections.LiveFeed();

  Lizard.data.Dummy.livefeed = [[
      new Lizard.Models.LiveFeed({
        icon:'icon-bell',
        href: '#map/4.865505695343018,52.10075209542472,16/11',
        title: 'Alarm: hoge waterstand in dijk',
        text: 'hoge waterstand, alarm met urgentie hoog',
        time: 'vandaag 12:55'
      }),
      new Lizard.Models.LiveFeed({
        icon:'icon-bell',
        href: '#map/4.865505695343018,52.10075209542472,16/11',
        title: 'Alarm: hoge waterstand in dijk',
        text: 'hoge waterstand, alarm met urgentie middel',
        time: 'vandaag 12:00'
      }),
      new Lizard.Models.LiveFeed({
        icon:'icon-info-sign',
        href: '#',
        title: 'Storing',
        text: '5 warmte sensoren in de Grechtdijk zijn in storing',
        time: 'gisteren'
      }),
      new Lizard.Models.LiveFeed({
        icon:'icon-comment',
        href: '#',
        title: 'Gepland onderhoud sensoren',
        text: 'Komende 24 uur zijn 5 warmte sensoren in de Grechtdijk in onderhoud',
        time: 'gisteren'
      }),
      new Lizard.Models.LiveFeed({
        icon:'icon-comment',
        href: '#',
        title: 'Dijk inspectie',
        text: 'Grechtdijk geinspecteerd, geen bijzonderheden',
        time: 'maandag'
      }),
      new Lizard.Models.LiveFeed({
        icon:'icon-globe',
        href: '#',
        title: 'Nieuwe sensoren',
        text: 'Er zijn 8 nieuwe sensoren van Alert Solutions geinstalleerd',
        time: 'vrijdag'
      })
    ]];

  liveFeedCollection.add(Lizard.data.Dummy.livefeed);
});

// Start Backbone's url router
Lizard.App.on('initialize:after', function() {
  var loginView = new Lizard.Views.Menu({
    model: account
  });

  Backbone.history.start();
});
