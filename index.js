var _fs = require( 'fs' );
var fs = require( './lib/fs' );
var path = require( 'path' );
var compress = require( './lib/compress' );
var mkdirp = require( 'mkdirp' );
require( './lib/define' ).setUp();

var defineMap = {};

global.defineArray = [];
global.useArray = [];

var tasks = require( './lib/parseconfig' )();
var task = null;

function clean () {
    defineMap = {};
    global.defineArray = [];
    global.useArray = [];
}

function clear () {
    global.defineArray = [];
    global.useArray = [];
}

var  hc = '' +
'\n                  _                ' +
'\n                 | |               ' +
'\n    ___    ___   | |   __ _    ___ ' +
'\n   / __|  / _ \\  | |  / _` |  / __|' +
'\n  | (__  | (_) | | | | (_| | | (__ ' +
'\n   \\___|  \\___/  |_|  \\__,_|  \\___|' +
    '\n\n 参数：' +
    '\n -m : 是否压缩' +
    '\n -r : 是否递归目录' +
    '\n -o : 输出文件' +
    '\n -c : 配置文件，参考config.json.example' +
    '\n' +
    '\n example:' +
    '\n colac lib/dom/index-debug.js' +
    '\n colac -rm lib/dom/' +
    '\n colac -c ./config.js' +
    '\n colac -rm lib/dom/ -o ./dist/a.js';
    

module.exports = function () {

    if ( !tasks.length ) {
        console.info( hc );
        return;
    }

    clean();

    tasks.forEach( function ( task ) {

        clean();
        
        task.file.forEach( function ( filepath ) {

            clear();
            require( path.resolve( filepath ) ); 

            defineMap[filepath] = {
                defineArray: global.defineArray,
                useArray: global.useArray
            }
        } );

        //处理结果
        //defineMap = { '/dom.js': { defineArray: [], useArray: [] } }

        var defineArr = [];
        var useArr = [];
        var content;

        if ( task.dest ) { // 合并文件
            for ( var p in defineMap ) {
                defineArr = defineArr.concat( defineMap[p].defineArray );
                useArr = useArr.concat( defineMap[p].useArray );
            }

            content = defineArr.join( '\n' ) + useArr.join( '\n' );

            if ( task.option.m ) { //压缩
                content = compress( content );
            }
            
            fs.writeFile( path.resolve( task.dest ), content );

            console.info( '保存文件' + task.dest + ' 成功' );
        }
        
        if ( task.dist ) {
            for ( var p in defineMap ) {

                content = defineMap[p].defineArray.join( '\n' ) + defineMap[p].useArray.join( '\n' );

                if ( task.option.m ) {
                    content = compress( content );
                }

                var distFilepath = path.join( task.dist, p );
                mkdirp.sync(  path.dirname( distFilepath ) );

                fs.writeFile( distFilepath, content );
            }

            console.info( '编译文件到' + task.dist + ' 成功' );
        }
    } );
    
    clean();
};
