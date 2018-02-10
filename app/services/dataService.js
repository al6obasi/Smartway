/**
 * Handles calls to the API
 */
(function () {
    'use strict';

    angular
        .module('Smartway')
        .factory('dataService', dataService);

    function dataService($q, $http, $timeout) {


        var serviceUrl = "http://localhost:3000";

        return {
            getAllNews: getAllNews,
            getAllCommentByPostId: getAllCommentByPostId,
            addComment: addComment,
            addPost: addPost
        };

        function httpGet(url, parameters) {
            var promise = $http.get(url + parameters);
            return promise;
        }


        function httpPost(uri, data) {
            var promise = $http.post(uri, data);
            return promise;
        }

        function getAllNews() {

            var deferred = $q.defer();

            httpGet(serviceUrl + "/posts", '').then(getAllNewsSuccess, getAllNewsError);

            function getAllNewsSuccess(response) {
                deferred.resolve(response.data);
            }

            function getAllNewsError(response) {
                deferred.reject(response);
            }

            return deferred.promise;
        }

        function getAllCommentByPostId(id) {

            var deferred = $q.defer();

            httpGet(serviceUrl + "/comments?postId=", id).then(getAllCommentSuccess, getAllCommentError);

            function getAllCommentSuccess(response) {
                deferred.resolve(response.data);
            }

            function getAllCommentError(response) {
                deferred.reject(response);
            }

            return deferred.promise;
        }

        function addComment(data) {
            var deferred = $q.defer();
            httpPost(serviceUrl + "/posts/" + data.postId + "/comments/", data).then(addCommentSuccess, addCommentError);

            function addCommentSuccess(response) {
                deferred.resolve(response.data);
            }

            function addCommentError(response) {
                deferred.reject(response.data);
            }

            return deferred.promise;
        }

        function addPost(data) {
            var deferred = $q.defer();
            httpPost(serviceUrl + "/posts/", data).then(addPostSuccess, addPostSuccessError);

            function addPostSuccess(response) {
                deferred.resolve(response.data);
            }

            function addPostSuccessError(response) {
                deferred.reject(response.data);
            }

            return deferred.promise;
        }


    }

})();