define([
   'jquery',
   'use!underscore',
   'use!backbone',
   'mustache',
   'text!template/footer.html',
],
($, _, Backbone, MustacheWrapper, FooterTemplate) ->
   FooterView = Backbone.View.extend
      ###
      Footer view
      ###
      initialize: (options) ->
         _.bindAll(@, 'render')
         @render()
      render: () ->
         view =
            place: "holder"
         @$el.html(Mustache.to_html(FooterTemplate, view))
   return FooterView
)