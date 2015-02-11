# colac
[cola](https://github.com/xwcoder/cola)的编译、打包工具。

提取cola的模块依赖并前置，避免生产环境中使用分析字符串的方式解析依赖。

<pre>
dom-debug.js

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

编译后
define("./lib/dom/", ["./lib/ajax/","./lib/event/"], function ( require, exports, module ) {
    var dom = require( './lib/ajax/' );
    var event = require( './lib/event/' );

    module.exports = {
        name: './lib/dom/',
        getById: function ( id ) {
            return document.getElementById( id );
        }
    };
});
</pre>

## 安装
<code>npm install colac -g</code>

##使用
<pre>
参数：
 -m : 是否压缩
 -r : 是否递归目录
 -c : 配置文件，参考config.js.example
 -o : 输出文件
 
 example:
 colac lib/dom/index-debug.js
 colac -rm lib/dom/
 colac -c ./config.js
 colac -rm lib/dom/ -o ./dist/a.js
</pre>
