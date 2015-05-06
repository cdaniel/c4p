/* Copyright 2015 Krzysztof Daniel

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.*/
var express = require('express');
var stormpath = require('express-stormpath');
var json2xls = require('json2xls');


module.exports = function _export(client) {

    var router = express.Router();
    router.use(json2xls.middleware);
    router.all('/', function(req, res) {
        var result = [];
        client.getDirectory('https://api.stormpath.com/v1/directories/5ORJpKCq7vcseaHz5Ztgmp', {
            expand : 'accounts'
        }, function(err, dir) {
            dir.getAccounts({
                expand : 'customData'
            }, function(err, accounts) {
                accounts.each(function(account, cb) {
                    for(var proposalIndex in account.customData.proposals){
                        result.push({
                                    email : account.email,
                                    firstname : account.givenName,
                                    lastname : account.surname,
                                    title : account.customData.proposals[proposalIndex].title,
                                    'abstract' : account.customData.proposals[proposalIndex]['abstract']
                                });
                    }
                    cb(); //tell the iterator is done
                }, function (err){
                    res.xls('data.xlsx', result);
                    
                });
            });
        });
    });
    return router;
};
