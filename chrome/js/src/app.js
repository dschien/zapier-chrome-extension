
define(['jquery', 'use!underscore', 'use!backbone', 'router'], function($, _, Backbone, Router) {
  var initialize;
  initialize = function() {
    window.domain = "https://zapier.com";
    this.router = new Router();
    if (!Backbone.history.start({
      pushState: true,
      root: "/"
    })) {
      this.router.navigate('/', true);
    }
    return Backbone.emulateHTTP = false;
  };
  return {
    initialize: initialize
  };
});
