define("./lib/ajax/", ["./lib/dom/"], function ( require, exports, module ) {
    var dom = require( './lib/dom/' );

    module.exports = {
        name: './lib/ajax/'
    };
});
define("./lib/dom/", ["./lib/ajax/"], function ( require, exports, module ) {
    var dom = require( './lib/ajax/' );

    module.exports = {
        name: './lib/dom/',
        getById: function ( id ) {
            return document.getElementById( id );
        }
    };
});
define("./lib/event/", ["./lib/dom/"], function ( require, exports, module ) {
    var dom = require( './lib/dom/' );

    module.exports = {
        name: './lib/event/'
    };
});
define("./lib/logger", ["./lib/dom/"], function ( require, exports, module ) {
    
    var dom = require( './lib/dom/' );

    module.exports = function ( id ) {
        var el = dom.getById( id );
        return { 
            name: 'logger',
            log: function ( s ) {
                el.innerHTML = el.innerHTML + '<br>' + s;
            }
        };
    }
});
define("./lib/util", ["./lib/dom/","./lib/ajax/"], function ( require, exports, module ) {
    var dom = require( './lib/dom/' );
    var ajax = require( './lib/ajax/' );
    module.exports = {
        name: './lib/util'
    };
});
