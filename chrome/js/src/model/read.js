
define(['jquery', 'use!underscore', 'use!backbone', 'collection/writes', 'model/write'], function($, _, Backbone, Writes, Write) {
  var Read;
  Read = Backbone.Model.extend({
    /*
          A root data model. Defines a single read action including associated auth service
          and id.
    */
    urlRoot: function() {
      return "" + window.domain + "/api/v2/reads";
    },
    initialize: function(attrs, options) {
      _.bindAll(this);
      this.writes = new Writes([new Write()]);
      delete this.getWrite().collection;
      this.on('change:write_ids', this.initWrite);
      return this.on('change', this.enforceState);
    },
    parse: function(response) {
      this.loaded = true;
      return response;
    },
    initWrite: function() {
      /*
               Writes are always attached to reads. This function is called whenever the write ID
               array changes. It will initialize a Write model for each ID and fetch it
               NOTE: for now we only support 1 write model
      */
      var root, write, _ref;
      write = this.getWrite();
      root = this.urlRoot();
      write.urlRoot = "" + root + "/" + this.id + "/writes";
      if (((_ref = this.get('write_ids')) != null ? _ref[0] : void 0) != null) {
        write.id = this.getWriteId();
        return write.fetch();
      }
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
    getWrite: function() {
      return this.writes.at(0);
    },
    getWriteId: function() {
      return this.get('write_ids')[0];
    },
    isComplete: function() {
      if ((this.id != null) && (this.get('selected_api') != null) && (this.get('action') != null) && this.get('write_ids').length > 0 && this.get('errors').length === 0) {
        return true;
      } else {
        return false;
      }
    }
  });
  return Read;
});
