define([
   'jquery',
   'use!underscore',
   'use!backbone',
   'mustache',
   'text!template/__init__.html',
   'model/account',
   'view/header',
   'view/footer',
   'view/zaps/__init__',
   'view/account/__init__',
],
($, _, Backbone, MustacheWrapper, InitTemplate, Account, HeaderView, FooterView, ZapsView, AccountView) ->

   Viewport = Backbone.View.extend
      ###
      Top level view which controls entire viewport
      ###
      events:
         'click li[data-tab]': 'tabClick'
         'click *[data-navlink]': 'navClick'

      initialize: (options) ->
         _.bindAll(@)
         @.setElement($('body'))

         # User introspects itself from from server, no ID necessary here
         (@account = new Account()).fetch
            error: (account, e) =>
               account.trigger('reset')

         @account.on('change reset', @verifyLoggedIn)

         @render()

      render: (appView, options) ->      
         # If an appView was passed, render it into the app frame
         if appView?
            # unload previous view if it specified an unload function
            if @appView?.unload?
               @appView.unload.call(@appView)

            # unbind all events attached to old view
            if @appView?.undelegateEvents?
               @appView.undelegateEvents()

            defaults = 
               el: @$('*[data-app]')
               account: @account
               headerView: @headerView
               footerView: @footerView
                        
            @appView = new appView($.extend(defaults, options))
         
         # else render the normal viewport view
         else
            view =
               place: 'holder'
            @$el.html(Mustache.to_html(InitTemplate, view))
            
            @headerView = new HeaderView
               el: @$('div[data-header=true]')
               account: @account

            @footerView = new FooterView
               el: @$('div[data-footer=true]')
               account: @account

      navigate: (path) ->
         # Navigate to the path inside a new browser tab
         chrome.tabs.create({url:"#{window.domain}/#{path}"})
         window.close()

      verifyLoggedIn: () ->
         # Force user to be logged in
         if not @account.isLoggedIn()
            @navigate('app/login')

      tabClick: (e) ->
         # Called when a tab is clicked, handle navigation
         tab = $(e.currentTarget).attr('data-tab')
         load = (tab, view, options) =>
            log @$('ul[data-tabs]').find('li')
            @$('ul[data-tabs]').find('li').removeClass('selected')
            @$('ul[data-tabs]').find("li[data-tab=#{tab}]").addClass('selected')
            @render(view, options)
         switch tab
            when "zaps" then load(tab, ZapsView, {})
            when "account" then load(tab, AccountView, {})
         return false # cancel click

      navClick: (e) ->
         # Link clicked to open an external link
         path = $(e.currentTarget).attr('data-navlink')
         @navigate(path)
         return false # cancel click

   return Viewport
)