
define(['jquery', 'use!underscore', 'use!backbone', 'json', 'model/auth'], function($, _, Backbone, JsonWrapper, Auth) {
  var Auths;
  Auths = Backbone.Collection.extend({
    /*
          Collection of authenticated services. This is what is psased into views for use.
    */
    model: Auth,
    url: function() {
      return "" + window.domain + "/api/v2/auths";
    },
    initialize: function(options) {},
    parse: function(response) {
      this.loaded = true;
      return response.objects;
    },
    getByKey: function(key) {
      var match;
      if (!(key != null)) return null;
      match = [];
      this.each(function(model) {
        if (model.get('selected_api') === key) return match.push(model);
      });
      return match;
    },
    hasAtLeastOneAuth: function(key) {
      var auth;
      auth = this.getByKey(key);
      if ((auth != null) && auth.length > 0) return true;
      return false;
    },
    pollForUpdate: function(interval, iters, callback) {
      var i, match, originalJson, poll,
        _this = this;
      i = 0;
      match = false;
      originalJson = JSON.stringify(this);
      poll = setInterval(function() {
        var error, success;
        success = function(e) {
          log('Account Poll Iter Success', i);
          if (originalJson !== JSON.stringify(e)) {
            log('New Account Found!');
            clearInterval(poll);
            return callback.success.call(this);
          }
        };
        error = function(e) {};
        _this.fetch({
          success: success,
          error: error
        });
        i = i + 1;
        if (i === iters) {
          log('Account Poll Stopping, Max Iterations');
          clearInterval(poll);
          return callback.maxIter.call(_this);
        }
      }, interval);
      return poll;
    }
  });
  return Auths;
});
