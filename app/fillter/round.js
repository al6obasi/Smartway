(function () {
    'use strict';    
    angular
        .module('Smartway').filter('round', function() {
        return function(input) {
            return (Math.round(input * 100)/100).toFixed(2);
        };
    });
})();