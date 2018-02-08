(function () {
    'use strict';

    angular.module('Smartway', ['ui.router'])

    .config(function($stateProvider, $urlRouterProvider, $locationProvider) {
        
        $stateProvider

            .state('/home', {
                url: '/home',
                controller: 'homeController',
                templateUrl: 'home/home.html',
                controllerAs: 'vm',
                authenticate: true
            })

            .state('/Signup', {
                url: '/Signup',
                controller: 'loginController',
                templateUrl: 'login/Signup.html',
                controllerAs: 'vm'
            })



            .state('/login', {
                url: '/login',
                controller: 'loginController',
                templateUrl: 'login/login.html',
                controllerAs: 'vm',
                authenticate: false
            })

            .state('/logout', {
                url: '/logout',
                controller: 'loginController',
                templateUrl: 'login/login.html',
                controllerAs: 'vm'
            });

        $locationProvider.hashPrefix('!');
        $urlRouterProvider.otherwise('/login');
        
    });
})();
