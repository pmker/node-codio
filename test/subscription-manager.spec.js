/* global Sandbox, describe, it, expect,  sinon, beforeEach */

var Promise = require('bluebird');
var request = sinon.stub().returns(Promise.resolve());
request.signed = sinon.stub().returns(Promise.resolve({message: ''}));

var SubscriptionManager = Sandbox.require('../lib/subscription-manager', {
    requires: {'./request': request}
});

describe('SubscriptionManager', function () {
    it('should be instantiable', function () {
        var sm = new SubscriptionManager({origin: 'origin'});
        expect(sm).to.be.an.instanceof(SubscriptionManager);
        expect(sm.options).to.be.eql({origin: 'origin'});
    });

    describe('api methods', function () {
        var sm;
        beforeEach(function () {
            request.reset();
            request.signed.reset();
            sm = new SubscriptionManager({});
        });

        describe('getSubscriptions', function () {
            it('throws when session is not a string', function () {
                expect(function () {
                    sm.getSubscriptions(null);
                }).toThrow;
            });
            it('calls the correct request', function () {

                sm.getSubscriptions('my id')
                .then(function () {

                    expect(request).to.have.been.calledWith(
                        {},
                        'SubscriptionManager',
                        'getSubscriptions',
                        {},
                        {
                            session_id: 'my id'
                        }
                    );
                });
            });
        });
        describe('getSubscription', function () {
            it('calls the correct request without params', function () {

                sm.getSubscription()
                .then(function () {

                    expect(request.signed).to.have.been.calledWith(
                        {},
                        'SubscriptionManager',
                        'getSubscription',
                        {}, {}
                    );
                });
            });
            it('calls the correct request', function () {

                sm.getSubscription('my id')
                .then(function () {

                    expect(request.signed).to.have.been.calledWith(
                        {},
                        'SubscriptionManager',
                        'getSubscription',
                        {
                            organizationId: 'my id'
                        }, {}
                    );
                });
            });
        });
        describe('getPlans', function () {
            it('throws when session is not a string', function () {
                expect(function () {
                    sm.getPlans(null);
                }).toThrow;
            });
            it('calls the correct request', function () {

                sm.getPlans('ORGANIZATION', 'my id')
                    .then(function () {

                        expect(request).to.have.been.calledWith(
                            {},
                            'SubscriptionManager',
                            'getPlans',
                            {
                                customerType: 'ORGANIZATION'
                            },
                            {
                                session_id: 'my id'
                            }
                        );
                    });
            });
        });

    });
});
