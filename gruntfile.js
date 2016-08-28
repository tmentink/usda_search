module.exports = function(grunt) {

  // Configure task(s)
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      js: {
        files: {
          'src/js/application.js' : ['src/js/vendor/**/*.js', 'src/js/base/*.js', 'src/js/section/*.js']
        }
      }
    },
    sass: {
      dev: {
        options: {
          outputStyle: 'expanded'
        },
        files: {
          'dist/css/main.min.css' : 'src/scss/application.scss'
        }
      },
      dist: {
        options: {
          outputStyle: 'compressed'
        },
        files: {
          'dist/css/main.min.css' : 'src/scss/application.scss'
        }
      }
    },
    uglify: {
      dev: {
        options: {
          beautify: {
            beautify: true,
            indent_level: 2,
          },
          mangle: false,
          compress: false,
          preserveComments: 'all'
        },
        src: 'src/js/application.js',
        dest: 'dist/js/main.min.js'
      },
      dist: {
        src: 'src/js/application.js',
        dest: 'dist/js/main.min.js'
      }
    },
    watch: {
      js: {
        files: ['src/js/**/*.js'],
        tasks: ['concat','uglify:dev']
      },
      css: {
        files: ['src/scss/**/*.scss'],
        tasks: ['sass:dev']
      }
    } 
  });

  // Load the plugins
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-sass');

  // Register the task(s)
  grunt.registerTask('default', ['concat','uglify:dev', 'sass:dev']);
  grunt.registerTask('dist', ['concat','uglify:dist', 'sass:dist']);
};





