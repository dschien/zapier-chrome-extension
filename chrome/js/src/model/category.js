
define(['jquery', 'use!underscore', 'use!backbone'], function($, _, Backbone) {
  var Category;
  Category = Backbone.Model.extend({
    /*
          Holds data about a single category, methods to represent it
    */
    defaults: {
      "key": "undefined",
      "name": "Undefined"
    },
    initialize: function(attrs, options) {},
    parse: function(response) {
      this.loaded = true;
      return response;
    },
    getKey: function() {
      if ((this.get('key') != null) && this.get('key') !== 'undefined') {
        return this.get('key');
      }
      return this.get('name').toLowerCase().split(' ').join('_');
    },
    getName: function() {
      return this.get('name');
    }
  });
  return Category;
});
