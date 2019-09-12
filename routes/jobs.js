var express = require('express');
var router = express.Router();
const puppeteer = require('puppeteer');
var xpath = require('xpath')
  , dom = require('xmldom').DOMParser

/* GET users listing. */
router.get('/', function(req, res, next) {

    const $ = require('cheerio');
    const url = 'https://www.google.com';
    
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

        var doc = new dom().parseFromString(html)

        var nodes = xpath.select('//title', doc);
        console.log(nodes);
        console.log(nodes[0].localName + ": " + nodes[0].firstChild.data);
        console.log("Node: " + nodes[0].toString())
      })
      .catch(function(err) {
        //handle error
      });
});

module.exports = router;