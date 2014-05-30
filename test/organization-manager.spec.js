/* global Sandbox, describe, it, expect,  sinon, beforeEach */

var request = sinon.stub();
var noop = function () {};

var OrganizationManager = Sandbox.require('../lib/organization-manager', {
    requires: {'./request': request}
});

describe('OrganizationManager', function () {
    it('should be instantiable', function () {
        var om = new OrganizationManager({origin: 'origin'});
        expect(om).to.be.an.instanceof(OrganizationManager);
        expect(om.options).to.be.eql({origin: 'origin'});
    });

    describe('api methods', function () {
        var om;
        beforeEach(function () {
            request.reset();
            om = new OrganizationManager({});
        });

        describe('getById', function () {
            it('throws when id is not a string', function () {
                expect(function () {
                    om.getById(null, 'session', noop);
                }).toThrow;
            });
            it('throws when session is not a string', function () {
                expect(function () {
                    om.getById('21', null, noop);
                }).toThrow;
            });
            it('throws when callback is not a function', function () {
                expect(function () {
                    om.getById('world');
                }).toThrow;
            });
            it('calls the correct request', function () {
                var cb = sinon.spy();
                om.getById('my id', 'session', cb);

                expect(request).to.have.been.calledWith(
                    {},
                    'OrganizationManager',
                    'get',
                    {
                        id: 'my id'
                    },
                    {
                        session_id: 'session'
                    }
                );
            });
        });

        describe('getByName', function () {
            it('throws when name is not a string', function () {
                expect(function () {
                    om.getByName(null, 'session', noop);
                }).toThrow;
            });
            it('throws when session is not a string', function () {
                expect(function () {
                    om.getByName('21', null, noop);
                }).toThrow;
            });
            it('throws when callback is not a function', function () {
                expect(function () {
                    om.getByName('world');
                }).toThrow;
            });
            it('calls the correct request', function () {
                var cb = sinon.spy();
                om.getByName('my name', 'session', cb);

                expect(request).to.have.been.calledWith(
                    {},
                    'OrganizationManager',
                    'get',
                    {
                        name: 'my name'
                    },
                    {
                        session_id: 'session'
                    }
                );
            });
        });

        describe('createTeam', function () {
            it('throws when name is not a string', function () {
                expect(function () {
                    om.createTeam(null, {org: 'a', session: 's'}, noop);
                }).toThrow;
            });
            it('throws when info is not an object', function () {
                expect(function () {
                    om.createTeam('21', null, noop);
                }).toThrow;
            });
            it('throws when orgId is not a string', function () {
                expect(function () {
                    om.createTeam(null, {session: 's'}, noop);
                }).toThrow;
            });
            it('throws when callback is not a function', function () {
                expect(function () {
                    om.createTeam('world');
                }).toThrow;
            });
            it('calls the correct request', function () {
                var cb = sinon.spy();
                om.createTeam('my team', {
                    org: 'orgId',
                    description: 'desc',
                    members: ['a', 'b', 'c'],
                    session: 'session'
                }, cb);

                expect(request).to.have.been.calledWith(
                    {},
                    'OrganizationManager',
                    'createTeam',
                    {
                        name: 'my team',
                        orgId: 'orgId',
                        description: 'desc',
                        memberIds: ['a', 'b', 'c']
                    },
                    {
                        session_id: 'session'
                    }
                );
            });
        });

        describe('getMyOrganizations', function () {
            it('throws when session is not a string', function () {
                expect(function () {
                    om.getMyOrganizations(null, noop);
                }).toThrow;
            });
            it('throws when callback is not a function', function () {
                expect(function () {
                    om.getMyOrganizations('world');
                }).toThrow;
            });
            it('calls the correct request', function () {
                var cb = sinon.spy();
                om.getMyOrganizations('session', cb);

                expect(request).to.have.been.calledWith(
                    {},
                    'OrganizationManager',
                    'getMyOrganizations',
                    {},
                    {
                        session_id: 'session'
                    }
                );
            });
        });
    });
});