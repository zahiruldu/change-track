
const puppeteer = require('puppeteer');
const xpath = require('xpath');
const dom = require('xmldom').DOMParser;

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

module.exports = exports;