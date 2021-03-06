
//  Class for WMS Tamplate Layers
//
//
Lizard.geo.Layers.WMSTemplateLayer = Lizard.geo.Layers.WMSLayer.extend({
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
    wms_url: '',
    template: _.template('<%= name %> - <br><i>implement template for this layer</i>')
  },
  initialize: function(obj) {
    if (obj.options.template) {
      this.template = _.template(obj.options.template)
    }
  },
  getLeafletLayer: function() {
    if (!this.leafletLayer) {
      this.leafletLayer = this._getNewLeafletLayer();
    }
    return this.leafletLayer;
  },
  _getNewLeafletLayer: function() {
    return L.tileLayer.wms(this.attributes.wms_url, {
      zIndex: 100 - this.attributes.order,
      layers: this.attributes.layer_name,
      format: this.attributes.format,
      transparent: this.attributes.transparent,
      opacity: this.attributes.opacity,
      attribution: 'DDSC'
    });
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
      X: map.layerPointToContainerPoint(event.layerPoint).x,
      Y: map.layerPointToContainerPoint(event.layerPoint).y,
      SERVICE: 'WMS',
      VERSION: '1.1.1',
      REQUEST: 'GetFeatureInfo',
      LAYERS: this.get('layer_name'),
      QUERY_LAYERS: this.get('layer_name'),
      STYLES: this.get('styles'),
      FORMAT: this.get('format'),
      FEATURE_COUNT: 1,
      INFO_FORMAT: 'application/vnd.ogc.gml',
      SRS: 'EPSG:4326'
    };

    var url = this.get('wms_url') + '?'+ $.param(params);
    return url;
  },
  getPopupContent: function(data) {
    var xml = $.xml2json(data);
    var features = xml.featureMember;
    if (features) {
      var feature = _(features).pairs()[0][1];
      return this.template(feature);
    } else {
      return false;
    }
  }
});

//add type to type index
LAYER_CLASSES['wms_template'] = Lizard.geo.Layers.WMSTemplateLayer;