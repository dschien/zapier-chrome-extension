
jQuery.capitalize = function(string) {
  if (string != null) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  } else {
    return string;
  }
};

jQuery.humanReadable = function(string) {
  var i, pos;
  if (string != null) {
    string = jQuery.capitalize(string).replace('_', ' ');
    i = 0;
    while (string.indexOf(' ', i) !== -1) {
      pos = string.indexOf(' ', i);
      string = string.substr(0, pos + 1) + string.charAt(pos + 1).toUpperCase() + string.substr(pos + 2);
      i = i + pos;
    }
  }
  return string;
};
