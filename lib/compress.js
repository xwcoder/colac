var UglifyJS = require( 'uglify-js' );
var fs = require( './fs' );

module.exports = function ( file ) {
    
    return UglifyJS.minify( fs.readFile( file, {encoding: 'utf8'} ), {
        fromString: true,
        output: {
            ascii_only : true,
            max_line_len : null
        }
    } ).code;
};
