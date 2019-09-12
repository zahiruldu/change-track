const express = require('express');
const router = express.Router();
const puppeteer = require('puppeteer');
const xpath = require('xpath');
const dom = require('xmldom').DOMParser;

const task = require('../task.json');
const sampleConfigs = JSON.parse(JSON.stringify(task));

/*  job apis. */
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

router.get('/configs', function(req, res, next) {
    const url = req.query.url;
    const configDatas = sampleConfigs.data;

    if(url) {
        const result = configDatas.filter((data)=>data.uri=== url)[0];
        res.send(result);
    } else {
        res.send(configDatas);
    }
 });

module.exports = router;