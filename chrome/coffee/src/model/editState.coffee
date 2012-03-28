define([
   'jquery',
   'use!underscore',
   'use!backbone',
],
($, _, Backbone) ->
   EditState = Backbone.Model.extend
      ###
      A Finite State Machine model, controls moving from various
      states for the Edit view
      ###
      defaults:
         onHomepage: false
         zapCreated: false
         showChooseServices: true
         showChooseAccounts: true
         showConfigureActions: true
         showDoThisIf: true
         showTestEnable: true
         showCreateZap: false
         showChooseServicesSelector: true

      initialize: (attrs, options) ->
         _.bindAll(@)

         @read = options.read
         @write = options.write
         @services = options.services
         @auths = options.auths
         @account = options.account

         @.on('change', @validate)
         @read.bind('change', @determine)
         @write.bind('change', @determine)
         @services.bind('change', @determine)
         @auths.bind('change', @determine)

      validate: () ->
         # Perform validation to ensure the state is okay and any prerequisites are met
         return false
      editting: () ->
         # Zap is being editted
         @.set
            zapCreated: true
      zapNotCreated: () ->
         # Zap has not been created yet (so show things that let the user create a zap)
         @.set
            zapCreated: false
      editOnlyServices: () ->
         # Only show the top part of the editor to choose services
         @.set
            showChooseServices: true
            showChooseAccounts: false
            showConfigureActions: false
            showDoThisIf: false
            showTestEnable: false
      chooseServices: () ->
         # Show the full picker for choosing services
         @.set
            showChooseServicesSelector: true
            showCreateZap: false
      doneChoosingServices: () ->
         # Called when the user manually says they are done choosing services
         @.set
            showChooseServicesSelector: false
      createZap: () ->
         ###
         Create the zap and enable the rest of the UI to edit it

         The goal is saving @read and @write up to the database so we can get an
         ID for each. In the future, there may be more than one write
         
         NOTE we have to do the read as a callback of account creation because we 
         need an account on the server before we can create objects for the user
         ###

         # define the functions
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
         # start the action
         saveRead()

      ableToCreateZap: () ->
         # Show the create a zap? button and cancel
         @.set
            showCreateZap: true
            showChooseServicesSelector: false
      determine: () ->
         # Automatically determines certain stateful conditions
         if @read.get('selected_api')? and @read.get('action')? and @write.get('selected_api')? and @write.get('action')?
            if not @.get('zapCreated')
               # only want to show the "Create a zap button" if the user hasnt created one yet
               @ableToCreateZap()

   return EditState
)