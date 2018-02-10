(function () {
    'use strict';

    angular
        .module('Smartway')
        .controller('homeController', homeController);


    function homeController(authService, dataService, $state) {

        // add cookies as depandances and invoke it .
        // setup cookies.

        var $cookies;
        angular.injector(['ngCookies']).invoke(['$cookies', function (_$cookies_) {
            $cookies = _$cookies_;
        }]);


        var vm = this;
        prepareDomFunctions();

        function prepareDomFunctions() {

            // initialize  functions  for home  page .
            vm.logout = logout;
            vm.isLoggedIn = authService.isLoggedIn();


            // initialize   data and functions  for news tab .
            vm.showMoreData = false;
            vm.comment = '';
            vm.post = '';
            vm.windowHeight = $(window).height() - 100;
            vm.news = [];
            vm.comments = [];
            vm.getAllnews = getAllnews;
            vm.getMoreData = getMoreData;
            vm.getComments = getComments;
            vm.hideCommentsBox = hideCommentsBox;
            vm.addComment = addComment;
            vm.addPost = addPost;

            // call api service to get the news when load the page
            vm.getAllnews();

            // initialize data and function for polls tab .
            var prevPolls = $cookies.get('Polls');

            vm.voteOnce = true;
            vm.showResult = false;

            vm.pollAnswer = '';
            vm.message = '';
            vm.viewResult = viewResult;
            vm.hidePollResult = hidePollResult;
            vm.vote = vote;

            if (prevPolls) {
                vm.polls = JSON.parse($cookies.get('Polls'));
                vm.lastPoll = vm.polls[0];
            } else {
                vm.polls = [];
                vm.lastPoll = {};
            }


            vm.pollData = {};
            vm.pollData.question = '';
            vm.pollData.answer1 = '';
            vm.pollData.answer2 = '';
            vm.pollData.answer3 = '';
            vm.addPoll = addPoll;
            vm.removePoll = removePoll;

        }

        // initialize   data and function for profile tab .
        vm.users = JSON.parse(localStorage.getItem('user')) || [];
        vm.editMode = false;
        vm.account = JSON.parse(localStorage.getItem('currentUser')) || {};
        vm.getUserAccount = getUserAccount;
        vm.updateProfile = updateProfile;
        vm.changeToEditMode = changeToEditMode;
        vm.cancelEditMode = cancelEditMode;
        vm.userIndex = undefined;


        vm.getUserAccount();

        // functions for news tab 
        function getAllnews() {
            vm.news = [];
            dataService.getAllNews().then(function (results) {
                // to get the latest 5 news .
                results.reverse().forEach(function (item, index) {
                    if (index < 5) {
                        vm.news.push(item);
                    };
                })
            })
        };

        function getComments(id) {
            dataService.getAllCommentByPostId(id).then(function (comments) {
                vm.comments = comments
            })
        }

        function getMoreData(item) {
            vm.selectedItem = item;
            vm.showMoreData = true;
            vm.getComments(item.id);

        }

        function hideCommentsBox() {
            vm.showMoreData = false;
        }

        function addComment() {
            if (vm.comment == '' || !vm.comment) {
                return;
            }

            var postId = vm.selectedItem.id;
            var userEmail = JSON.parse(localStorage.getItem('currentUser')).email;

            var comment = {
                'body': vm.comment,
                'postId': postId,
                'email': userEmail
            }

            dataService.addComment(comment).then(function (results) {
                vm.comments.push(results);
                // vm.getComments(results.postId);
                vm.comment = '';
            })
        }

        function addPost() {

            if (vm.post == '' || !vm.post) {
                return;
            }
            var email = (JSON.parse(localStorage.getItem('currentUser'))).email
            var post = {
                "title": vm.post,
                "author": email
            }

            dataService.addPost(post).then(function (results) {
                vm.getAllnews();
                vm.comment = '';
            })
            vm.post = '';
        }

        // functions for Polls tab 
        function addPoll() {
            var email = (JSON.parse(localStorage.getItem('currentUser'))).email

            vm.polls.unshift({
                question: vm.pollData.question,
                answers: [{
                        text: vm.pollData.answer1,
                        count: 0
                    },
                    {
                        text: vm.pollData.answer2,
                        count: 0
                    },
                    {
                        text: vm.pollData.answer3,
                        count: 0
                    },
                ],
                date: (new Date() + '').substring(0, 16),
                email: email,
                users: [],
                totalCount: 0
            });
            vm.pollmessage = '';
            vm.pollData.question = '';
            vm.pollData.answer1 = '';
            vm.pollData.answer2 = '';
            vm.pollData.answer3 = '';
            vm.lastPoll = vm.polls[0];
            vm.allowUser = true;
            vm.showResult = false;


            // update Polls cookies 
            $cookies.put('Polls', JSON.stringify(vm.polls));
        }

        function removePoll(index) {
            vm.polls.forEach(function (poll, idx) {
                if (index == idx) {
                    vm.polls.splice(idx, 1)
                    if (index == 0) {
                        vm.lastPoll = vm.polls[0];
                    }
                }
            })
            vm.showResult = false;
            // vm.allowUser = true;
            vm.message = '';
            // update Polls cookies 
            $cookies.put('Polls', JSON.stringify(vm.polls));
        }

        function viewResult() {
            vm.showResult = true;
        }

        function hidePollResult() {
            vm.showResult = false;
        }

        function vote() {

            var email = vm.account.email;
            vm.pollmessage = '';
            vm.allowUser = true;
            vm.polls[0].users.map(function (user) {

                if (user == email) {
                    vm.pollmessage = ' You are already voted in this poll ... ! ';
                    vm.allowUser = false;
                    vm.showResult = true;
                    return;
                }
            })

            if (vm.allowUser) {
                vm.polls[0].answers.map(function (answer) {
                    if (answer.text == vm.pollAnswer) {
                        answer.count++;
                        vm.polls[0].totalCount++;
                        vm.polls[0].users.push(email);
                    }
                })
                vm.pollmessage = '';
                $cookies.put('Polls', JSON.stringify(vm.polls));
                vm.voteOnce = false;
                vm.showResult = true;
            }
        }


        // functions for profile tab :

        function getUserAccount() {

            if (vm.account) {
                vm.users.forEach(function (user, index) {
                    if (user.email == vm.account.email) {
                        vm.account = user;
                        vm.userIndex = index;
                    }
                })
            }
        }

        function updateProfile() {

            if (vm.account.password != vm.account.password2) {
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


        // function for logout :
        
        function logout() {
            authService.logout();
        }

    }

})();