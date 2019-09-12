const express = require('express');
const router = express.Router();
const puppeteer = require('puppeteer');
const xpath = require('xpath');
const dom = require('xmldom').DOMParser;

const task = require('../task.json');
const sampleConfigs = JSON.parse(JSON.stringify(task));
const Helper = require('../helpers/helper');

/*  job apis. */
router.get('/', function(req, res) {

    res.send('Send url with proper Endpoint!');
   
});


router.get('/configs', function(req, res) {
    const url = req.query.url;
    const configDatas = sampleConfigs.data;

    if(url) {
        const result = configDatas.filter((data)=>data.uri=== url)[0];
        res.send(result);
    } else {
        res.send(configDatas);
    }
 });


 router.get('/rules', function(req, res) {
    const url = req.query.url;
    const configDatas = sampleConfigs.data;

    if(url) {
        let result = configDatas.filter((data)=>data.uri=== url)[0];
        res.send(result.config);
    } else {
        let rules  = configDatas.map((data)=>data.config)
        res.send(rules);
    }
 });

 router.get('/status', function(req, res) {
    const url = req.query.url;
    const configDatas = sampleConfigs.data;

    if(url) {
        let config = configDatas.filter((data)=>data.uri=== url)[0];

        if(config) {
            let rule = JSON.parse(config.config);
            let exp = rule.selections[0].frames[0].includes[0];

            Helper.getChangeData(url, exp.expr).then((node)=>{
                console.log(node)
                res.send(node.toString())
            });
        } else {
            res.send('config not found');
        }
        
    } else {
        res.send('url is missing!');
    }
 });


module.exports = router;