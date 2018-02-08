(function () {
    'use strict';

    angular
        .module('Smartway')
        .controller('loginController', loginController);

    function loginController(authService) {

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

            vm.message     = authService.login(vm.user);
        }


        function signup() {

            vm.message     = authService.signup(vm.user);
        }
    }
})();