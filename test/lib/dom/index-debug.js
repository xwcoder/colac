define( './lib/dom/', function ( require, exports, module ) {
    var dom = require( './lib/ajax/' );
    var event = require( './lib/event/' );

    module.exports = {
        name: './lib/dom/',
        getById: function ( id ) {
            return document.getElementById( id );
        }
    };
} );
