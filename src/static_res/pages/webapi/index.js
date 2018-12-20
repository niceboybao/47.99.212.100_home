/*
 * @Author: guangwei.bao 
 * @Date: 2018-12-20 10:00:44 
 * @Last Modified by: guangwei.bao
 * @Last Modified time: 2018-12-20 10:02:49
 * @Describe: web api 
 */

var supportsVibrate = 'vibrate' in navigator;
console.log(supportsVibrate);

if (supportsVibrate) {
	// 振动1秒
	navigator.vibrate(1000);
} else {
	alert(supportsVibrate);
}
