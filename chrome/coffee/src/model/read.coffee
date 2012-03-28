define([
   'jquery',
   'use!underscore',
   'use!backbone',
   'collection/writes',
   'model/write',
],
($, _, Backbone, Writes, Write) ->
   Read = Backbone.Model.extend
      ###
      A root data model. Defines a single read action including associated auth service
      and id.
      ###
      urlRoot: () ->
         return "#{window.domain}/api/v2/reads"
      initialize: (attrs, options) ->
         _.bindAll(@)
         @writes = new Writes([new Write()])
         # never associate write with writes because they are independent in the api
         delete @getWrite().collection
         @.on('change:write_ids', @initWrite)
         @.on('change', @enforceState)
      parse: (response) ->
         @loaded = true
         return response
      initWrite: () ->
         ###
         Writes are always attached to reads. This function is called whenever the write ID
         array changes. It will initialize a Write model for each ID and fetch it
         NOTE: for now we only support 1 write model
         ###
         write = @getWrite()
         root = @urlRoot()
         write.urlRoot = "#{root}/#{@.id}/writes"
         if @.get('write_ids')?[0]?
            write.id = @getWriteId()
            write.fetch()
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
      getWrite: () ->
         # For now, we only support one write attached to a read, return it
         return @writes.at(0)
      getWriteId: () ->
         # Get the ID of the write attached to this read
         return @.get('write_ids')[0]
      isComplete: () ->
         # Return boolean if this zap is complete (all fields have values and no errors)
         if @.id? and @.get('selected_api')? and @.get('action')? and @.get('write_ids').length > 0 and @.get('errors').length == 0
            return true
         else
            return false

   return Read
)