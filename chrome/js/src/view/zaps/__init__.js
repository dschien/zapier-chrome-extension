
define(['jquery', 'use!underscore', 'use!backbone', 'mustache', 'text!template/zaps/__init__.html', 'text!template/zaps/zapItem.html', 'collection/services', 'collection/reads', 'collection/writes'], function($, _, Backbone, MustacheWrapper, InitTemplate, ItemTemplate, Services, Reads, Writes) {
  var ZapsView;
  ZapsView = Backbone.View.extend({
    /*
          Zaps view
    */
    events: {
      'click a[data-action]': 'actionClick'
    },
    initialize: function(options) {
      _.bindAll(this);
      this.account = options.account;
      this.headerView = options.headerView;
      this.footerView = options.footerView;
      (this.services = new Services()).fetch();
      (this.reads = new Reads()).fetch();
      (this.writes = new Writes()).fetch();
      this.zapsLoaded = false;
      this.reads.on('change reset', this.render);
      this.writes.on('change reset', this.render);
      this.services.on('change reset', this.render);
      return this.render();
    },
    render: function() {
      var loaded, notShowing, view, zapHtml,
        _this = this;
      zapHtml = [];
      notShowing = 0;
      if (this.reads.loaded && this.writes.loaded) loaded = true;
      this.reads.each(function(read) {
        var view, write, _ref, _ref2, _ref3;
        if (read.isComplete() && ((_ref = _this.writes.get(read.getWriteId())) != null ? _ref.isComplete() : void 0)) {
          write = _this.writes.get(read.getWriteId());
          view = {
            inputIcon: (_ref2 = _this.services.getByKey(read.get('selected_api'))) != null ? _ref2.getImageClass("32x32") : void 0,
            outputIcon: (_ref3 = _this.services.getByKey(write.get('selected_api'))) != null ? _ref3.getImageClass("32x32") : void 0,
            inputAction: $.humanReadable(read.get('action')),
            outputAction: $.humanReadable(write.get('action')),
            paused: read.get('paused'),
            id: read.id
          };
          return zapHtml.push(Mustache.to_html(ItemTemplate, view));
        } else {
          return notShowing = notShowing + 1;
        }
      });
      view = {
        zapHtml: zapHtml,
        notShowing: notShowing,
        loaded: loaded
      };
      return this.$el.html(Mustache.to_html(InitTemplate, view));
    },
    actionClick: function(e) {
      var action, zapId;
      action = $(e.currentTarget).attr('data-action');
      zapId = $(e.currentTarget).attr('data-zap');
      switch (action) {
        case 'run':
          this.run(zapId);
          break;
        case 'pause':
          this.pause(zapId);
          break;
        case 'unpause':
          this.unpause(zapId);
      }
      return false;
    },
    run: function(id) {
      var _this = this;
      if (this.reads.get(id).get('paused')) return;
      this.showLoading(id);
      $.ajax({
        type: "GET",
        url: "" + window.domain + "/api/v2/reads/" + id + "/run",
        contentType: 'application/json',
        data: '{"run": true}',
        dataType: 'json',
        success: function() {
          _this.hideLoading(id);
          _this.showSuccess(id);
          return setTimeout(function() {
            return _this.hideSuccess(id);
          }, 3000);
        },
        error: function() {
          return _this.hideLoading(id);
        }
      });
      return false;
    },
    pause: function(id) {
      var error, read, success,
        _this = this;
      this.showLoading(id);
      read = this.reads.get(id);
      read.set({
        paused: true
      });
      success = function() {
        _this.hideLoading(id);
        return _this.render();
      };
      error = function() {
        return _this.hideLoading(id);
      };
      read.save({}, {
        success: success,
        error: error
      });
      return false;
    },
    unpause: function(id) {
      var error, read, success,
        _this = this;
      this.showLoading(id);
      read = this.reads.get(id);
      read.set({
        paused: false
      });
      success = function() {
        _this.hideLoading(id);
        return _this.render();
      };
      error = function() {
        return _this.hideLoading(id);
      };
      read.save({}, {
        success: success,
        error: error
      });
      return false;
    },
    showLoading: function(id) {
      return this.$("li[data-zap=" + id + "]").find('div[data-loading=true]').removeClass('hide');
    },
    hideLoading: function(id) {
      return this.$("li[data-zap=" + id + "]").find('div[data-loading=true]').removeClass('hide').addClass('hide');
    },
    showSuccess: function(id) {
      return this.$("li[data-zap=" + id + "]").find('div[data-success=true]').removeClass('hide');
    },
    hideSuccess: function(id) {
      return this.$("li[data-zap=" + id + "]").find('div[data-success=true]').removeClass('hide').addClass('hide');
    }
  });
  return ZapsView;
});
