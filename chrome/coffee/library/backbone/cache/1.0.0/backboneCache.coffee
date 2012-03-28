###

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

###

# initialize cache store
window.BackboneCache = {}

# namespace cache methods
Backbone.cache = () ->

# save sync for later use
Backbone._sync = Backbone.sync

# map sync methods
methodMap =
 'create': 'POST'
 'update': 'PUT'
 'delete': 'DELETE'
 'read':   'GET'

# convienence method to access properties as either props or urls
getValue = (object, prop) ->
   return null if not object? or not object[prop]?
   return object[prop]() if _.isFunction(object[prop])
   return object[prop]

# returns boolean if a cache exists/non-expired for a url
Backbone.cache.exists = (url) ->
   if window.BackboneCache?[url]?
      return true
   else
      return false

# set some json into the cache
Backbone.cache.set = (url, json, status, xhr) ->
   time = new Date().getTime()
   window.BackboneCache[url] = {}
   window.BackboneCache[url].url = url
   window.BackboneCache[url].time = time
   window.BackboneCache[url].json = json
   window.BackboneCache[url].status = status
   window.BackboneCache[url].xhr = xhr

# retrieve som json from the cache
Backbone.cache.get = (url) ->
   return window.BackboneCache?[url]

# clear a specific cache
Backbone.cache.clear = (url) ->
   if window.BackboneCache[url]?
      delete window.BackboneCache[url]

# clear a specific cache if expired (expiry milliseconds have elapsed)
Backbone.cache.expire = (url, expiry) ->
   if Backbone.cache.exists(url)
      now = new Date().getTime()
      cache = Backbone.cache.get(url)
      if (cache.time + expiry) < now
         Backbone.cache.clear(url)

# define cached sync method to hook in
Backbone.sync = (method, model, options) ->
   type = methodMap[method]
   url = getValue(model, 'url')

   # cache only GET request responses
   # and make sure we have a url
   if type == 'GET' and url?

      # if `cache: false` passed the cache for the url is cleared
      # forcing a refresh from the server
      if options.cache? and not options.cache
         Backbone.cache.clear(url)

      # if `expiry: int` passed, compare lifespan of cache and clear
      # it if lifespan > expiry
      if options.expiry?
         Backbone.cache.expire(url, options.expiry) 

      # short-circuit fetch and return cache if it exists
      if Backbone.cache.exists(url)
         cache = Backbone.cache.get(url)
         options.success(cache.json, cache.status, cache.xhr)
         return

      # callback to set cache from successful response
      success = options.success
      options.success = (resp, status, xhr) =>
         Backbone.cache.set(url, resp, status, xhr)
         success(resp, status, xhr)

   # sync to actual server
   Backbone._sync(method, model, options)