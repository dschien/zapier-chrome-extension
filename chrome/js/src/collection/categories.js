
define(['jquery', 'use!underscore', 'use!backbone', 'model/category'], function($, _, Backbone, Category) {
  var Categories;
  Categories = Backbone.Collection.extend({
    /*
          Holds a simple list of all categories
    */
    model: Category,
    initialize: function(options) {},
    dedupe: function() {
      var collectionArray,
        _this = this;
      collectionArray = [];
      this.each(function(item) {
        return collectionArray.push(item.toJSON());
      });
      collectionArray = _.uniq(collectionArray, false, function(each) {
        return each.name;
      });
      return this.reset(collectionArray);
    },
    comparator: function(category) {
      return category.getKey();
    },
    getByKey: function(key) {
      var match,
        _this = this;
      match = null;
      this.each(function(category) {
        if (category.getKey() === key) return match = category;
      });
      return match;
    }
  });
  return Categories;
});
