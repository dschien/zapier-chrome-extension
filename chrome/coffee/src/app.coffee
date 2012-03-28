define([
   # define all the dependencies of our application
   'jquery',
   'use!underscore', 
   'use!backbone',
   'router'
],
($, _, Backbone, Router) ->
      
   initialize = () ->
      window.domain = "http://zapier.local"

      @router = new Router()

      # load root page if no initial route matched the URL in the address bar
      if not Backbone.history.start({pushState: true, root: "/"})
         @router.navigate('/', true)

      # send all HTTP requests via POST, method supplied in "_method"
      Backbone.emulateHTTP = false

   return {initialize: initialize}
)