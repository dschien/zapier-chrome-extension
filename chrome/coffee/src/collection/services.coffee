define([
   'jquery',
   'use!underscore',
   'use!backbone',
   'model/service',
],
($, _, Backbone, Service) ->
   window.Services = Backbone.Collection.extend
      ###
      Collection of services, used in views. Offers a way to retrieve a single
      service model given it's key since service models do not have IDs
      ###
      model: Service
      url: () ->
         return "#{window.domain}/api/v2/services"
      initialize: (options) ->
         return
      parse: (response) ->
         # Parse results from api for collections (data is stored in objects key)
         @loaded = true
         return response.objects
      getByKey: (key) ->
         # Service keys are unique, one key never equals more than one Service
         return null if not key?
         match = null
         @.each (model) ->
            if model.get('key') == key
               match = model
         return match
   return Services
)