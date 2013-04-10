NoItemsView = Backbone.Marionette.ItemView.extend({
  template: "#show-no-items-message-template"
});

GraphLegendItemView = Backbone.Marionette.ItemView.extend({
  template: '#graphs-legend-template'
});

GraphLegendCollectionView = Backbone.Marionette.CollectionView.extend({
  itemView: GraphLegendItemView,
  emptyView: NoItemsView,
  initialize: function() {
    console.log('initialize()');
    // console.log($(this.el).parent('.row-fluid'));
    // var g = this.$el.parent('graph').initFlotGraph();
    // _.bind(this.collection);
  },
  onShow: function(e) {
    var that = this;
    this.$el.on('dragover dragenter', false);
    this.$el.on('drop', function(e) {
      e.preventDefault();
      $('.top-right').notify({message: {text: 'Grafiek toegevoegd...'}}).show();
      console.log('e', e.originalEvent.target);
      var $target = $(e.target);
      var graphDiv = $(that.$el).parent().parent();
      var graph = new Lizard.Models.Graph();
      var uuid = e.originalEvent.dataTransfer.getData('Text');
 
      var timeserie = timeseriesCollection.get(uuid);
      if(that.collection.find(function(timeserie) {
        console.log('timeserie', timeserie);
      })) {
        $('.top-right').notify({message: {text: 'Grafiek reeds toegevoegd...'}}).show();
      } else {
        that.collection.add(timeserie);
      }
      
      // graphDiv.find('.graph-drop').first().loadPlotData(settings.timeseries_url + 'events/' + uuid);
    });
  }
});
