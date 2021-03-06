// TaskManager
// ===========


// Dependencies
// ------------

var assert = require('assert-plus');
var VError = require('verror');
var Promise = require('bluebird');

var request = require('./request');
var NS = require('./ns/ns').NS;
var ns = null;

var ANON_SESSION = '00000000-0000-0000-0000-000000000000';

var TaskManager = module.exports = function (options) {
    this.options = options;
    this.request = request.bind(null, this.options, 'TaskManager');
    if (ns === null) {
        ns = new NS(options.ns, ANON_SESSION);
    }
};

TaskManager.prototype.setNs = function (_ns) {
    ns = _ns;
};


// Get the status of the given task by id.
//
// id       - String, id of the task.
//
// Returns a promise.
TaskManager.prototype.getTaskStatus = function (id) {
    assert.string(id, 'id');

    return this.request('getTaskStatus', {id: id}, {});
};

// Ping for the status of a given task.
//
// id       - String, id of the task.
//
// Returns a promise.
TaskManager.prototype.pingTaskStatus = function (id, session) {
    assert.string(id, 'id');

    var self = this;
    var channelId = 'tasks/' + id;
    return new Promise(function (resolve, reject) {
        var fallOverCheckerId = null;
        var done = function (response) {
            fallOverCheckerId && clearInterval(fallOverCheckerId);
            done = null;
            if (response.status === 'COMPLETED') {
                resolve(response.result);
            } else if (response.status === 'ERROR') {
                reject(new VError('getTaskStatus returned an error: %s', response.errorMessage));
            } else {
                reject(new VError('Unknown response status: %s', response.status));
            }
        };
        var fallOverChecker = function () {
            self.getTaskStatus(id).then(function (response) {
                if (response && response.status !== 'PROCESSING') {
                    done && done(response);
                }
            });
        };
        fallOverCheckerId = setInterval(fallOverChecker, 15000);
        var subId = ns.subscribeAuthLast(channelId, session || ANON_SESSION, function (response, version) {
            if (version === 0) {
                return;
            }
            ns.unsubscribe(channelId, subId);
            done && done(response);
        });
    });
};
