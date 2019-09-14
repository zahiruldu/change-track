const express = require('express');
const router = express.Router();
const puppeteer = require('puppeteer');
const xpath = require('xpath');
const dom = require('xmldom').DOMParser;

const task = require('../task.json');
const sampleConfigs = JSON.parse(JSON.stringify(task));
const Helper = require('../helpers/helper');

/*  job apis. */
router.get('/', (req, res)=> {
    res.send({
      message: 'Send url with proper Endpoint!'
    });
});


router.get('/configs', (req, res)=> {
    const url = req.query.url;
    const configDatas = sampleConfigs.data;

    if(url) {
        const result = configDatas.filter((data)=>data.uri=== url)[0];
        res.send(result);
    } else {
        res.send(configDatas);
    }
 });


 router.get('/rules', (req, res)=> {
    const url = req.query.url;
    const configDatas = sampleConfigs.data;

    if(url) {
        let result = configDatas.filter((data)=>data.uri=== url)[0];
        
        res.send(JSON.parse(result.config));
    } else {
        let rules  = configDatas.map((data)=>JSON.parse(data.config))
        res.send(rules);
    }
 });

 router.get('/status', async(req, res)=> {
    const url = req.query.url;
    const configDatas = sampleConfigs.data;

    let dbRecord;
    await Helper.getJob(url,(data)=>dbRecord = data);

    if(url) {
        let config = configDatas.filter((data)=>data.uri=== url)[0];

        if(config) {
            let rule = JSON.parse(config.config);
            let exp = rule.selections[0].frames[0].includes[0];

            Helper.getChangeData(url, exp.expr).then((node)=>{
                rule.dataAttr = node.toString();
                var d = new Date();
                var n = d.toISOString();
                let newObj = Object.assign(config,{config: rule,ts: n});

                if(dbRecord && dbRecord.config.dataAttr === node.toString()) {
                    // Sending old configs when no changes found
                    Helper.getChangesets(url,(data)=>{
                        res.send(data);
                    });
                } else {
                    // Saving new data
                    Helper.saveData(newObj,(result)=>{
                        // Sending all chnagessets
                        Helper.getChangesets(url,(data)=>{
                            res.send(data);
                        });
                        
                    });
                }
            });
        } else {
            res.status(400).send({message: 'config not found for this url'});
        }
        
    } else {
        res.status(400).send({message: 'url is missing!'});
    }
 });

 router.get('/jobs', (req, res)=> {
    Helper.getJobs((data)=>{
        res.send(data);
    });
});


module.exports = router;