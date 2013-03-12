Lizard.Views.GraphControllerItem = Backbone.Marionette.ItemView.extend({
  template: '#graphcontroller-item-template',
  tagName: 'li',
  initialize: function () {
    console.log('GraphControllerItem initializing');
    this.model.bind('change', this.render);
  },
  events: {
    'click': 'testclick'
  },
  testclick: function(e) {
    console.log('clicked',e);
  }
});

Lizard.Views.GraphControllerItemList = Backbone.Marionette.CollectionView.extend({
  initialize: function (options) {
    console.log('GraphControllerItemList initializing');
  },
  emptyView: Marionette.ItemView.extend({
    template: "#empty-graph-list-message"
  }),
  tagName: 'ul',
  className: 'graph-controller-list',
  itemView: Lizard.Views.GraphControllerItem
});

