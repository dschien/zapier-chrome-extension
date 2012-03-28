define([
   'jquery',
   'use!underscore',
   'use!backbone',
],
($, _, Backbone) ->
   Auth = Backbone.Model.extend
      ###
      A root model. Each model represents a single service the current user has authenticated
      with. These typically wont change once the page has been loaded and the model has no ID;
      rather, it uses 'key' to identify each authenticate service
      ###
      urlRoot: () ->
         return "#{window.domain}/api/v2/auths"
      defaults:
         'id': null # id of auth set
         'key': null # key of service this auth is for
      initialize: (attrs, options) ->
         return
      parse: (response) ->
         @loaded = true
         return response
      validateModel: () ->
         # Check all expected keys and arrays exist
         return false if not @get('key')?
         return true # else
      getName: (services) ->
         # Return the auth title name if exists, else return raw auth name
         base = services.getByKey(@.get('selected_api')).getName()
         if @.get('title')?
            name = @.get('title')+' ('+base+')'
         else
            name = base+' ('+@.id+')'
         return name
         
   return Auth
)