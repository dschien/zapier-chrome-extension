define([
   'jquery',
   'use!underscore',
   'use!backbone',
   'mustache',
   'text!template/zaps/__init__.html',
   'text!template/zaps/zapItem.html',
   'collection/services',
   'collection/reads',
   'collection/writes',
],
($, _, Backbone, MustacheWrapper, InitTemplate, ItemTemplate, Services, Reads, Writes) ->

   ZapsView = Backbone.View.extend
      ###
      Zaps view
      ###
      events:
         'click a[data-action]': 'actionClick'

      initialize: (options) ->
         _.bindAll(@)
         @account = options.account
         @headerView = options.headerView
         @footerView = options.footerView

         (@services = new Services()).fetch()
         (@reads = new Reads()).fetch()
         (@writes = new Writes()).fetch()

         @zapsLoaded = false
         @reads.on('change reset', @render)
         @writes.on('change reset', @render)
         @services.on('change reset', @render)

         @render()

      render: () ->
         # loop over all zaps (reads) and build the zap html
         zapHtml = []
         notShowing = 0
         if @reads.loaded and @writes.loaded
            loaded = true
         @reads.each (read) =>
            if read.isComplete() and @writes.get(read.getWriteId())?.isComplete()
               write = @writes.get(read.getWriteId())
               view = 
                  inputIcon: @services.getByKey(read.get('selected_api'))?.getImageClass("32x32")
                  outputIcon: @services.getByKey(write.get('selected_api'))?.getImageClass("32x32")
                  inputAction: $.humanReadable(read.get('action'))
                  outputAction: $.humanReadable(write.get('action'))
                  paused: read.get('paused')
                  id: read.id
               zapHtml.push(Mustache.to_html(ItemTemplate, view))
            else
               notShowing = notShowing + 1
         view =
            zapHtml: zapHtml
            notShowing: notShowing
            loaded: loaded
         @$el.html(Mustache.to_html(InitTemplate, view))
      
      actionClick: (e) ->
         # Callback handler for clicking an action item
         action = $(e.currentTarget).attr('data-action')
         zapId = $(e.currentTarget).attr('data-zap')
         switch action
            when 'run' then @run(zapId)
            when 'pause' then @pause(zapId)
            when 'unpause' then @unpause(zapId)
         return false # cancel click

      run: (id) ->
         # Run the zap with the id specified
         return if @reads.get(id).get('paused')
         @showLoading(id)
         $.ajax
            type: "GET"
            url: "#{window.domain}/api/v2/reads/#{id}/run"
            contentType: 'application/json'
            data: '{"run": true}'
            dataType: 'json'
            success: () =>
               @hideLoading(id)
               @showSuccess(id)
               setTimeout(
                  () =>
                     @hideSuccess(id)
                  3000)
            error: () =>
               @hideLoading(id)
         return false # cancel click

      pause: (id) ->
         # Puase the zap with the id specified
         @showLoading(id)
         read = @reads.get(id)
         read.set({paused: true})
         success = () =>
            @hideLoading(id)
            @render()
         error = () =>
            @hideLoading(id)
         read.save({}, {success: success, error: error})
         return false # cancel click

      unpause: (id) ->
         # Unpuase the zap with the id specified
         @showLoading(id)
         read = @reads.get(id)
         read.set({paused: false})
         success = () =>
            @hideLoading(id)
            @render()
         error = () =>
            @hideLoading(id)
         read.save({}, {success: success, error: error})
         return false # cancel click
      
      showLoading: (id) ->
         @$("li[data-zap=#{id}]").find('div[data-loading=true]').removeClass('hide')
      hideLoading: (id) ->
         @$("li[data-zap=#{id}]").find('div[data-loading=true]').removeClass('hide').addClass('hide')

      showSuccess: (id) ->
         @$("li[data-zap=#{id}]").find('div[data-success=true]').removeClass('hide')
      hideSuccess: (id) ->
         @$("li[data-zap=#{id}]").find('div[data-success=true]').removeClass('hide').addClass('hide')
   
   return ZapsView
)