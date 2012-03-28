define([
   'jquery',
   'use!underscore',
   'use!backbone',
   'mustache',
   'text!template/account/__init__.html',
   'md5',
],
($, _, Backbone, MustacheWrapper, InitTemplate, Md5Wrapper) ->

   AccountView = Backbone.View.extend
      ###
      Account view
      ###
      initialize: (options) ->
         _.bindAll(@)
         @account = options.account
         @headerView = options.headerView
         @footerView = options.footerView

         @render()
         
      render: () ->
         view =
            username: @account.get('username')
            email: @account.get('email')
            emailHash: hex_md5($.trim(@account.get('email')).toLowerCase()).toLowerCase()
         @$el.html(Mustache.to_html(InitTemplate, view))

   return AccountView
)