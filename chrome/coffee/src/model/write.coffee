define([
   'jquery',
   'use!underscore',
   'use!backbone',
],
($, _, Backbone) ->
   Write = Backbone.Model.extend
      ###
      A root data model. Defines a single write action including associated auth service
      and id.
      Write models are always attached to a /read to the url is dynamically generated
      via the Read model
      ###
      initialize: (attrs, options) ->
         _.bindAll(@)
         @.on('change', @enforceState)
         if options?.urlRoot?
            @.urlRoot = options.urlRoot
      parse: (response) ->
         @loaded = true
         return response
      enforceState: () ->
         ###
         Called after change, looks at the model and enforces certain fields which are
         dependent on earlier fields. For example, if this model has no chosen service,
         it does not make sense to have a chosen auth_id since auth_ids are tied to 
         specific services
         ###
         change = false
         options = {silent: true} # silent because we mass update all changes at end of func
         if not @.get('selected_api')? and @.get('action')?
            @.set({'action': null}, options)
            change = true
         if not @.get('selected_api')? and @.get('auth_id')?
            @.set({'auth_id': null}, options)
            change = true
         if change
            @.trigger('change')
         # force these keys to exist if they do not
         #forceExistKeys = ['action', 'auth_id', 'selected_api']
         #@.set({key: null}, {silent: true}); log key for key, inc in forceExistKeys when not @.get(key)?
      isComplete: () ->
         # Return boolean if this zap is complete (all fields have values and no errors)
         if @.id? and @.get('selected_api')? and @.get('action')? and @.get('read_id')? and @.get('errors').length == 0
            return true
         else
            return false

   return Write
)