
define(['jquery', 'use!underscore', 'use!backbone', 'model/read'], function($, _, Backbone, Read) {
  var Reads;
  Reads = Backbone.Collection.extend({
    /*
          Collection of Reads. For future use in a dashboard.
    */
    model: Read,
    url: function() {
      return "" + window.domain + "/api/v2/reads";
    },
    initialize: function(options) {},
    parse: function(response) {
      this.loaded = true;
      return response.objects;
    }
  });
  return Reads;
});
