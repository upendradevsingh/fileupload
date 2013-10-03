module.exports = function(grunt) {
'use strict';
grunt.initConfig({
	pkg: grunt.file.readJSON('package.json'),
	jshint:{
		options:{
			asi : true,
			strict : true
		},
		task:['public/javascripts/app/*.js', 'Gruntfile.js']
	},
	uglify: {
		options: {
			banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
		},
		build: {
			files: [
					{
						expand: true,     // Enable dynamic expansion.
						cwd: 'public/javascripts/app/',      // Src matches are relative to this path.
						src: ['**/*.jquery.js'], // Actual pattern(s) to match.
						dest: 'public/javascripts/min/',   // Destination path prefix.
						ext: '.jquery.min.js',   // Dest filepaths will have this extension.
					}
			]
		}
	}

});

grunt.loadNpmTasks('grunt-contrib-jshint');
grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.registerTask('default', ['jshint', 'uglify']);

};