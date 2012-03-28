define([
   'jquery',
   'use!underscore',
   'use!backbone',
],
($, _, Backbone, EditState) ->
   DashboardState = Backbone.Model.extend
      ###
      This Finite State Machine for dashboard
      ###
      initialize: (attrs, options) ->
         return
      validate: () ->
         # Perform validation to ensure the state is okay and any prerequisites are met
         return
      determine: () ->
         # Automatically determines certain stateful conditions
         return

   return DashboardState
)