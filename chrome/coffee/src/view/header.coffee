define([
   'jquery',
   'use!underscore',
   'use!backbone',
   'mustache',
   'text!template/header.html',
],
($, _, Backbone, MustacheWrapper, FooterTemplate) ->
   HeaderView = Backbone.View.extend
      ###
      Header
      ###
      initialize: (options) ->
         _.bindAll(@, 'render')
         @render()
      render: () ->
         view =
            place: "holder"
         @$el.html(Mustache.to_html(FooterTemplate, view))
   return HeaderView
)