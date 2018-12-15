/*
 * @Author: guangwei.bao 
 * @Date: 2018-12-01 14:26:47 
 * @Last Modified by: guangwei.bao
 * @Last Modified time: 2018-12-15 17:23:50
 * @Describe: 无
 */
(function() {
	//代码
	// console.log('123');
})();

$(function() {
	console.log('yixiu burry');
	$.ajax({
		type: 'GET',
		url: 'https://niceboybao.com/static_res/json/test.json',
		// data: { username: $('#username').val(), content: $('#content').val() },
		dataType: 'json',
		success: function(data) {
			console.log(data);
		},
		error: function(error) {
			console.log(error);
		}
	});
});
