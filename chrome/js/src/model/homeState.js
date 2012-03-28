
define(['jquery', 'use!underscore', 'use!backbone', 'model/editState'], function($, _, Backbone, EditState) {
  var HomeState;
  HomeState = EditState.extend({
    /*
          This Finite State Machine extends the EditView since most of what happens
          on the homepage is an extension of the zap editor.
    */
    initialize: function(attrs, options) {
      EditState.prototype.initialize.call(this, attrs, options);
      return this.set({
        creatingAccount: false
      });
    },
    validate: function() {
      return EditState.prototype.validate.call(this);
    },
    onHomepage: function() {
      return this.set({
        onHomepage: true
      });
    },
    offHomepage: function() {
      return this.set({
        onHomepage: false
      });
    },
    createZap: function() {
      /*
               Create the zap and enable the rest of the UI to edit it
      
               A few things to create a zap from the homepage. First, we need
               to save (create) the account up to the server to get a new temporary
               account for this user. We should then have an authenticated user to save the
               @read and @write against
               NOTE the data: $.param({temp: 'true'}) is used to append GET params to the URL
      
               Next, the goal is saving @read and @write up to the database so we can get an
               ID for each. In the future, there may be more than one write
               
               NOTE we have to do the read as a callback of account creation because we 
               need an account on the server before we can create objects for the user
      */
      var accountSaveSuccess, continueEditing, saveRead,
        _this = this;
      this.set({
        creatingAccount: true
      });
      continueEditing = function() {
        return _this.set({
          showChooseServices: true,
          showChooseAccounts: true,
          showConfigureActions: true,
          showDoThisIf: true,
          showTestEnable: true,
          showCreateZap: false,
          showChooseServicesSelector: false,
          zapCreated: true,
          creatingAccount: false
        });
      };
      saveRead = function() {
        var readSaveSuccess;
        readSaveSuccess = function(e) {
          var writeSaveSuccess;
          writeSaveSuccess = function(e) {
            _this.read.fetch();
            return continueEditing();
          };
          return _this.write.save({}, {
            success: writeSaveSuccess
          });
        };
        return _this.read.save({}, {
          success: readSaveSuccess
        });
      };
      accountSaveSuccess = function(e) {
        return saveRead();
      };
      if (!this.account.isLoggedIn()) {
        this.account.setTemp();
        return this.account.save({}, {
          success: accountSaveSuccess
        });
      }
    },
    determine: function() {
      return EditState.prototype.determine.call(this);
    }
  });
  return HomeState;
});
