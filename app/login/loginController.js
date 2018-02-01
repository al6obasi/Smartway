(function () {
    'use strict';
    angular
        .module('Smartway')
        .config(loginConfig);

    function loginConfig($stateProvider) {

        $stateProvider.state('/Signup', {
            url: '/Signup',
            controller: 'loginController',
            templateUrl: 'login/Signup.html',
            controllerAs: 'vm'
        });

        $stateProvider.state('/login', {
            url: '/login',
            controller: 'loginController',
            templateUrl: 'login/login.html',
            controllerAs: 'vm',
            authenticate: false
        });

        $stateProvider.state('/logout', {
            url: '/logout',
            controller: 'loginController',
            templateUrl: 'login/login.html',
            controllerAs: 'vm'
        });

    }

    angular
        .module('Smartway')
        .controller('loginController', loginController);

    function loginController(authService, $rootScope, $state) {

        var vm = this;
        vm.message = '';
        vm.user = {
            name:'',
            username:'',
            password:'',
            password2:'',
            email:'',
            city:''
        }

        preparePage();

        function preparePage() {

            vm.signin      = signin;
            vm.signup      = signup;
        }

        function signin() {
            vm.message = authService.login(vm.user);
        }


        function signup() {
            vm.message = authService.signup(vm.user);

        }
    }
})();