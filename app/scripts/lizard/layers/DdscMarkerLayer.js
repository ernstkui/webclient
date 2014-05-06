//  Class for locations of DDSC timeseries
//
//
Lizard.geo.Layers.DdscMarkerLayer = Lizard.geo.Layers.MapLayer.extend({
  markers: null,
  collection: null, //locationCollection,
  map: null,
  initialize: function(options) {
    this.collection = options.collection;
    this.map = options.map;

    this.markers = new L.MarkerClusterGroup({
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      maxClusterRadius: 10
    });

    // The collection is loaded and the scope "this" is bound to the
    // drawonMap function.
    var that = this;
    this.collection.fetch({
      success: _.bind(that.drawOnMap, that),
      error:function(data, response){
        console.log('Error this'+ response.responseText);
      }
    });
    this.addToMap();
  },
  addToMap: function() {
    this.map.mapCanvas.addLayer(this.markers);
  },
  removeFromMap: function() {
    this.map.mapCanvas.removeLayer(this.markers);
  },
  drawOnMap: function(collection, objects){
    var models = collection.models;
    var that = this;
    for (var i in models){
      var model = models[i];
      var attributes = model.attributes;
      var point = attributes.point_geometry;
      try {
          var leaflet_point = new L.LatLng(point[1], point[0]);
          var marker = new L.Marker(leaflet_point,{
            icon: L.icon({
              iconUrl: attributes.icon_url,
              iconAnchor: [16,35],
              popupAnchor: [0, -30]
            }),
            clickable: true,
            name: attributes.name,
            bbModel: model,
            code: attributes.code
          });

        this.markers.addLayer(marker);
        marker.on('click', that.showPopup);
      } catch (e) {
        console.log('Location has no geometry. Error: ' + e);
      }

    }
  },
  showPopup: function(e) {
    var marker = e.target;
    if (marker._popup !== undefined) {
      // marker.togglePopup();
      Lizard.App.vent.off('ResizePopup');
      marker.unbindPopup();
    } 
    var model = marker.valueOf().options.bbModel;
    var name = marker.valueOf().options.name;
    var popupLayout = new Lizard.geo.Popups.Layout();
    popupLayout.render();
    popupLayout.title.show(new Lizard.geo.Popups.LocationPopupTitle({
      model: model, name: name
    }));
    var innerStuff = Lizard.geo.Popups.DdscTimeseries.getPopupContent(model, popupLayout.content);
    var popup = new L.Rrose({
      maxHeight: 300, 
      minWidth: 400, 
      maxWidth: 450,
      autoPan: false
    });
    popup.setContent(popupLayout.el);
    marker.bindPopup(popup);
    marker.openPopup();
    popup._updatePosition();
    Lizard.App.vent.on('ResizePopup', function () {
      popup._updatePosition.bind(popup);
      popup._map = marker._map;
      popup._updatePosition();
    }, popup);

  }
});

Lizard.geo.Popups.LocationPopupTitle = Backbone.Marionette.ItemView.extend({
  initialize: function (options){
    this.model = options.model;
    this.model.set({pk: this.model.get('id')});
    this.model.bind('change:annotationCount', this.render, this);
  },
  events:{
    'mouseover' : 'countAnnotations',
    'click .icon-comment': 'createAnnotation'
  },
  template: function(model){
        return _.template(
            $('#timeserie-popup-title-template').html(), {
              title: model.name,
              annotationCount: model.annotationCount
            });
  },
  createAnnotation: function(){
    Lizard.Views.CreateAnnotationView(this.model);
  },
  countAnnotations: function () {
    if (this.model.get('annotationCount') === null) {
      var self = this;
      var countUrl = settings.annotations_count_url + '?model_names_pks=location,' + this.model.get('id');
      $.get(countUrl).success(function (annotation) {
        self.model.set({annotationCount: annotation.count});
      });
    }
  }
});

Lizard.geo.Popups.Layout = Backbone.Marionette.Layout.extend({
    template: '#timeseries-popup-template',
    regions:{
      'content' :'#ts-popup-content',
      'title' : '#ts-popup-title'
    }
});
