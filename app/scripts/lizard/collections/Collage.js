Lizard.collections.Collage = Backbone.Collection.extend({
	url: local_settings.collages_url,
	model: Lizard.models.Collage,
	parse: function (response) {
		response = response.results;
		return response
	}
});