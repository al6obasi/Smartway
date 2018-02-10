(function () {
    'use strict';    
    angular
        .module('Smartway').filter('round', function() {
        return function(input) {
        	var output = (Math.round(input * 100)/100).toFixed(2) ;
        	if( output == 'NaN' ){
        		return 0;
        	}
            return output;
        };
    });
})();