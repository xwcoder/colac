var fs = require( './fs' );
var path = require( 'path' );

module.exports = function () {

    var config = {
        m: false,
        r: false
    };
    var args = [];

    process.argv.slice(2).forEach( function ( arg, index ) {
        if ( /^-/.test( arg ) ) {
            arg = arg.replace( '-', '' ).split( '' );
            arg.forEach( function ( _arg ) {
                args[args.length] = '-' + _arg;
            } );
        } else {
            args[args.length] = arg;
        }
    } );

    var i = 0,
        len = args.length,
        arg;
    while ( i < len ) {

        arg = args[i];

        if ( /^-([a-zA-z])/.exec( arg ) ) {
            arg = RegExp.$1.toLowerCase();
            if ( arg == 'c' || arg == 'o' ) {
                config[arg] = args[++i];
            } else {
                config[arg] = true;
            }
        } else {
            config.f = config.f || [];
            config.f.push( arg );
        }
        i++;
    }

    if ( config.c ) {
        config.c = path.resolve( config.c );
        var cf = require( config.c );
        for ( var p in cf ) {
            if ( p == 'f' ) {
                config.f = ( config.f || [] ).concat( cf[p] );
            } else {
                config[p] = cf[p];
            }
        }
    }
    
    var cwd = process.cwd();
    config.f = ( config.f || [] ).map( function ( f ) {

        if ( path.isAbsolute( f ) ) {
            return f;
        }
        
        return path.resolve( f );
    } );
    
    return config;
};
