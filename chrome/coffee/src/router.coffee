define([
   'jquery',
   'use!underscore',
   'use!backbone',
   'view/__init__',
   'view/zaps/__init__',
   'view/account/__init__',
],
($, _, Backbone, ViewportView, ZapsView, AccountView) ->
   AppRouter = Backbone.Router.extend
      ###
      App and Router. All requests come through this. Each route requires a specific
      page init file which sets up all the classes on the page. This also allows the
      browser/requirejs to only load necessary page modules defined in each /init/ file
      ###
      routes: {
         '': 'zaps',
         '/': 'zaps',

         'account': 'account',
         'account/': 'account',

      }         
      initialize: () ->
         @viewport = new ViewportView
            router: @

      load: (view, options) ->
         @viewport.render(view, options)

      zaps: () ->
         @load(ZapsView, {loginRequired: false})

      account: () ->
         @load(AccountView, {loginRequired: false})

   return AppRouter
)