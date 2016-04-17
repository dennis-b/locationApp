var gulp = require('gulp');
var inlineCss = require('gulp-inline-css');
var path = require('path');
var html2string = require('gulp-html2string');
var rename = require("gulp-rename");
var defineModule = require("gulp-define-module");

var templatesPath = 'src/app/parse/mail/';
gulp.task('inline-css', function () {

    return gulp.src(templatesPath + '*.html')
        .pipe(inlineCss({
            applyStyleTags: true,
            applyLinkTags: true,
            removeStyleTags: true,
            removeLinkTags: true
        }))
        .pipe(html2string({
            base: templatesPath,
            createObj: false,
            objName: 'TEMPLATES'
        }))
        .pipe(defineModule('plain', {
            // wrapper: 'var TEMPLATES = {}; module.exports = TEMPLATES; TEMPLATES["<%= templateName %>"] = <%= contents %>',
            wrapper: 'var TEMPLATES = {}; module.exports = TEMPLATES;  <%= contents %>'
        }))
        .pipe(rename({extname: '.js'}))
        .pipe(gulp.dest('src/app/parse/cloud/templates/inline/'));
});
