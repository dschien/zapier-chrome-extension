
define(['jquery', 'use!underscore', 'use!backbone', 'model/service'], function($, _, Backbone, Service) {
  window.Services = Backbone.Collection.extend({
    /*
          Collection of services, used in views. Offers a way to retrieve a single
          service model given it's key since service models do not have IDs
    */
    model: Service,
    url: function() {
      return "" + window.domain + "/api/v2/services";
    },
    initialize: function(options) {},
    parse: function(response) {
      this.loaded = true;
      return response.objects;
    },
    getByKey: function(key) {
      var match;
      if (!(key != null)) return null;
      match = null;
      this.each(function(model) {
        if (model.get('key') === key) return match = model;
      });
      return match;
    }
  });
  return Services;
});
