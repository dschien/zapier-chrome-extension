
define(['jquery', 'use!underscore', 'use!backbone'], function($, _, Backbone, EditState) {
  var DashboardState;
  DashboardState = Backbone.Model.extend({
    /*
          This Finite State Machine for dashboard
    */
    initialize: function(attrs, options) {},
    validate: function() {},
    determine: function() {}
  });
  return DashboardState;
});
