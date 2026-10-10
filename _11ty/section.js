// Returns the part of a post before the <!--more--> marker (the whole post if
// there is no marker).
module.exports = function (str) {
  return String(str).split("<!--more-->")[0];
};
