define([
   'jquery',
   'use!underscore',
   'use!backbone',
   'model/editState'
],
($, _, Backbone, EditState) ->
   HomeState = EditState.extend
      ###
      This Finite State Machine extends the EditView since most of what happens
      on the homepage is an extension of the zap editor.
      ###
      initialize: (attrs, options) ->
         EditState.prototype.initialize.call(@, attrs, options) # super, call parent
         @.set
            creatingAccount: false
      validate: () ->
         # Perform validation to ensure the state is okay and any prerequisites are met
         EditState.prototype.validate.call(@) # super, call parent
      onHomepage: () ->
         # Set state to homepage so the scripts can know if user is on home or regular
         # editor/creator
         @.set
            onHomepage: true
      offHomepage: () ->
         # Leaving homepage...
         @.set
            onHomepage: false
      createZap: () ->
         ###
         Create the zap and enable the rest of the UI to edit it

         A few things to create a zap from the homepage. First, we need
         to save (create) the account up to the server to get a new temporary
         account for this user. We should then have an authenticated user to save the
         @read and @write against
         NOTE the data: $.param({temp: 'true'}) is used to append GET params to the URL

         Next, the goal is saving @read and @write up to the database so we can get an
         ID for each. In the future, there may be more than one write
         
         NOTE we have to do the read as a callback of account creation because we 
         need an account on the server before we can create objects for the user
         ###

         # define the functions
         @.set
            creatingAccount: true
         continueEditing = () =>
            @.set
               showChooseServices: true
               showChooseAccounts: true
               showConfigureActions: true
               showDoThisIf: true
               showTestEnable: true
               showCreateZap: false
               showChooseServicesSelector: false
               zapCreated: true
               creatingAccount: false
         saveRead = () =>
            readSaveSuccess = (e) =>
               writeSaveSuccess = (e) =>
                  # finally, re-get @read to update its internal write_ids field
                  @read.fetch()
                  continueEditing()
               # now that write has an id, save it to the server too!
               @write.save({}, {success: writeSaveSuccess})
            @read.save({}, {success: readSaveSuccess})
         accountSaveSuccess = (e) =>
            saveRead()
         # start the action
         if not @account.isLoggedIn()
            @account.setTemp()
            @account.save({}, {success: accountSaveSuccess})

      determine: () ->
         # Automatically determines certain stateful conditions
         EditState.prototype.determine.call(@) # super, call parent

   return HomeState
)