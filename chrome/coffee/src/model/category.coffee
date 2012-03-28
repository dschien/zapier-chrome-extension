define([
   'jquery',
   'use!underscore',
   'use!backbone',
],
($, _, Backbone) ->
   Category = Backbone.Model.extend
      ###
      Holds data about a single category, methods to represent it
      ###
      defaults:
         "key": "undefined"
         "name": "Undefined"
      initialize: (attrs, options) ->
         return
      parse: (response) ->
         @loaded = true
         return response
      getKey: () ->
         # Key by which to programmatically represent the category
         return @.get('key') if @.get('key')? and @.get('key') != 'undefined'
         return @.get('name').toLowerCase().split(' ').join('_')
      getName: () ->
         # Name by which to show the category
         return @.get('name')
   return Category
)