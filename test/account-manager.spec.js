/* global Sandbox, describe, it, expect,  sinon, beforeEach */

var Promise = require('bluebird');
var request = sinon.stub().returns(Promise.resolve());
request.signed = sinon.stub().returns(Promise.resolve({message: ''}));

var AccountManager = Sandbox.require('../lib/account-manager', {
    requires: {'./request': request}
});

describe('AccountManager', function () {
    it('should be instantiable', function () {
        var am = new AccountManager({origin: 'origin'});
        expect(am).to.be.an.instanceof(AccountManager);
        expect(am.options).to.be.eql({origin: 'origin'});
    });

    describe('api methods', function () {
        var am;
        beforeEach(function () {
            request.reset();
            am = new AccountManager({});
        });

        describe('getMyInfo', function () {
            it('throws when session is not a string', function () {
                expect(function () {
                    am.getMyInfo(null);
                }).toThrow;
            });
            it('calls the correct request', function () {

                am.getMyInfo('my id')
                .then(function () {

                    expect(request).to.have.been.calledWith(
                        {},
                        'AccountManager',
                        'getMyInfo',
                        {},
                        {
                            session_id: 'my id'
                        }
                    );
                });
            });
        });

        describe('get', function () {
            it('throws when id is not a string', function () {
                expect(function () {
                    am.get(null, 'session');
                }).toThrow;
            });

            it('throws when session is not a string', function () {
                expect(function () {
                    am.get('id', null);
                }).toThrow;
            });

            it('calls the correct request', function () {

                am.get('id', 'session')
                .then(function () {

                    expect(request).to.have.been.calledWith(
                        {},
                        'AccountManager',
                        'getAccount',
                        {
                            id: 'id'
                        },
                        {
                            session_id: 'session'
                        }
                    );
                });
            });
        });

        describe('ensureLtiUser', function () {
            it('calls the correct request', function () {
                var data = {id: 'id'};
                am.ensureLtiUser(data)
                .then(function () {

                    expect(request.signed).to.have.been.calledWith(
                        {},
                        'AccountManager',
                        'ensureLtiUser',
                        data,
                        {}
                    );
                });
            });
        });
    });
});
