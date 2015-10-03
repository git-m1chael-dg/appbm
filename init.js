
$('bookings_table_additional_info_content').append("<div ng-controller='DashboardCtrl'><dashboard></dashboard></div>");

var app = angular.module('bookmarklet', ['toaster','ngSanitize', 'ngCsv']);

app.run(function ($rootScope) {
    $rootScope.URL = location.href;
});