var __hasProp = Object.prototype.hasOwnProperty;

define(['jquery', 'use!underscore', 'use!backbone'], function($, _, Backbone, ManipulateWrapper) {
  var Service;
  Service = Backbone.Model.extend({
    /*
          A root data model. Services typically will not change during a single request.
          Each service model is a service the app supports (even if the user doesn't have 
          auth for it yet). This model provides extra information for each service.
          Each model does not have an ID. This model uses 'key' to identify itself.
    */
    urlRoot: function() {
      return "" + window.domain + "/api/v2/services";
    },
    initialize: function(attrs, options) {},
    parse: function(response) {
      this.loaded = true;
      return response;
    },
    getName: function() {
      if (this.get('meta').human_readable_key != null) {
        return this.get('meta').human_readable_key;
      }
      return this.get('key');
    },
    getNameArticle: function() {
      var letter, v, vowel, vowels, _i, _len;
      vowels = ['a', 'e', 'i', 'o', 'u'];
      vowel = false;
      letter = this.getName().toLowerCase()[0];
      for (_i = 0, _len = vowels.length; _i < _len; _i++) {
        v = vowels[_i];
        if (letter === v) vowel = true;
      }
      if (vowel) return 'an';
      return 'a';
    },
    hasReads: function() {
      if (this.countActions(this.get('reads')) > 0) return true;
      return false;
    },
    hasWrites: function() {
      if (this.countActions(this.get('writes')) > 0) return true;
      return false;
    },
    countActions: function(actions) {
      var action, isEmpty;
      isEmpty = function(object) {
        var key, value;
        for (key in object) {
          if (!__hasProp.call(object, key)) continue;
          value = object[key];
          return false;
        }
        return true;
      };
      actions = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = actions.length; _i < _len; _i++) {
          action = actions[_i];
          if (!isEmpty(action)) _results.push(action);
        }
        return _results;
      })();
      return actions.length;
    },
    requiresAuth: function() {
      /*
               Does this web service require authentication to use? If not, it is usually
               an in-house api
               Note "extra info" constitutes auth required as well but user should be shown a
               different view
      */      if (this.hasHook()) return true;
      if ((this.get('auth') != null) && this.get('auth').length > 0) return true;
      return false;
    },
    hasHook: function() {
      if (this.get('meta').hook) return true;
      return false;
    },
    getImageClass: function(size) {
      var css, _ref;
      if (size == null) size = "64x64";
      if (((_ref = this.get('css')) != null ? _ref[size] : void 0) != null) {
        css = this.get('css')[size];
      } else {
        css = 'placeholder';
      }
      return css;
    },
    getCategories: function() {
      return this.get('categories');
    }
  });
  return Service;
});
