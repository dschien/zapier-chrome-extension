define([
   'jquery',
   'use!underscore',
   'use!backbone',
   'json', 
],
($, _, Backbone, JsonWrapper) ->
   Account = Backbone.Model.extend
      ###
      This model represents the currently logged in user and details about them.
      ###
      urlRoot: () ->
         return "#{window.domain}/api/v2/accounts/me"
      initialize: (attrs, options) ->
         return
      parse: (response) ->
         @loaded = true
         return response
      save: (attrs, options) ->
         # Overwriting the built in save function to handle the temp account stuff
         # check if the url needs to be updated to include ?temp=true if isNew
         if @.isNew()
            @.urlRoot = "#{window.domain}/api/v2/accounts/me?temp=true"
         # check if account is going from temp -> full
         if @tempValidate()
            Backbone.Model.prototype.save.call(@, attrs, options) # super, call parent
         # always set the url back
         @.urlRoot = "#{window.domain}/api/v2/accounts/me"
      tempValidate: (attrs) ->
         ###
         Validate the model if this is a temp account. We want to check
         if this isNew and we are trying to set an account to be not temp (that
         is, we want to turn a temp account into a full account) we also need to
         provide a username, email, password, password confirm to the server
         @.get('username')
         @.get('email')
         @.get('password1')
         @.get('password2')
         ###
         if @.isNew() and not @.get('temp')
            # new user, and we're about to save temp=false to server
            if @.get('username')? and @.get('email')? and @.get('password1')? and @.get('passwords')?
               # okay everything looks good
               return true
            else
               return false
         # account is not new or temp is false
         return true
      isLoggedIn: () ->
         # method which returns if the user this account represents is logged in.
         # Checks with the server if not logged in locally
         return @.id?
      isTemp: () ->
         # return whether this account is a temp account or not (returns false if logged out)
         if @.get('temp')?
            return @.get('temp')
         else
            return false
      setTemp: () ->
         # Temp accounts are only created on the homepage, but any account could be
         # a temp account.
         @.set({temp: true})
      removeTemp: () ->
         # Opposite of setTemp. Note if you save this to the server, we also need to
         # supply a username, email, password, password confirm else error
         @.set({temp: false})
      login: (username, password, options={}) ->
         # put the username, password to the api then fetch the model on success to 
         # log the user in
         data = {username: username, password: password}
         $.ajax
            url: "#{window.domain}/api/v2/accounts/session",
            type: 'put',
            data: JSON.stringify(data),
            dataType: 'json',
            success: () =>
               @.fetch
                  success: () =>
                     if options.success?
                        options.success.call(@)                        
                  error: () =>
                     if options.error?
                        options.error.call(@)
            error: () =>
               if options.error?
                  options.error.call(@)
      logout: () ->
         # logout the user via api call
         $.ajax
            url: "#{window.domain}/api/v2/accounts/session",
            type: 'delete',
            success: () ->
               window.location.href = '/'

   return Account
)