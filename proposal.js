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
var forms = require('forms');
var csurf = require('csurf');
var collectFormErrors = require('express-stormpath/lib/helpers').collectFormErrors;
var stormpath = require('express-stormpath');
var extend = require('xtend');

// Declare the schema of our form:

var proposalForm = forms.create({
    title : forms.fields.string({
        required : true
    }),
    'abstract' : forms.fields.string({
        required : true
    }),
});

// A render function that will render our form and
// provide the values of the fields, as well
// as any situation-specific locals

function renderForm(req, res, locals) {
    var id = req.params.proposalid;
    var context = {
        title : '',
        'abstract' : '',
        csrfToken : req.csrfToken()
    };
    if (id === 'n') {
    } else {
        context = extend(context, {
            title : req.user.customData.proposals[id].title,
            'abstract' : req.user.customData.proposals[id]['abstract']
        });
    }
    res.render('proposal', context);
}

// Export a function which will create the
// router and return it

module.exports = function profile() {

    var router = express.Router();

    // Capture all requests, the form library will negotiate
    // between GET and POST requests

    router.all('/:proposalid', stormpath.loginRequired, function(req, res) {
        proposalForm.handle(req, {
            success : function(form) {
                // The form library calls this success method if the
                // form is being POSTED and does not have errors

                // The express-stormpath library will populate req.user,
                // all we have to do is set the properties that we care
                // about and then cal save() on the user object:
                if (!req.user.customData.proposals) {
                    req.user.customData.proposals = [];
                }
                var proposal = {};
                proposal.title = form.data.title;
                proposal['abstract'] = form.data['abstract'];
                var redirectTarget = '/proposal/';
                if (req.params.proposalid === 'n') {
                    req.user.customData.proposals.push(proposal);
                    redirectTarget = redirectTarget + (req.user.customData.proposals.length - 1);
                } else {
                    req.user.customData.proposals[req.params.proposalid] = proposal;
                    redirectTarget = redirectTarget + req.params.proposalid;
                }
                req.user.save(function(err) {
                    if (err) {
                        if (err.developerMessage) {
                            console.error(err);
                        }
                        renderForm(req, res, {
                            errors : [ {
                                error : err.userMessage || err.message || String(err)
                            } ]
                        });
                    } else {
                        res.redirect(redirectTarget);
                    }
                });
            },
            error : function(form) {
                // The form library calls this method if the form
                // has validation errors. We will collect the errors
                // and render the form again, showing the errors
                // to the user
                renderForm(req, res, {
                    errors : collectFormErrors(form)
                });
            },
            empty : function() {
                // The form library calls this method if the
                // method is GET - thus we just need to render
                // the form
                renderForm(req, res);
            }
        });
    });

    // This is an error handler for this router

    router.use(function(err, req, res, next) {
        // This handler catches errors for this router
        if (err.code === 'EBADCSRFTOKEN') {
            // The csurf library is telling us that it can't
            // find a valid token on the form
            if (req.user) {
                // session token is invalid or expired.
                // render the form anyways, but tell them what happened
                renderForm(req, res, {
                    errors : [ {
                        error : 'Your form has expired.  Please try again.'
                    } ]
                });
            } else {
                // the user's cookies have been deleted, we dont know
                // their intention is - send them back to the home page
                res.redirect('/');
            }
        } else {
            // Let the parent app handle the error
            return next(err);
        }
    });

    return router;
};
