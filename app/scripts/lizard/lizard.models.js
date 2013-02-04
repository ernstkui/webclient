/**
Models
*/


Lizard.models = {};

Lizard.models.Filter = Backbone.Model.extend({
  initialize: function() {
    // console.log('FilterModel initializing');
  },
  defaults: {
    'selected':  false
  }
});


Lizard.models.Timeserie = Backbone.AssociatedModel.extend({
  defaults: {
    'selected': false
  }
});

Lizard.models.Location = Backbone.AssociatedModel.extend({
  relations: [{
    type: Backbone.Many,
    key:'timeseries',
    relatedModel: Lizard.models.Timeserie,
  }],
  defaults: {
    'selected':  false
  },
});

Lizard.models.Parameter = Backbone.Model.extend({
  initialize: function() {
    // console.log('ParameterModel initializing');
  },
  defaults: {
    'selected':  false
  }
});

Lizard.models.Collage = Backbone.Model.extend({
  initialize: function() {
  }
});

Lizard.models.Timeserie