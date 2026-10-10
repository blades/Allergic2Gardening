const elasticlunr = require("elasticlunr");

var squash = function(text) {
  var content = new String(text);

  // all lower case, please
  var content = content.toLowerCase();

  // remove all html elements and new lines
  var re = /(&lt;.*?&gt;)|(<.*?>)/gi;
  var plain = unescape(content.replace(re, ''));

  // remove duplicated words
  var words = plain.split(' ');
  var deduped = [...(new Set(words))];
  var dedupedStr = deduped.join(' ')

  // remove short and less meaningful words
  var result = dedupedStr.replace(/\b(\.|\,|the|a|an|and|am|you|I|to|if|of|off|me|my|on|in|it|is|at|as|we|do|be|has|but|was|so|no|not|or|up|for)\b/gi, '');
  //remove newlines, and punctuation
  result = result.replace(/\.|\,|\?|-|—|\n/g, '');
  //remove repeated spaces
  result = result.replace(/([ ]{2,}|\t+)/g, ' ');

  return result;
}

module.exports = function (collection) {
  // what fields we'd like our index to consist of
  var index = elasticlunr(function () {
    this.addField("title");
    this.addField("description");
    this.addField("date");
    this.addField("tags");
    this.addField("body");
    this.setRef("id");
  });

  // loop through each page and add it to the index
  collection.forEach((page) => {
    index.addDoc({
      id: page.url,
      title: page.data.title,
      description: page.data.description,
      date: page.data.date,
      tags: page.data.tags,
      body: squash(page.templateContent)
    });
  });

  return index.toJSON();
};