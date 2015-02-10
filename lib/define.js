var fs = require( './fs' );

var isType = function ( type ) {
    return function ( obj ) {
        return {}.toString.call( obj ) == '[object ' + type + ']';
    }
};

var isArray = Array.isArray || isType( 'Array' );

function removeComments ( code ) {

    return code.replace( /\/\*.*\*\//g, '' )
                .replace( /\/\/.*(?=[\n\t])/g, '')
                .replace( /^\s*\/\*[\s\S]*?\*\/\s*$/mg, '' );
}

function unique ( deps ) {
    var ret = [];
    var map = {};

    for ( var i = 0, len = deps.length; i < len; i++ ) {
        if ( !map[ deps[i] ] ) {
            map[ deps[i] ] = 1;
            ret.push( deps[i] );
        }
    }
    return ret;
}

var requireReg = /\brequire\(\s*['"](\S*)['"]\s*\)/g;

function parseDeps ( code ) {

    code = removeComments( code );

    if ( code.indexOf( 'require' ) == '-1' ) {
        return [];
    }
    
    var deps = [], match;

    while ( match = requireReg.exec( code ) ) {
        deps.push( match[ 1 ] );
    }
    
    return unique( deps );
}

var define = function () {

    var id, factory, deps;
    var args = [].slice.call( arguments );

    switch (args.length) {

        case 3:
            id = args[0];
            factory = args[2];
            deps = args[1];
            break;

        case 2:
            factory = args[1];
            if ( isArray( args[0] ) ) {
                deps = args[0];
            } else {
                id = args[0];
                deps = parseDeps( factory.toString() );
            }
            break;
        case 1:
            factory = args[0];
            deps = parseDeps( factory.toString() );
    }

    var content = '';

    if ( id ) {
        content = 'define("' + id + '", ' + JSON.stringify( deps ) + ', ' + factory.toString() + ');';
    }  else {
        content = 'define(' + JSON.stringify( deps ) + ', ' + factory.toString() + ');';
    }
    
    fs.appendFile( interFile, content + '\n' );
};

var interFile = __dirname + '/.kitctl_inter.js';

module.exports = {
    setUp: function ( file ) {
        interFile = file;
        global.define = define;
    }
};
