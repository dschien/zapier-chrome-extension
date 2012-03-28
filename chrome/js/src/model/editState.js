
define(['jquery', 'use!underscore', 'use!backbone'], function($, _, Backbone) {
  var EditState;
  EditState = Backbone.Model.extend({
    /*
          A Finite State Machine model, controls moving from various
          states for the Edit view
    */
    defaults: {
      onHomepage: false,
      zapCreated: false,
      showChooseServices: true,
      showChooseAccounts: true,
      showConfigureActions: true,
      showDoThisIf: true,
      showTestEnable: true,
      showCreateZap: false,
      showChooseServicesSelector: true
    },
    initialize: function(attrs, options) {
      _.bindAll(this);
      this.read = options.read;
      this.write = options.write;
      this.services = options.services;
      this.auths = options.auths;
      this.account = options.account;
      this.on('change', this.validate);
      this.read.bind('change', this.determine);
      this.write.bind('change', this.determine);
      this.services.bind('change', this.determine);
      return this.auths.bind('change', this.determine);
    },
    validate: function() {
      return false;
    },
    editting: function() {
      return this.set({
        zapCreated: true
      });
    },
    zapNotCreated: function() {
      return this.set({
        zapCreated: false
      });
    },
    editOnlyServices: function() {
      return this.set({
        showChooseServices: true,
        showChooseAccounts: false,
        showConfigureActions: false,
        showDoThisIf: false,
        showTestEnable: false
      });
    },
    chooseServices: function() {
      return this.set({
        showChooseServicesSelector: true,
        showCreateZap: false
      });
    },
    doneChoosingServices: function() {
      return this.set({
        showChooseServicesSelector: false
      });
    },
    createZap: function() {
      /*
               Create the zap and enable the rest of the UI to edit it
      
               The goal is saving @read and @write up to the database so we can get an
               ID for each. In the future, there may be more than one write
               
               NOTE we have to do the read as a callback of account creation because we 
               need an account on the server before we can create objects for the user
      */
      var continueEditing, saveRead,
        _this = this;
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
      return saveRead();
    },
    ableToCreateZap: function() {
      return this.set({
        showCreateZap: true,
        showChooseServicesSelector: false
      });
    },
    determine: function() {
      if ((this.read.get('selected_api') != null) && (this.read.get('action') != null) && (this.write.get('selected_api') != null) && (this.write.get('action') != null)) {
        if (!this.get('zapCreated')) return this.ableToCreateZap();
      }
    }
  });
  return EditState;
});
