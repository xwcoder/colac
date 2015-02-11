var _fs = require( 'fs' );
var fs = require( './lib/fs' );
var path = require( 'path' );
var compress = require( './lib/compress' );
var mkdirp = require( 'mkdirp' );

/**
 * var config = {
 *  '[-]r': false, //是否递归(目录)
 *  '[-]m': false, //是否压缩
 *  '[-]c': '~/code/config', // 配置文件
 *  'f:' ['./lib/dom.js'] // 待处理文件
 *  '[-]o': '~/code/all.js', //输出文件
 * }
 */

var interFile = path.join( __dirname, '.kitctl_inter.js' );

var config = require( './lib/parseconfig' )();

require( './lib/define' ).setUp( interFile );

function dispose ( file ) {

    //if ( /\.min\./.test( file ) ) {
    //    return;
    //}

    if ( !( /^([^-]+)-debug(\..+)$/.test( file ) ) ) {
        return;
    }

    fs.close( fs.open( interFile, 'a' ) );

    require( file );

    if ( !config.o ) { //没有指定输出

        //var basename = path.basename( file );

        //if ( /^([^-]+)-debug(\..+)$/.test( basename ) ) {
        //    file = file.replace( /^([^-]+)-debug(\..+)$/, '$1$2' );
        //}  else {
        //    file = path.join( path.dirname( file ), path.basename( file, path.extname( file ) ) + '.min' + path.extname( file ) );
        //}

        file = file.replace( /^([^-]+)-debug(\..+)$/, '$1$2' );
        mkdirp.sync( path.dirname( file ) );
        fs.close( fs.open( file, 'w' ) );

        if ( config.m ) {
            var content = compress( interFile );
            fs.writeFile( file, content, {encoding: 'utf8'});
        } else {
            _fs.createReadStream( interFile ).pipe( _fs.createWriteStream( file ) );            
        }

        fs.unlink( interFile );
    }
};

function walk ( dir, dispose ) {

    var files = fs.readdir( dir );
    var i = 0, file;

    while ( file = files[i++] ) {

        file = path.join( dir, file );

        if ( fs.isDirectory( file ) ) {
            if ( config.r ) {
                walk( file );
            }
        } else {
            dispose( file );
        }
    }
};

function clean () {
    try {
        fs.unlink( interFile );
    } catch ( e ) {}
}

module.exports = function () {

    clean();

    config.f.forEach( function ( f ) {
        if ( fs.isDirectory( f ) ) {
            walk( f, dispose );
        } else {
            dispose( f );
        }
    } );

    if ( config.o ) {

        mkdirp.sync( path.dirname( config.o ) );
        if ( config.m ) {
            fs.writeFile( config.o, compress( interFile ), {encoding: 'utf8'});
        } else {
            fs.close( fs.open( config.o, 'w' ) );
            _fs.createReadStream( interFile ).pipe( _fs.createWriteStream( config.o ) );            
        }
    }
    
    clean();
};
