var express = require('express'),
    chai = require('chai'),
    fs = require('fs'),
    expect = chai.expect,
    siTestXmlReader = require('../index');

describe('#parse', function() {
    var server;

    before(function () {
        var app = express();
        app.use(express.static('test/mocks'));
        server = app.listen(3100);
    });

    after(function () {
        server.close();
    });

    var testParseByFileName = function (fileName, done) {
        siTestXmlReader.parse('http://localhost:3100/' + fileName + '.gz')
            .then(function (res) {
                var jsonContents = fs.readFileSync('./test/mocks/' + fileName + '.json').toString();
                expect(JSON.stringify(res)).to.equal(jsonContents);
                done();
            }, function (e) {
                expect(function() {
                    throw e;
                }).not.to.throw(Error);
                done();
            });
    };

    it('should correctly parse Shufersal XML', function(done) {
        testParseByFileName('Price7290027600007-001-201705092231', done);
    });

    it('should correctly parse Victory XML', function(done) {
        testParseByFileName('Price7290696200003-061-201705092312-001.xml', done);
    });
});
