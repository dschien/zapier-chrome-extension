define(['jquery'], function ($) {

$.fn.outerHTML = function() {
   return $('<div>').append( this.eq(0).clone() ).html();
};

}); // define