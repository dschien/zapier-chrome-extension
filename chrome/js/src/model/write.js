
define(['jquery', 'use!underscore', 'use!backbone'], function($, _, Backbone) {
  var Write;
  Write = Backbone.Model.extend({
    /*
          A root data model. Defines a single write action including associated auth service
          and id.
          Write models are always attached to a /read to the url is dynamically generated
          via the Read model
    */
    initialize: function(attrs, options) {
      _.bindAll(this);
      this.on('change', this.enforceState);
      if ((options != null ? options.urlRoot : void 0) != null) {
        return this.urlRoot = options.urlRoot;
      }
    },
    parse: function(response) {
      this.loaded = true;
      return response;
    },
    enforceState: function() {
      /*
               Called after change, looks at the model and enforces certain fields which are
               dependent on earlier fields. For example, if this model has no chosen service,
               it does not make sense to have a chosen auth_id since auth_ids are tied to 
               specific services
      */
      var change, options;
      change = false;
      options = {
        silent: true
      };
      if (!(this.get('selected_api') != null) && (this.get('action') != null)) {
        this.set({
          'action': null
        }, options);
        change = true;
      }
      if (!(this.get('selected_api') != null) && (this.get('auth_id') != null)) {
        this.set({
          'auth_id': null
        }, options);
        change = true;
      }
      if (change) return this.trigger('change');
    },
    isComplete: function() {
      if ((this.id != null) && (this.get('selected_api') != null) && (this.get('action') != null) && (this.get('read_id') != null) && this.get('errors').length === 0) {
        return true;
      } else {
        return false;
      }
    }
  });
  return Write;
});
