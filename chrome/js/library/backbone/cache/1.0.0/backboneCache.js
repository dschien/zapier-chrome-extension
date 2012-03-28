/*

Lightweight Backbone Cache
Mike Knoop, 2012 (knoopgroup.com, zapier.com)

Simply execute this script file sometime after you load Backbone.
It hooks into the Backbone sync function to give a lightweight local
cache for models and collections. Will work for both models and collections.
Only GET requests are eligible for cacheing and caches are stored by URL.

Example "usage"

MyModel.fetch() # will GET from server on first call, from cache then on
MyModel.fetch({cache: false}) # force GET from server
MyModel.fetch({expiry: 5000}) # GET from server if cache is expiry milliseconds old
*/
var getValue, methodMap;

window.BackboneCache = {};

Backbone.cache = function() {};

Backbone._sync = Backbone.sync;

methodMap = {
  'create': 'POST',
  'update': 'PUT',
  'delete': 'DELETE',
  'read': 'GET'
};

getValue = function(object, prop) {
  if (!(object != null) || !(object[prop] != null)) return null;
  if (_.isFunction(object[prop])) return object[prop]();
  return object[prop];
};

Backbone.cache.exists = function(url) {
  var _ref;
  if (((_ref = window.BackboneCache) != null ? _ref[url] : void 0) != null) {
    return true;
  } else {
    return false;
  }
};

Backbone.cache.set = function(url, json, status, xhr) {
  var time;
  time = new Date().getTime();
  window.BackboneCache[url] = {};
  window.BackboneCache[url].url = url;
  window.BackboneCache[url].time = time;
  window.BackboneCache[url].json = json;
  window.BackboneCache[url].status = status;
  return window.BackboneCache[url].xhr = xhr;
};

Backbone.cache.get = function(url) {
  var _ref;
  return (_ref = window.BackboneCache) != null ? _ref[url] : void 0;
};

Backbone.cache.clear = function(url) {
  if (window.BackboneCache[url] != null) return delete window.BackboneCache[url];
};

Backbone.cache.expire = function(url, expiry) {
  var cache, now;
  if (Backbone.cache.exists(url)) {
    now = new Date().getTime();
    cache = Backbone.cache.get(url);
    if ((cache.time + expiry) < now) return Backbone.cache.clear(url);
  }
};

Backbone.sync = function(method, model, options) {
  var cache, success, type, url,
    _this = this;
  type = methodMap[method];
  url = getValue(model, 'url');
  if (type === 'GET' && (url != null)) {
    if ((options.cache != null) && !options.cache) Backbone.cache.clear(url);
    if (options.expiry != null) Backbone.cache.expire(url, options.expiry);
    if (Backbone.cache.exists(url)) {
      cache = Backbone.cache.get(url);
      options.success(cache.json, cache.status, cache.xhr);
      return;
    }
    success = options.success;
    options.success = function(resp, status, xhr) {
      Backbone.cache.set(url, resp, status, xhr);
      return success(resp, status, xhr);
    };
  }
  return Backbone._sync(method, model, options);
};
