
//  Class for WMS Layers
//
//
Lizard.geo.Layers.WMSLayer = Lizard.geo.Layers.MapLayer.extend({
  defaults: {
    display_name: '',
    visibility: false,
    opacity: 100,
    order: 0,
    //extra info and links
    description: null,
    metadata: null,
    legend_url: null,
    enable_search: null,
    //program settings
    type: null, //='wms'
    addedToMap: false,
    proxyForWms: false,//todo: add support
    proxyForGetInfo: true,//todo: for the time being, until supported by Lizard-wms
    //specific settings for wms overlays
    layer_name: '',
    styles: null,
    format: 'image/png',
    height: null,
    width: null,
    tiled: null,
    transparent: true,
    wms_url: ''
  },
  getLeafletLayer: function() {
    if (!this.leafletLayer) {
      this.leafletLayer = this._getNewLeafletLayer();
    }
    return this.leafletLayer;
  },
  _getNewLeafletLayer: function() {
    var wms = L.tileLayer.wms(this.attributes.wms_url, {
      zIndex: 100 - this.attributes.order,
      layers: this.attributes.layer_name,
      styles: this.attributes.styles,
      format: this.attributes.format,
      transparent: this.attributes.transparent,
      opacity: this.attributes.opacity,
      attribution: 'DDSC'
    });
    // Set Lizard WMS options (minZoom, maxZoom, etc).
    for (var option in this.attributes.options) {
      wms.options[option] = this.attributes.options[option]
    }
    return wms;
  },
  //Function for getting featureInfo of this layer
  //event: leaflet click event
  //map: leaflet map object
  //callback: function called after a successful fetch of data
  getFeatureInfo: function(event, map, options, callback) {//todo: tot hier gekomen
    var url = this._getFeatureInfoRequestUrl(event, map);
    if (this.get('proxyForGetInfo')) {
      url = settings.wms_proxy_base_url + $.param({url: url});
    }

    $.ajax({
      url: url,
      dataType: "html",
      type: "GET",
      //async: false,
      success: function(data) {
        callback(data);
      }
    });

  },
  _getFeatureInfoRequestUrl: function(event, map) {

    var params = {
      BBOX: map.getBounds().toBBoxString(),
      WIDTH: map.getSize().x,
      HEIGHT: map.getSize().y,
      X: parseInt(map.layerPointToContainerPoint(event.layerPoint).x),
      Y: parseInt(map.layerPointToContainerPoint(event.layerPoint).y),
      SERVICE: 'WMS',
      VERSION: '1.1.1',
      REQUEST: 'GetFeatureInfo',
      LAYERS: this.get('layer_name'),
      QUERY_LAYERS: this.get('layer_name'),
      STYLES: this.get('styles'),
      FORMAT: this.get('format'),
      FEATURE_COUNT: 5,
      INFO_FORMAT: 'text/html',
      SRS: 'EPSG:4326'
    };

    var url = this.get('wms_url') + '?'+ $.param(params);
    return url;
  },
  getPopupContent: function(data) {
    var xml = $.parseXML(data);
    if ($(xml).find('table').length > 0) {
      return '<div style="overflow:auto">' + '<h4>' + this.get('display_name') + '</h4>' + data + '</div>';
    } else {
      $('.top-right').notify({type: 'error', message: {text: 'Op dit punt op de kaart is geen informatie beschikbaar. Probeer het nog eens.'}}).show();
      return false;
    }
  }
});

//add type to type index
LAYER_CLASSES['wms'] = Lizard.geo.Layers.WMSLayer;
