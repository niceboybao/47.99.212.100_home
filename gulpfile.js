/*
 * @Author: guangwei.bao 
 * @Date: 2018-12-01 17:00:26 
 * @Last Modified by: guangwei.bao
 * @Last Modified time: 2018-12-04 11:11:26
 * @Describe: gulp打包配置
 */
'use strict';

var gulp = require('gulp');
var clean = require('gulp-clean');
//js压缩插件
var uglify = require('gulp-uglify');
//合并压缩插件
var concat = require('gulp-concat');
//html 处理
var htmlmin = require('gulp-htmlmin');
var processhtml = require('gulp-processhtml');
//css 处理
var cleanCSS = require('gulp-clean-css');
//css压缩
var cssmin = require('gulp-minify-css');
//文件更名
var rename = require('gulp-rename');
//一个串行方式跑gulp任务的插件
var runSequence = require('run-sequence');
//webserver
var webserver = require('gulp-webserver');
//将管道连接在一起，如果其中一个关闭，就会破坏它们。
var pump = require('pump');
//refresh browser
var browserSync = require('browser-sync');
//检测错误
var plumber = require('gulp-plumber');
//图片压缩缓存
var cache = require('gulp-cache');
//图片压缩
var imagemin = require('gulp-imagemin');
//图片深入压缩
var pngquant = require('imagemin-pngquant');
var imageminOptipng = require('imagemin-optipng');
var imageminSvgo = require('imagemin-svgo');
var imageminGifsicle = require('imagemin-gifsicle');
var imageminJpegtran = require('imagemin-jpegtran');
//如果有自定义方法，会用到
var gutil = require('gulp-util');
// gulp插件来混淆你的代码。
var obfuscate = require('gulp-obfuscate');
//对文件名加MD5后缀
var rev = require('gulp-rev');
//路径替换
var revCollector = require('gulp-rev-collector');
var gulpif = require('gulp-if');
// config json
var config = require('./config.json');

// 检查错误
function errrHandler(e) {
	// 控制台发声,错误时beep一下
	gutil.beep();
	gutil.log(e);
	this.emit('end');
}

// 生成hash值(8位随机数)
function hashNumFun(num) {
	var strs =
		'0,1,2,3,4,5,6,7,8,9,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z';
	var arr = strs.split(',');
	var str = '';
	for (var i = 0; i < num; i++) {
		str += arr[Math.round(Math.random() * (arr.length - 1))];
	}
	return str;
}

// 清除dist
gulp.task('clean', function() {
	gulp
		.src(config.output.dist, {
			read: false
		})
		.pipe(clean());
});

// 拷贝所有文件
gulp.task('copy-all', function() {
	return gulp.src([ config.input.src ]).pipe(gulp.dest(config.output.dist)).pipe(
		browserSync.reload({
			stream: true
		})
	);
});
// 拷贝json 文件
gulp.task('copy-json', function() {
	return gulp.src([ 'src/static_res/json/**/*' ]).pipe(gulp.dest(config.output.dist + '/static_res/json'));
});
// 拷贝markdown 文件
gulp.task('copy-markdown', function() {
	return gulp.src([ 'src/static_res/markdown/**/*' ]).pipe(gulp.dest(config.output.dist + '/static_res/markdown'));
});
// 拷贝txt
gulp.task('copy-app-txt', function() {
	return gulp.src([ 'src/app/**/*.txt' ]).pipe(gulp.dest(config.output.dist + '/app'));
});
gulp.task('copy-pc-txt', function() {
	return gulp.src([ 'src/pc/**/*.txt' ]).pipe(gulp.dest(config.output.dist + '/pc'));
});

// build-dev
gulp.task('build-dev', [ 'copy-all' ]);

//Streaming gulp plugin to run a local webserver with LiveReload
gulp.task('webserver', function() {
	gulp.src('./www').pipe(
		webserver({
			port: 4200, //端口
			liveload: true, //实时刷新代码。不用f5刷新
			fallback: 'index.html',
			open: true
		})
	);
});

// start-dev
gulp.task('start-dev', function(callback) {
	runSequence('build-dev', 'webserver', callback);
});

//压缩html
gulp.task('min-html', function() {
	var options = {
		removeComments: true, //清除HTML注释
		collapseWhitespace: true, //压缩HTML
		collapseBooleanAttributes: false, //省略布尔属性的值 <input checked="true"/> ==> <input />
		removeEmptyAttributes: false, //删除所有空格作属性值 <input id="" /> ==> <input />
		removeScriptTypeAttributes: true, //删除<script>的type="text/javascript"
		removeStyleLinkTypeAttributes: true, //删除<style>和<link>的type="text/css"
		minifyJS: true, //压缩页面JS
		minifyCSS: true //压缩页面CSS
	};
	return (gulp
			//- 读取 rev-manifest.json 文件以及需要进行css名替换的文件
			// .src([ 'www/rev/**/*.json', config.input.html ])
			.src([ config.input.html ])
			.pipe(plumber({ errorHandler: errrHandler }))
			.pipe(revCollector({ replaceReved: true })) //执行文件内css名的替换
			.pipe(processhtml())
			.pipe(htmlmin(options))
			.pipe(gulp.dest(config.output.dist)) ); //gulp dest是输出
});

//压缩css
gulp.task('min-css', function() {
	return (gulp
			.src([ config.input.css ])
			.pipe(plumber({ errorHandler: errrHandler }))
			.pipe(
				cleanCSS({
					compatibility: 'ie8'
				})
			)
			//重命名
			// .pipe(
			// 	rename({
			// 		extname: '.min.css',
			// 		prefix: '', //前缀
			// 		suffix: '-' + hashNumFun(16) //后缀
			// 	})
			// )
			.pipe(
				cssmin({
					advanced: false, //类型：Boolean 默认：true [是否开启高级优化（合并选择器等）]
					compatibility: 'ie7', //保留ie7及以下兼容写法 类型：String 默认：''or'*' [启用兼容模式； 'ie7'：IE7兼容模式，'ie8'：IE8兼容模式，'*'：IE9+兼容模式]
					keepBreaks: false, //类型：Boolean 默认：false [是否保留换行]
					keepSpecialComments: '*'
					//保留所有特殊前缀 当你用autoprefixer生成的浏览器前缀，如果不加这个参数，有可能将会删除你的部分前缀
				})
			)
			// .pipe(rev()) // 文件名加MD5后缀
			.pipe(gulp.dest(config.output.dist)) ); //gulp dest是输出
	// .pipe(rev.manifest()) // 生成一个rev-manifest.json
	// .pipe(gulp.dest(config.output.rev + '/css')) );
});

//压缩scripts
gulp.task('min-js', function() {
	return (gulp
			.src([ config.input.scripts ])
			.pipe(plumber({ errorHandler: errrHandler }))
			// .pipe(concat('all.js')) //合并js
			.pipe(
				uglify({
					mangle: true, //类型：Boolean 默认：true 是否修改变量名
					compress: true //类型：Boolean 默认：true 是否完全压缩
				})
			)
			// .pipe(obfuscate()) //代码混淆
			// .pipe(
			// 	rename({
			// 		extname: '.min.js',
			// 		prefix: '', //前缀
			// 		suffix: '-' + hashNumFun(16) //后缀
			// 	})
			// ) //重命名
			// .pipe(rev()) // 文件名加MD5后缀
			.pipe(gulp.dest(config.output.dist)) ); //gulp dest是输出
	// .pipe(rev.manifest()) // 生成一个rev-manifest.json
	// .pipe(gulp.dest(config.output.rev + '/js')) );
});

//压缩图片
gulp.task('min-img', function() {
	gulp
		.src([ config.input.images ])
		.pipe(plumber({ errorHandler: errrHandler }))
		.pipe(
			cache(
				imagemin({
					progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
					svgoPlugins: [ { removeViewBox: false } ], //不要移除svg的viewbox属性
					use: [
						pngquant(),
						imageminJpegtran({ progressive: true }),
						imageminGifsicle({ interlaced: true }),
						imageminOptipng({ optimizationLevel: 3 }),
						imageminSvgo()
					] //使用pngquant深度压缩png图片的imagemin插件
				})
			)
		)
		// .pipe(
		// 	rename({
		// 		prefix: '', //前缀
		// 		suffix: '-' + hashNumFun(16) //后缀
		// 	})
		// ) //重命名
		.pipe(gulp.dest(config.output.dist));
});

// build-prod
gulp.task('build-prod', function(callback) {
	runSequence(
		'copy-json',
		'copy-markdown',
		'copy-app-txt',
		'copy-pc-txt',
		'min-img',
		'min-css',
		'min-js',
		'min-html',
		callback
	);
});
// start-prod
gulp.task('start-prod', function(callback) {
	runSequence('build-prod', 'webserver', callback);
});
