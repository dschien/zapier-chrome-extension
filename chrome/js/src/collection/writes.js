
define(['jquery', 'use!underscore', 'use!backbone', 'model/write'], function($, _, Backbone, Write) {
  var Writes;
  Writes = Backbone.Collection.extend({
    /*
          Collection of writes. For future use in a dashboard.
    */
    model: Write,
    url: function() {
      return "" + window.domain + "/api/v2/writes";
    },
    initialize: function(options) {},
    parse: function(response) {
      this.loaded = true;
      return response.objects;
    }
  });
  return Writes;
});
