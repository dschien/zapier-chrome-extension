
define(['jquery', 'use!underscore', 'use!backbone'], function($, _, Backbone) {
  var Auth;
  Auth = Backbone.Model.extend({
    /*
          A root model. Each model represents a single service the current user has authenticated
          with. These typically wont change once the page has been loaded and the model has no ID;
          rather, it uses 'key' to identify each authenticate service
    */
    urlRoot: function() {
      return "" + window.domain + "/api/v2/auths";
    },
    defaults: {
      'id': null,
      'key': null
    },
    initialize: function(attrs, options) {},
    parse: function(response) {
      this.loaded = true;
      return response;
    },
    validateModel: function() {
      if (!(this.get('key') != null)) return false;
      return true;
    },
    getName: function(services) {
      var base, name;
      base = services.getByKey(this.get('selected_api')).getName();
      if (this.get('title') != null) {
        name = this.get('title') + ' (' + base + ')';
      } else {
        name = base + ' (' + this.id + ')';
      }
      return name;
    }
  });
  return Auth;
});
