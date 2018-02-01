(function () {
    'use strict';

    angular.module('Smartway', [
        'ui.router',
        'ngRoute',
        'ngMaterial',
        'ngCookies',
        'ngAnimate',
        'ngAria',
    ]).config(config);
    function config( $stateProvider, $locationProvider, $urlRouterProvider ) {

        $urlRouterProvider.otherwise('/login');

        $locationProvider.hashPrefix('!');
    }
})();