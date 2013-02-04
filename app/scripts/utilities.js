// Prevent console.log from throwing errors
if(typeof(console) === 'undefined') {
    var console = {};
    console.log = console.error = console.info = console.debug = console.warn = console.trace = console.dir = console.dirxml = console.group = console.groupEnd = console.time = console.timeEnd = console.assert = console.profile = function() {};
}



$('input[type=checkbox]').live('click', function(e) {
  var el = $(this);
  if(el.is(':checked')) {
    el.parent().css('background', '#bae483');
    el.parent().css('border-bottom', '1px solid rgba(255, 255, 255, 0.1)');
    el.parent().css('-moz-box-shadow', 'inset 0 3px 5px rgba(0, 0, 0, 0.1)');
    el.parent().css('-webkit-box-shadow', 'inset 0 3px 5px rgba(0, 0, 0, 0.1)');
    el.parent().css('box-shadow', 'inset 0 3px 5px rgba(0, 0, 0, 0.1)');
    el.parent().css('-webkit-border-radius', '10px');
    el.parent().css('-moz-border-radius', '10px');
    el.parent().css('border-radius', '10px');
  } else {
    el.parent().css('background', 'none');
    el.parent().css('border-bottom', 'none');
    el.parent().css('-moz-box-shadow', 'none');
    el.parent().css('-webkit-box-shadow', 'none');
    el.parent().css('box-shadow', 'none');
    el.parent().css('-webkit-border-radius', 'none');
    el.parent().css('-moz-border-radius', 'none');
    el.parent().css('border-radius', 'none');
  }
  return true;
});


// Click handlers for toggling the filter/location/parameter UI
$('li#filters a em').live("click", function(e){
  e.preventDefault();
  var el = $(this).parent().next();
  if(el.is(':visible')) {
    el.addClass('hide');
  } else {
    el.removeClass('hide');
  }
});
$('li#locations a em').live("click", function(e){
  e.preventDefault();
  var el = $(this).parent().next();
  if(el.is(':visible')) {
    el.addClass('hide');
  } else {
    el.removeClass('hide');
  }
});
$('li#parameters a em').live("click", function(e){
  e.preventDefault();
  var el = $(this).parent().next();
  if(el.is(':visible')) {
    el.addClass('hide');
  } else {
    el.removeClass('hide');
  }
});



var ModalView = Backbone.Marionette.ItemView.extend({
    template: '#location-modal-template',
    model: null,
    initialize: function(model){
        this.model = model;
    }
})


Lizard.Utils = {};
Lizard.Utils.Map = {
    modalInfo: function (e){
          var marker = e.target;
          var model = marker.valueOf().options.bbModel;
          modalView = new ModalView();
          modalView.model = model;
          console.log(model);
          Lizard.mapView.modal.show(modalView.render());
          $('#location-modal').modal();
    },
    updateModal: function(e){
        var marker = e.target;
        
    },
    updateInfo: function (e) {
        var marker = e.target;
        console.log(e);
        props = marker.valueOf().options;
        e.layer._map._controlContainer.innerHTML = '<h4>Datapunt</h4>' + (props ?
                '<b>' + props.name + '</b><br>' +
                'Punt: ' + props.code
                : 'Zweef over de punten');
    },
    // drawonMap takes the collection and goes through the models in it
    // 'drawing' them on the map.
    drawonMap: function(collection, objects){
        var models = collection.models;
        for (var i in models){
          var model = models[i];
          model.fetch({async: false});
          var attributes = model.attributes;
          var point = attributes.point_geometry;
          var marker = new L.Marker(new L.LatLng(point[1], point[0]),{
            clickable: true,
            name: attributes.name,
            bbModel: model,
            code: attributes.code
          });
          //marker.on('mouseover', this.updateInfo);
          marker.on('click', Lizard.Utils.Map.modalInfo);
          this.markers.addLayer(marker);
    }},
    selectforCollage: function(e) {
        var marker = e.target;
        var properties = marker.valueOf().options;
        var wsitem = properties.bbModel;
        wsitem.set({title: wsitem.attributes.name})
        Collage.add(wsitem);
    }
};

