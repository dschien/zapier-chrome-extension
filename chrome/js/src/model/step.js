
define(['jquery', 'use!underscore', 'use!backbone', 'use!jgrowl'], function($, _, Backbone, jGrowlWrapper) {
  var Step;
  Step = Backbone.Model.extend({
    /*
          Defines which step is currently being editted. Major is the top level organization;
          Minor is each step part.
    */
    defaults: {
      current: null
    },
    initialize: function(options) {
      _.bindAll(this, 'determineState');
      this.read = options.read;
      this.write = options.write;
      this.services = options.services;
      this.auths = options.auths;
      return this.on('change', this.logCurrent);
    },
    determineState: function() {
      /*
               Inspects current model state and figures out which major/minor step the user
               Should be on when the page loads
               Do a silent/trigger method because Backbone doesn't fire a change event
               if the step is set to the same thing.
      */
      var getStep, step,
        _this = this;
      getStep = function() {
        if (!_this.read.has('selected_api')) return 1;
        if (!_this.read.has('auth_id') && !_this.services.getByKey(_this.read.get('selected_api')).hasHook()) {
          return 2;
        }
        if (!_this.write.has('selected_api')) return 3;
        if (!_this.write.has('auth_id') && !_this.services.getByKey(_this.write.get('selected_api')).hasHook()) {
          return 4;
        }
      };
      step = getStep();
      this.set({
        current: step
      }, {
        silent: true
      });
      return this.trigger('change');
    },
    logCurrent: function() {
      return log("Current step is now: ", this.get('current'), this);
    },
    saveChanges: function(callback) {
      /*
               Called when someplace in the edit page wants to save progress. Sets up the growl saving
               notification and fires the backbone.sync save requests
      */
      var datas, saveError, saveSuccess;
      saveSuccess = function(e) {
        log('Save done.');
        if ((callback != null ? callback.success : void 0) != null) {
          return callback.success.call(this, e);
        }
      };
      saveError = function(e) {
        $.jGrowl("Error saving: " + e.statusText);
        if ((callback != null ? callback.error : void 0) != null) {
          return callback.error.call(this, e);
        }
      };
      datas = [this.read, this.write];
      return this.dataSaver(datas, {
        success: saveSuccess,
        error: saveError
      });
    },
    dataSaver: function(datas, callback) {
      var beginSave, checkAllSaved, closeNotif, dataSaveError, dataSavedBool, growlEl, save, setContextAndDoCallback,
        _this = this;
      if (datas == null) datas = [];
      if (callback == null) {
        callback = {
          success: (function() {}),
          error: (function() {
            return log('dataSaver error');
          })
        };
      }
      /*
               Saves all the models/collections in datas to server via backbone.sync the fires
               callback when done
      */
      growlEl = null;
      dataSaveError = false;
      dataSavedBool = [];
      setContextAndDoCallback = function(callback, arg) {
        return callback.call(_this, arg);
      };
      save = function(data) {
        var dataSaveErrorFunc, dataSavedFunc, saveWithRace;
        dataSavedFunc = function(e) {
          dataSavedBool.push(true);
          return checkAllSaved(e);
        };
        dataSaveErrorFunc = function(e) {
          dataSavedBool.push(false);
          setContextAndDoCallback(callback.error, e);
          return checkAllSaved(e);
        };
        saveWithRace = function(data) {
          var json;
          json = data.getSaveJson();
          return data.save(json, {
            success: dataSavedFunc,
            error: dataSaveErrorFunc
          });
        };
        return setTimeout((function() {
          return saveWithRace(data);
        }), 0);
      };
      closeNotif = function() {
        return $(growlEl).find('.jGrowl-close').trigger('click');
      };
      checkAllSaved = function(e) {
        var allDone;
        allDone = false;
        if (dataSavedBool.length === datas.length) allDone = true;
        if (allDone) {
          closeNotif();
          return setContextAndDoCallback(callback.success, e);
        }
      };
      beginSave = function(e) {
        var data, _i, _len, _results;
        growlEl = e;
        _results = [];
        for (_i = 0, _len = datas.length; _i < _len; _i++) {
          data = datas[_i];
          _results.push(save(data));
        }
        return _results;
      };
      return $.jGrowl("Saving...", {
        sticky: true,
        beforeOpen: beginSave
      });
    }
  });
  return Step;
});
