
define(['jquery', 'use!underscore', 'use!backbone', 'mustache', 'text!template/footer.html'], function($, _, Backbone, MustacheWrapper, FooterTemplate) {
  var FooterView;
  FooterView = Backbone.View.extend({
    /*
          Footer view
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
  return FooterView;
});
