define([
   'jquery',
   'use!underscore',
   'use!backbone',
   'model/read'
],
($, _, Backbone, Read) ->
   Reads = Backbone.Collection.extend
      ###
      Collection of Reads. For future use in a dashboard.
      ###
      model: Read
      url: () ->
         return "#{window.domain}/api/v2/reads"
      initialize: (options) ->
         return
      parse: (response) ->
         # Parse results from api for collections (data is stored in objects key) 
         @loaded = true
         return response.objects
   return Reads
)