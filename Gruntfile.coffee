module.exports = (grunt) ->

  grunt.initConfig
    coffee:
      build:
        options:
          bare: true
        files:
          'kryptonite.js': 'kryptonite.coffee'
    uglify:
      build:
        files:
          'kryptonite-min.js': 'kryptonite.js'
    watch:
      coffee:
        files: ['kryptonite.coffee']
        tasks: 'coffee:build'
      compress:
        files: ['kryptonite.js']
        tasks: 'uglify:build'

  # Dependencies
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-watch'

  grunt.registerTask 'build', ['coffee', 'uglify']
  grunt.registerTask 'default', ['build', 'watch']