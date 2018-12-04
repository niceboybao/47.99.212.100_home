/*
 * @Author: guangwei.bao
 * @Date: 2018-11-06 14:44:35
 * @Last Modified by: guangwei.bao
 * @Last Modified time: 2018-12-03 11:12:45
 * @Describe: 服务器首页脚本
 * 根据掘金-我的主页做一个服务器首页
 */

// 生成hash值(8位随机数)
function hashNum(num) {
	var strs =
		'0,1,2,3,4,5,6,7,8,9,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z';
	var arr = strs.split(',');
	var str = '';
	for (var i = 0; i < num; i++) {
		str += arr[Math.round(Math.random() * (arr.length - 1))];
	}
	return str;
}

// hashNum(16);
