(function () {

    angular
        .module('Smartway')
        .service('authService', authService);

    authService.$inject = ['$state'];

    function authService($state) {
        var vm = this;
        vm.message = '';

        function login(logUser) {


            // get all users from local storage .

            var users = JSON.parse(localStorage.getItem('user'))
            // if we have already users in local storage .
            if (users) {
                var isUser = false;
                users.map(function (user) {
                    if (user.username == logUser.username && user.password == logUser.password) {
                        isUser = true;
                    }
                });
                if (isUser) {

                    // Set the time that the access token will expire at 
                    // 72 second as average expireTime for session .

                    var expiresAt = JSON.stringify((7.2 * 100000) + new Date().getTime());
                    localStorage.setItem('currentUser', JSON.stringify(logUser));
                    localStorage.setItem('expires_at', expiresAt);
                    $state.go('/home');
                    return '';
                } else {
                    // debugger
                    vm.message = 'Invalid username or password please try again !';
                    return vm.message;
                }
            } else {
                vm.message = 'Your account dont belong to any of our users please signup';
                return vm.message;
                $state.go('/Signup');
            }

        }

        function signup(logUser) {
            if (logUser.password !== logUser.password2) {
                vm.message = 'Password does not match the confirm password.';
                return vm.message;
            }

            // get all users from local storage .

            var users = JSON.parse(localStorage.getItem('user'));
            // if we have already users in local storage .
            if (users) {

                var isUser = false
                users.map(function (user) {
                    if (user.username == logUser.username) {
                        isUser = true;
                    }
                });

                if (isUser) {
                    vm.message = 'We have already your account please login ...';
                    return vm.message;
                }

                users.push(logUser);
                localStorage.setItem('user', JSON.stringify(users));
                localStorage.setItem('currentUser', JSON.stringify(logUser));
                $state.go('/login');

            } else {

                var users = [logUser]
                localStorage.setItem('user', JSON.stringify(users));
                $state.go('/login');

            }

        }

        function logout() {

            // Remove tokens and expiry time from localStorage
            localStorage.removeItem('currentUser');
            localStorage.removeItem('id_token');
            localStorage.removeItem('expires_at');
            $state.go('/login');

        }

        function isAuthenticated() {
            // Check whether the current time is past the 
            // access token's expiry time
            var expiresAt = JSON.parse(localStorage.getItem('expires_at'));
            return new Date().getTime() < expiresAt;
        }
        return {
            login: login,
            logout: logout,
            signup: signup,
            isAuthenticated: isAuthenticated,
        }
    }

})();