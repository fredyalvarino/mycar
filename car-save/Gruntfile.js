'use strict';
// export ARN_CAR_CREATE=arn:aws:lambda:us-east-1:592127264820:function:card-save
module.exports = (grunt) => {
    require('load-grunt-tasks')(grunt);
    grunt.initConfig({
        lambda_package: { default: { options: { include_time: false} } },
        lambda_invoke: { default: {} },
        lambda_deploy: { default: { arn: process.env.ARN_CAR_CREATE } },
        jsdoc2md: { oneOutputFile: { src: ['*.js'], dest: 'README.md' } }
    });
    grunt.loadNpmTasks('grunt-aws-lambda');
    grunt.loadNpmTasks('grunt-jsdoc-to-markdown');
    grunt.registerTask('package', ['jsdoc2md', 'lambda_package:default']);
    grunt.registerTask('deploy', ['lambda_package:default', 'lambda_deploy:default']);
    grunt.registerTask('test', ['lambda_invoke']);
    grunt.registerTask('doc', 'jsdoc2md');
};