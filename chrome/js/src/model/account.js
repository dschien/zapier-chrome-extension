
define(['jquery', 'use!underscore', 'use!backbone', 'json'], function($, _, Backbone, JsonWrapper) {
  var Account;
  Account = Backbone.Model.extend({
    /*
          This model represents the currently logged in user and details about them.
    */
    urlRoot: function() {
      return "" + window.domain + "/api/v2/accounts/me";
    },
    initialize: function(attrs, options) {},
    parse: function(response) {
      this.loaded = true;
      return response;
    },
    save: function(attrs, options) {
      if (this.isNew()) {
        this.urlRoot = "" + window.domain + "/api/v2/accounts/me?temp=true";
      }
      if (this.tempValidate()) {
        Backbone.Model.prototype.save.call(this, attrs, options);
      }
      return this.urlRoot = "" + window.domain + "/api/v2/accounts/me";
    },
    tempValidate: function(attrs) {
      /*
               Validate the model if this is a temp account. We want to check
               if this isNew and we are trying to set an account to be not temp (that
               is, we want to turn a temp account into a full account) we also need to
               provide a username, email, password, password confirm to the server
               @.get('username')
               @.get('email')
               @.get('password1')
               @.get('password2')
      */      if (this.isNew() && !this.get('temp')) {
        if ((this.get('username') != null) && (this.get('email') != null) && (this.get('password1') != null) && (this.get('passwords') != null)) {
          return true;
        } else {
          return false;
        }
      }
      return true;
    },
    isLoggedIn: function() {
      return this.id != null;
    },
    isTemp: function() {
      if (this.get('temp') != null) {
        return this.get('temp');
      } else {
        return false;
      }
    },
    setTemp: function() {
      return this.set({
        temp: true
      });
    },
    removeTemp: function() {
      return this.set({
        temp: false
      });
    },
    login: function(username, password, options) {
      var data,
        _this = this;
      if (options == null) options = {};
      data = {
        username: username,
        password: password
      };
      return $.ajax({
        url: "" + window.domain + "/api/v2/accounts/session",
        type: 'put',
        data: JSON.stringify(data),
        dataType: 'json',
        success: function() {
          return _this.fetch({
            success: function() {
              if (options.success != null) return options.success.call(_this);
            },
            error: function() {
              if (options.error != null) return options.error.call(_this);
            }
          });
        },
        error: function() {
          if (options.error != null) return options.error.call(_this);
        }
      });
    },
    logout: function() {
      return $.ajax({
        url: "" + window.domain + "/api/v2/accounts/session",
        type: 'delete',
        success: function() {
          return window.location.href = '/';
        }
      });
    }
  });
  return Account;
});
