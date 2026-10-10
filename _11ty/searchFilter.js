const elasticlunr = require("elasticlunr");

const squash = require("./squash");

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