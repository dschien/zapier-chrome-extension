define([
   'jquery',
   'use!underscore',
   'use!backbone',
],
($, _, Backbone, ManipulateWrapper) ->
   Service = Backbone.Model.extend
      ###
      A root data model. Services typically will not change during a single request.
      Each service model is a service the app supports (even if the user doesn't have 
      auth for it yet). This model provides extra information for each service.
      Each model does not have an ID. This model uses 'key' to identify itself.
      ###
      urlRoot: () ->
         return "#{window.domain}/api/v2/services"
      initialize: (attrs, options) ->
         return
      parse: (response) ->
         @loaded = true
         return response
      getName: () ->
         # Return the human readable name if exists, else return raw service name
         return @.get('meta').human_readable_key if @.get('meta').human_readable_key?
         return @.get('key') # else
      getNameArticle: () ->
         # Return an article (a) or (an) based on getName
         vowels = ['a', 'e', 'i', 'o', 'u']
         vowel = false
         letter = @getName().toLowerCase()[0]
         vowel = true for v in vowels when letter == v
         return 'an' if vowel
         return 'a' # else
      hasReads: () ->
         # Returns bool whether this service has any read actions
         return true if @countActions(@.get('reads')) > 0
         return false # else
      hasWrites: () ->
         # Returns bool whether this service has any write actions
         return true if @countActions(@.get('writes')) > 0
         return false # else
      countActions: (actions) ->
         # Return the length of the HASH actions (it's not an array)
         # so we cant use .length
         isEmpty = (object) ->
            for own key, value of object
               return false
            return true
         actions = (action for action in actions when not isEmpty(action))
         return actions.length
      requiresAuth: () ->
         ###
         Does this web service require authentication to use? If not, it is usually
         an in-house api
         Note "extra info" constitutes auth required as well but user should be shown a
         different view
         ###
         return true if @hasHook()
         return true if @.get('auth')? and @.get('auth').length > 0
         return false # else
      hasHook: () ->
         # Does this web service have a webhook which needs to be completed?
         return true if @.get('meta').hook
         return false # else
      getImageClass: (size="64x64") ->
         # Returns the css spritesheet class for the image of the service if it
         # exists, else a placeholder
         if @.get('css')?[size]?
            css = @.get('css')[size]
         else 
            css = 'placeholder'
         return css
      getCategories: () ->
         # Returns an array of all categories attached to this service
         
         return @.get('categories')
   return Service
)