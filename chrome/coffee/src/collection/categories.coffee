define([
   'jquery',
   'use!underscore',
   'use!backbone',
   'model/category',
],
($, _, Backbone, Category) ->
   Categories = Backbone.Collection.extend
      ###
      Holds a simple list of all categories
      ###
      model: Category
      initialize: (options) ->
         return
      dedupe: () ->
         # Go through each category model and remove it if it matches a previous model
         collectionArray = []
         @.each (item) =>
            collectionArray.push(item.toJSON())
         collectionArray = _.uniq collectionArray, false, (each) ->
            return each.name
         @.reset(collectionArray)
      comparator: (category) ->
         # Allows categories to be sorted in alphabetical order
         return category.getKey()
      getByKey: (key) ->
         # Return the model with matching key
         match = null
         @.each (category) =>
            if category.getKey() == key
               match = category
         return match
   return Categories
)