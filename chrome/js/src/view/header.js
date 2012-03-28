
define(['jquery', 'use!underscore', 'use!backbone', 'mustache', 'text!template/header.html'], function($, _, Backbone, MustacheWrapper, FooterTemplate) {
  var HeaderView;
  HeaderView = Backbone.View.extend({
    /*
          Header
    */
    initialize: function(options) {
      _.bindAll(this, 'render');
      return this.render();
    },
    render: function() {
      var view;
      view = {
        place: "holder"
      };
      return this.$el.html(Mustache.to_html(FooterTemplate, view));
    }
  });
  return HeaderView;
});
