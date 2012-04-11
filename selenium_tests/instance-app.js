// switch to testing mode
process.env.NODE_ENV = 'testing';

var utils               = require('../lib/utils'),
    selenium_helpers    = require('../lib/testing/selenium'),
    config              = require('config'),
    async               = require('async');



module.exports = {

    setUp: function (setUp_done) {
        
        utils.delete_all_testing_databases( function () {
            selenium_helpers.start_instance_server( function () {
                setUp_done();
            });            
        });

    },

    tearDown: function (tearDown_done) {
        selenium_helpers.stop_servers(tearDown_done);
    },
    
    "Check that non existent site gives correct error": function (test) {

        var browser = selenium_helpers.new_instance_browser( 'does-not-exist' );
        
        test.expect(2);
        
        browser
            // on home page
            .assertTextPresent('Site not found')

            // on any arbitrary page
            .open('/foo/bar/baz/bundy')
            .assertTextPresent('Site not found')

            // all done
            .testComplete()
            .end(function (err) {
                test.ifError(err);
                test.ok(true, "end of tests");
                test.done();
            });        
    },
    
    
    
};
