module.exports = function(grunt) {
    var translations = [];

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-umd');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks("grunt-remove-logging");
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            build: {
                options: {
                    footer: '\nreturn AblePlayer;'
                },
                src: [
                    // Ultimately this should be just 'scripts/*.js',
                    //  but for now we're maintaining the order which was
                    //  specified in the previous 'compile.sh' script
                    'scripts/ableplayer-base.js',
                    'scripts/initialize.js',
                    'scripts/preference.js',
                    'scripts/webvtt.js',
                    'scripts/buildplayer.js',
                    'scripts/track.js',
                    'scripts/youtube.js',
                    'scripts/slider.js',
                    'scripts/volume.js',
                    'scripts/dialog.js',
                    'scripts/misc.js',
                    'scripts/description.js',
                    'scripts/browser.js',
                    'scripts/control.js',
                    'scripts/caption.js',
                    'scripts/chapters.js',
                    'scripts/metadata.js',
                    'scripts/transcript.js',
                    'scripts/search.js',
                    'scripts/event.js',
                    'scripts/dragdrop.js',
                    'scripts/sign.js',
                    'scripts/langs.js',
                    'scripts/translation.js',
                    'scripts/ttml2webvtt.js',
                    'scripts/JQuery.doWhen.js',
                    'scripts/vts.js',
                    'scripts/vimeo.js'
                ],
                dest: 'build/<%= pkg.name %>.js'
            },
        },
        copy: {
            translations: {
                files: [{
                    expand: true,
                    src: 'translations/*.js',
                    rename: function(dest, src) {
                        translations.push(src.substring('translations/'.length, src.length - 3));
                        return 'build/' + src;
                    }
                }]
            }
        },
        umd: {
            build: {
                options: {
                    src: 'build/<%= pkg.name %>.js',
                    objectToExport: 'AblePlayer',
                    deps: {
                        default: [{'jquery': 'jQuery'}, {'js-cookie': 'Cookies'}],
                        global: ['jQuery', 'Cookies']
                    }
                }
            }
        },
        removelogging: {
            dist: {
                src: [
                    'build/<%= pkg.name %>.js'
                ],
                dest: 'build/<%= pkg.name %>.dist.js'
            },
            options: {
                // Remove all console output (see https://www.npmjs.com/package/grunt-remove-logging)
            }
        },
        uglify: {
            min: {
                src    : ['build/<%= pkg.name %>.dist.js'],
                dest   : 'build/<%= pkg.name %>.min.js',
            },
            translations: {
                files: [{
                    expand: true,
                    src: 'build/translations/*.js',
                    ext: '.min.js'
                }]
            },
            options: {
                // Add a banner with the package name and version
                //  (no date, otherwise a new build is different even if the code didn't change!)
                banner: '/*! <%= pkg.name %> V<%= pkg.version %> */\n',
                // Preserve comments that start with a bang (like the file header)
                preserveComments: "some"
            }
        },
        cssmin: {
            min: {
                src  : [
                    'styles/ableplayer.css',
                ],
                dest : 'build/<%= pkg.name %>.min.css',
            },
            options: {
                // Add a banner with the package name and version
                //  (no date, otherwise a new build is different even if the code didn't change!)
                //  (oddly, here we don't need a '\n' at the end!)
                banner: '/*! <%= pkg.name %> V<%= pkg.version %> */',
            }
        },
        jshint: {
            files: ['Gruntfile.js', 'scripts/**/*.js'],
            options: {
                // options here to override JSHint defaults
                globals: {
                    browser: true,
                    jquery: true,
                    devel: true,
                }
            }
        },
        clean: {
          build: ['build'],
        },

    });

    grunt.registerTask('umdTranslations', function() {
        var i;

        for (i = 0; i < translations.length; i++) {
            grunt.config('umd.translation-' + translations[i] + '', {
                src: 'build/translations/' + translations[i] + '.js',
                objectToExport: translations[i].replace('-', '')
            });
        }
    })

    grunt.registerTask('default', ['concat', 'copy', 'umdTranslations', 'umd', 'removelogging', 'uglify', 'cssmin']);
    grunt.registerTask('test', ['jshint']);
};
