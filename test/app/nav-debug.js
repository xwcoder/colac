cola.use( function ( require ) {
    var dom = require( './lib/dom/' );  
    var ajax = require( './lib/ajax/' );  
    var event = require( './lib/event/' );  
    
    console.log( dom.name );
    console.log( ajax.name );
} );
