function Booking(index, bookingCode) {
    var self = this;
    self.Index = index;
    self.bookingCode = userName;
    self.passenger = '';
    self.state = '';

    self.promoCode = '';
    self.amount  = '';
    self.downloadBtn='Download';
}

gammaModule.controller('DashboardCtrl', function ($scope, $http, $timeout, toaster, CommonFunc) {

    var self = this;


    selt.getBookingUrl = function(bookingCode){
        return "https://manage.grabtaxi.com/bookings/" + bookingCode;
    };

    // settings
    self.settings = $scope.settings = new DashboardSetting();

    self.currentRequestIndex = 0;

    $scope.version = CommonFunc.version();
    $scope.stopTask = true;
    $scope.isDone = true;

    $scope.csvContent = '';
    $scope.bookings = [];

    $scope.logs = [];



    $scope.Stop = function () {
        $scope.stopTask = true;
        CommonFunc.PopWarning("Stopping the current task..pls wait");
    };

    $scope.Download = function () {
        $scope.stopTask = false;
        $scope.isDone = false;
        self.currentRequestIndex = 0;
        next();
    };

    $scope.LoginToDownloadOneItem = function (user) {

        $scope.isDone = false;
        $scope.stopTask = false;
        user.DownloadBtn = "Downloading..";

        var postData = getPostData(user);

        $http.post(self.LoginUrl, postData, {
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function (data, status) {
            var success = false;
            if (status == 0) {
                log('No connection. Verify application is running.');
            } else if (status == 401) {
                log('Unauthorized');
            } else if (status == 405) {
                log('HTTP verb not supported [405]');
            } else if (status == 500) {
                log('Internal Server Error [500].');
            } else {
                success = isSuccess(user, data);
                if (success) {
                    DownloadDashboard(user, false);
                    log("Logg-in successfully for user : " + user.UserName);
                } else {
                    CommonFunc.PopError("Logg-in failed for user : " + user.UserName);
                }
            }
            if (success == false) {
                $scope.isDone = true;
                user.DownloadBtn = "Download";
            }
        }).error(function (data, status) {
            if (status == 0) {
                log('No connection. Verify application is running.');
            } else if (status == 401) {
                log('Unauthorized');
            } else if (status == 405) {
                log('HTTP verb not supported [405]');
            } else if (status == 500) {
                log('Internal Server Error [500].');
            } else {
                log(data);
            }
            log("Failure. User : " + user.UserName);
            $scope.isDone = true;
            user.DownloadBtn = "Download";
            CommonFunc.PopError("Failure. User : " + user.UserName);
        });

    };


    $scope.getArrayForCsv = function () {

        return $scope.bookings;
    };


    function next() {
        if (!$scope.stopTask)
            $timeout(makeNextRequest, 500);
        else
            $scope.isDone = true;
    }

    function makeNextRequest() {
        if (self.currentRequestIndex < $scope.users.length) {
            var book = $scope.bookings[self.currentRequestIndex];
            if (book.wasDownloaded) {
                self.currentRequestIndex++;
                next();
                return;
            }
            book.downloadBtn = "Downloading...";


            DownloadBooking(book);
        } else {
            $scope.isDone = true;
            $scope.stopTask = false;
        }
    }

    function LogInToDashboard(user, postData) {

        $http.post(self.LoginUrl, postData, {
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function (data, status) {
            var success = false;
            if (status == 0) {
                log('No connection. Verify application is running.');
            } else if (status == 401) {
                log('Unauthorized');
            } else if (status == 405) {
                log('HTTP verb not supported [405]');
            } else if (status == 500) {
                log('Internal Server Error [500].');
            } else {
                success = isSuccess(user, data);
                if (success) {
                    user.Status = 'login success';
                    log("Login success for user: " + user.UserName);
                    DownloadDashboard(user, true);
                } else {
                    CommonFunc.PopError("Login failed for user: " + user.UserName);
                }
            }
            if (success == false) {
                $scope.isDone = true;
                user.DownloadBtn = "Download";
            }
        }).error(function (data, status) {
            if (status == 0) {
                log('No connection. Verify application is running.');
            } else if (status == 401) {
                log('Unauthorized');
            } else if (status == 405) {
                log('HTTP verb not supported [405]');
            } else if (status == 500) {
                log('Internal Server Error [500].');
            } else {
                log(data);
            }
            log("Failure. User : " + user.UserName);
            $scope.isDone = true;
            user.DownloadBtn = "Download";
            CommonFunc.PopError("Failure. User : " + user.UserName);
        });
    }

    function isSuccess(user, response) {
        user.IsError = true;
        user.IsSuccess = false;
        if (/location.href="pages/i.exec(response)) {
            user.IsError = false;
            return true;
        } else if (response.indexOf("max_user_connections") > -1) {
            user.Status = "User hpidirec_admin already has more than 'max_user_connections' active connections";
            log("User hpidirec_admin already has more than 'max_user_connections' active connections");
        } else if (response.indexOf("Username or Password is Incorrect") > -1) {
            user.Status = "Username or Password is Incorrect";
            log("Username or Password is Incorrect");
        } else {
            user.Status = "cannot determine the response of the server.";
            log("User user '" + user.UserName + "' was send to server but the server did not respond properly or the status is different");
            log(response);
        }

        return false;
    }

    function log(msg) {
        $scope.logs.push(CommonFunc.getCurrentTime() + " : " + msg);
        console.log(msg);
    }


    function DownloadBooking(booking, proceedToNext) {

        log("Downloading booking. User : " + booking.bookingCode);

        getData(self.ActiveAccntUrl, function (data, status) {
            if (status == 200) {
                var el = $('<div display="block:none"></div>');
                el.html(data);
                booking.amount = $('#income-summary > tbody > tr', el).length;

                DoNextIfAllDownloaded(proceedToNext, true, user);
            } else {
                DoNextIfAllDownloaded(proceedToNext, false, user);
            }

        }, function (data, status) {
            downloadState.Dashboard = true;
            DownloadErrorHandle(user);
        });
    }

    function DownloadErrorHandle(user){
        log("Failure. User : " + user.UserName);
        $scope.isDone = true;
        user.DownloadBtn = "Download";
        CommonFunc.PopError("Failure. Fetching the dashboard info of user : " + user.UserName);
    }
    function DoNextIfAllDownloaded(proceedToNext,isSuccessful,user){
        if(isSuccessful) {
            user.WasDownloaded = true;
            user.IsSuccess = true;
            user.DownloadBtn = "Download";
            if (proceedToNext) {
                self.currentRequestIndex++;

                if (self.currentRequestIndex < $scope.users.length) {
                    next();
                } else
                    $scope.isDone = true;
            } else
                $scope.isDone = true;
        }else
            $scope.isDone = true;

    }
    function getData(url, success, error) {

        $http.get(url)
            .success(function (data, status) {

                if (status == 0) {
                    log('No connection. Verify application is running.');
                } else if (status == 401) {
                    log('Unauthorized');
                } else if (status == 405) {
                    log('HTTP verb not supported [405]');
                } else if (status == 500) {
                    log('Internal Server Error [500].');
                }
                success(data,status);

            })
            .error(function (data, status) {
                if (status == 0) {
                    log('No connection. Verify application is running.');
                } else if (status == 401) {
                    log('Unauthorized');
                } else if (status == 405) {
                    log('HTTP verb not supported [405]');
                } else if (status == 500) {
                    log('Internal Server Error [500].');
                } else {
                    log(data);
                }
                error(data,status);

            });
    }
});