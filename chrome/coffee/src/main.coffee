require.config(
   baseUrl: '/js/src',
   paths: {
      app:           'app',
      backbone:      '../library/backbone/0.9.1/backbone',
      backbonecache: '../library/backbone/cache/1.0.0/backboneCache',
      domready:      '../library/require/domReady/1.0.0/domReady',
      jasmine:       '../library/jasmine/2.0.0/jasmine',
      jasminehtml:   '../library/jasmine/2.0.0/jasmineHtml',
      jgrowl:        '../library/jgrowl/1.2.6/jgrowl',
      jquery:        '../library/jquery/1.7.0/jquery',
      json:          '../library/json/2.0.0/json',
      log:           '../library/log/log',
      manipulation:  '../library/jquery/manipulation/1.0.0/manipulation',
      md5:           '../library/md5/1.0.0/md5',
      mustache:      '../library/mustache/0.4/mustache',
      order:         '../library/require/order/1.0.0/order',
      outerHtml:     '../library/jquery/outerHtml/outerHtml',
      showdown:      '../library/showdown/1.0/showdown',
      snag:          '../library/snag/0.3.0/snag',
      template:      '../../template',
      text:          '../library/require/text/1.0.0/text',
      twipsy:        '../library/twipsy/1.4.0/twipsy',
      underscore:    '../library/underscore/1.3.1/underscore',
      use:           '../library/require/use/0.1.0/use',
   },
   # library dependecies
   use: {
      backbone: {
         deps: ["use!underscore", "jquery", "json"],
         attach: (_, $, Json) ->
            return window.Backbone
      }
      backbonecache: {
         deps: ["use!backbone"]
         attach: (Backbone) ->
            return window.Backbone
      }
      jgrowl: {
         deps: ["jquery"]
      }
      manipulation: {
         deps: ["jquery"]
      }
      outerHtml: {
         deps: ["jquery"]
      }
      twipsy: {
         deps: ["jquery"]
      }
      underscore: {
         attach: "_"
      }
   }
)

require([
   # app dependencies
   'json',
   'jquery',
   'use!underscore', 
   'use!backbone',
   'use!backbonecache',
   'use!manipulation',
   'log',
   # load our app
   'app',
],
(Json, $, _, Backbone, BackboneCache, Manipulation, Log, App) ->
   window.debug = true
   App.initialize()
)