const sass = require('sass')
const loadGruntTasks = require('load-grunt-tasks')

module.exports = grunt => {
  grunt.initConfig({
    // clean: {
    //   temp: 'temp/**'
    // }
    sass: {
      options: {
        implementation: sass
      },
      main: {
        files: {
          'dist/assets/styles/main.css': 'src/assets/styles/main.scss'
        }
      }
    },
    babel: {
      options: {
        presets: ['@babel/preset-env']
      },
      main: {
        files: {
          'dist/assets/scripts/main.js': 'src/assets/scripts/main.js'
        }
      }
    },
    watch: {
      js: {
        files: ['src/assets/scripts/*.js'],
        tasks: ['babel']
      },
      css: {
        files: ['src/assets/styles/*.scss'],
        tasks: ['sass']
      }
    }
  })

  loadGruntTasks(grunt)

  // 载入清除临时文件插件
  // grunt.loadNpmTasks('grunt-contrib-clean')
  // grunt.loadNpmTasks('grunt-sass')

  // grunt.registerTask('foo', () => {
  //   console.log(grunt.config('foo'))
  // })
  grunt.registerTask('default', ['sass', 'babel', 'watch'])
}