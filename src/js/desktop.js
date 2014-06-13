angular.module('ezseed.desktop', ['ngAnimate'])
	.controller('DesktopCtrl', function($scope) {

		$scope.$watch('show_files', function(newValue, oldValue) {
			console.log(newValue, oldValue)
		})
	})
