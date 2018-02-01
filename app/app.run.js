(function () {

    'use strict';

    angular
        .module('Smartway')
        .run(run);

    run.$inject = ['authService', '$state', '$rootScope', '$window'];

    function run(authService, $state, $rootScope) {

        // when route change check if current user authenticated or not .


        $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
            if (toState.authenticate && !authService.isAuthenticated()) {
                // User isn’t authenticated
                $state.transitionTo("/login");
                event.preventDefault();
            }
        });
    }

})();