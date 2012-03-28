define([
   'jquery',
   'use!underscore',
   'use!backbone',
   'json',
   'model/auth',
],
($, _, Backbone, JsonWrapper, Auth) ->
   Auths = Backbone.Collection.extend
      ###
      Collection of authenticated services. This is what is psased into views for use.
      ###
      model: Auth
      url: () ->
         return "#{window.domain}/api/v2/auths"
      initialize: (options) ->
         return
      parse: (response) ->
         # Parse results from api for collections (data is stored in objects key)
         @loaded = true
         return response.objects
      getByKey: (key) ->
         # Auth keys are not unique (key of service name). Each Service might have multiple
         # authentications per service. Auths.getByKey returns an array of auth models which
         # match the requested key
         return null if not key?
         match = []
         @.each (model) ->
            if model.get('selected_api') == key
               match.push(model)
         return match
      hasAtLeastOneAuth: (key) ->
         # Returns true/false if the given API (by key name) is complete
         auth = @getByKey(key)
         return true if auth? and auth.length > 0
         return false # else
      pollForUpdate: (interval, iters, callback) ->
         # Polls the API until API named key exists or interval/iters is up
         i = 0
         match = false
         originalJson = JSON.stringify(@)
         poll = setInterval(
            =>
               success = (e) ->
                  log 'Account Poll Iter Success', i
                  if (originalJson != JSON.stringify(e))
                     # new model in collection! get notified by binding to
                     # reset/add/remove
                     log 'New Account Found!'
                     clearInterval(poll)
                     callback.success.call(@)
               error = (e) ->
                  # one-off poll error, don't call error callback
               @fetch({success: success, error: error})
               i = i + 1
               if i == iters
                  log 'Account Poll Stopping, Max Iterations'
                  clearInterval(poll)
                  callback.maxIter.call(@)
            interval)
         return poll

   return Auths
)