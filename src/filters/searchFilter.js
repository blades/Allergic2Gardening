const elasticlunr = require("elasticlunr");

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
      title: page.template.frontMatter.data.title,
      description: page.template.frontMatter.data.description,
      date: page.template.frontMatter.data.date,
      tags: page.template.frontMatter.data.tags,
      body: page.templateContent.replace(/(<([^>]+)>)/gi, "")
    });
  });

  return index.toJSON();
};