(function () {
    'use strict';

    angular.module('Smartway').config(homeConfig);

    function homeConfig($stateProvider) {
        $stateProvider.state('/home', {
            url: '/home',
            controller: 'homeController',
            templateUrl: 'home/home.html',
            controllerAs: 'vm',
            authenticate: true
        })
    }

    angular
        .module('Smartway')
        .controller('homeController', homeController);

    function homeController(authService, dataService, $state, $window,$scope, $cookies) {
        var vm = this;


        prepareDomFunctions();

        function prepareDomFunctions() {

            // initialize  functions  for home  page .
            vm.logout             = logout;


            // initialize   data and functions  for news tab .
            vm.showMoreData       = false;            
            vm.windowHeight       = $(window).height() - 100;
            vm.news               = []; 
            vm.comments           = [];
            vm.getAllnews         = getAllnews;
            vm.getMoreData        = getMoreData;
            vm.getComments        = getComments;
            vm.hideCommentsBox    = hideCommentsBox;

            // call api service to get the news when load the page
            vm.getAllnews();

            // initialize data and function for polls tab .
            var prevPolls         = $cookies.get('Polls') ;

            if (prevPolls) {
                vm.polls          = JSON.parse($cookies.get('Polls'));
            } else {
                vm.polls          = [];
            }

            vm.pollData           = {};
            vm.pollData.question  = '';
            vm.pollData.answer1   = '';
            vm.pollData.answer2   = '';
            vm.pollData.answer3   = '';
            vm.addPoll            = addPoll;
            vm.removePoll         = removePoll;

        }

            // initialize   data and function for profile tab .
            vm.users              = JSON.parse(localStorage.getItem('user')) || [];
            vm.editMode           = false;
            vm.account            = JSON.parse(localStorage.getItem('currentUser')) || {};
            vm.getUserAccount     = getUserAccount;
            vm.updateProfile      = updateProfile;
            vm.changeToEditMode   = changeToEditMode;
            vm.cancelEditMode     = cancelEditMode;
            vm.userIndex          = undefined;


            vm.getUserAccount();

        // functions for news tab 
        function getAllnews() {
            dataService.getAllNews().then(function (results) {
                // to get the latest 5 news .
                results.reverse().forEach(function (item, index) {
                    if ( index < 5 ){
                        vm.news.push(item);
                    };
                })
            })
        };

        function getComments(id) {
            dataService.getAllCommentByPostId(id).then(function(comments){
                vm.comments = comments
            })
        }

        function getMoreData(item) {
            vm.selectedItem = item;
            vm.showMoreData = ! vm.showMoreData;
            (vm.showMoreData) ? vm.getComments(item.id) : 0;
        }

        function hideCommentsBox() {
            vm.showMoreData = false;
        }

        // functions for Polls tab 
        function addPoll() {
            var username = JSON.parse(localStorage.getItem('currentUser')).username;

            vm.polls.unshift({  question: vm.pollData.question,
                answers: [vm.pollData.answer1, vm.pollData.answer2, vm.pollData.answer3],
                date: (new Date() + '').substring(0, 16),
                username:username
             });

            vm.pollData.question  = '';
            vm.pollData.answer1   = '';
            vm.pollData.answer2   = '';
            vm.pollData.answer3   = '';

            // update Polls cookies 
            $cookies.put('Polls', JSON.stringify(vm.polls));
        }      

        function removePoll(index) {
            vm.polls.forEach(function (poll, idx) {
                if (index == idx) {
                    vm.polls.splice(idx,1)
                }          
            })

            // update Polls cookies 
            $cookies.put('Polls', JSON.stringify(vm.polls));            
        }

        // functions for profile tab 
        function getUserAccount() {

            if (vm.account) {
                vm.users.forEach(function (user, index) {
                    if(user.username == vm.account.username){
                        vm.account = user;
                        vm.userIndex = index;
                    }
                })
            }
        }

        function updateProfile() {

            if ( vm.account.password != vm.account.password2){
                vm.message = 'Password does not match the confirm password.'; 

                $("#profileModal").modal({
                        backdrop: "static"
                });

            } else {
                vm.message = 'Updated profile successfully ';            
                $("#profileModal").modal({
                        backdrop: "static"
                });   

                vm.users[vm.userIndex] = vm.account;
                localStorage.setItem('user', JSON.stringify(vm.users));
                localStorage.setItem('currentUser', JSON.stringify(vm.account));
                vm.editMode = false;
                     
            }
        }

        function changeToEditMode() {
            vm.editMode = true;
        }

        function cancelEditMode() {
            vm.editMode = false;
        }


        // function for logout 
        function logout() {
            authService.logout();
        }
    }

})();
