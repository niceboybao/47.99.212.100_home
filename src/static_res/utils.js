/*
 * @Author: guangwei.bao 
 * @Date: 2018-12-15 17:54:35 
 * @Last Modified by: guangwei.bao
 * @Last Modified time: 2018-12-15 18:07:44
 * @Describe: static_res 工具类
 */

(function(util) {
	window.isDebugger = true; //false为生产模式，true为调试模式
	//线上环境
	if (window.location.href.indexOf('niceboybao.com')>=0) {
		window.isDebugger = false; //false为生产模式，true为调试模式
	}

	console.log = (function(oriLogFunc) {
		return function(str) {
			if (window.isDebugger) {
				oriLogFunc.call(console, str);
			}
		};
	})(console.log);
	//获取路由的路径和详细参数
	util.test = function() {
		console.log('util test');
	};
})((util = util || {}));
var util;
