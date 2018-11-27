/*
 * @Author: guangwei.bao
 * @Date: 2018-11-06 14:44:35
 * @Last Modified by: guangwei.bao
 * @Last Modified time: 2018-11-27 20:21:26
 * @Describe: 服务器首页脚本
 * 根据掘金-我的主页做一个服务器首页（app）
 */
var canRun = true;
//  页面加载完成
window.onload = function() {
	//do something
    document.getElementsByClassName('container')[0].addEventListener('scroll', handleScroll,false);
    setTimeout(function(){
        console.log('removeEventListener');
        document.getElementsByClassName('container')[0].removeEventListener('scroll', handleScroll,false);
    },10000);
};

function handleScroll(e) {
	// console.log('handleScroll');

	// 函数节流
	if (!canRun) {
		// 判断是否已空闲，如果在执行中，则直接return
		return;
	}

	canRun = false;
	setTimeout(function() {
		console.log('handleScroll 函数节流');
		canRun = true;

		var scroll = document.getElementsByClassName('container')[0].scrollTop;

		if (scroll > 100) {
			// console.log('scroll > 150');
			document.getElementById('to-top').classList.add('to-top-show');
		} else {
			document.getElementById('to-top').classList.remove('to-top-show');
		}
	}, 500);
}
// requestAnimationFrame
function backToTop_() {
	var height = document.getElementsByClassName('container')[0].scrollTop;
	if (height > 0) {
		window.requestAnimationFrame(backToTop);
		// 每次减去滚动的20%
		document.getElementsByClassName('container')[0].scrollTop -= height / 5;
	}
}
// setTimeout setInterval
function backToTop() {
	// var time = setTimeout(function() {
	// 	var height = document.getElementsByClassName('container')[0].scrollTop;
	// 	// 递归操作
	// 	if (height > 0) {
    //         // 每次减去滚动的20%
    //         console.log('backToTop');
	// 		document.getElementsByClassName('container')[0].scrollTop -= height / 5;
	// 		backToTop();
	// 		// window.requestAnimationFrame(backToTop);
	// 	} else {
	// 		console.log('clearInterval');
	// 		clearTimeout(time);
	// 	}
	// }, 20);

	var intervalTime = setInterval(function() {
		var height = document.getElementsByClassName('container')[0].scrollTop;
		if (height > 0) {
            // 每次减去滚动的20%
            console.log('backToTop');
			document.getElementsByClassName('container')[0].scrollTop -= height / 5;
		} else {
            console.log('clearInterval');
			clearInterval(intervalTime);
		}
	}, 20);
}
