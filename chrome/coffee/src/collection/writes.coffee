define([
   'jquery',
   'use!underscore',
   'use!backbone',
   'model/write'
],
($, _, Backbone, Write) ->
   Writes = Backbone.Collection.extend
      ###
      Collection of writes. For future use in a dashboard.
      ###
      model: Write
      url: () ->
         return "#{window.domain}/api/v2/writes"
      initialize: (options) ->
         return
      parse: (response) ->
         # Parse results from api for collections (data is stored in objects key)
         @loaded = true
         return response.objects
   return Writes
)