/**
 * Handles calls to the API
 */
(function () {
    'use strict';

    angular
        .module('Smartway')
        .factory('dataService', dataService);

    function dataService( $q, $http, $timeout) {


        var serviceUrl = "http://jsonplaceholder.typicode.com";

        return {
            getAllNews:getAllNews,
            getAllCommentByPostId:getAllCommentByPostId
        };

        function httpGet(url, parameters) {
            var promise = $http.get(url + parameters);
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

    }

})();
