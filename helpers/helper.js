
const puppeteer = require('puppeteer');
const xpath = require('xpath');
const dom = require('xmldom').DOMParser;
const db = require('../database');

exports.getChangeData = (url, rule)=> {

  return new Promise((resolve, reject)=>{
      puppeteer
      .launch({headless: true})
      .then(function(browser) {
          return browser.newPage();
      })
      .then(function(page) {
          return page.goto(url).then(function() {
          return page.content();
          });
      })
      .then(function(html) {
          const doc = new dom().parseFromString(html);
          const nodes = xpath.select(rule, doc);

          resolve(nodes[0].toString());
      })
      .catch(function(err) {
          reject(err);
      });
  });
};

exports.saveData = (data, next)=> {
    const collection = db.collection("jobs");
    collection.insert([data], {w:1}, function(err, result) {
        next(result);
    });
}


exports.getJobs = (next)=> {
    const collection = db.collection("jobs");
    collection.find({}).toArray( function(err, item) {
       next(item);
    });
}

exports.getJob = (url, next)=> {
    const collection = db.collection("jobs");
    collection.findOne({uri: url}, function(err, item) {
       next(item);
    });
}

module.exports = exports;