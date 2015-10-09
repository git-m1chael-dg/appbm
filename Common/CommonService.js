gammaModule.service('CommonFunc', function ($http,toaster) {
        var commonFunc = function($http,toaster) {
            var self = this;

            self.version =  function(){
              return "0.01";
            };


            self.PopWarning = function (msg) {
                toaster.pop({
                    type: 'warning',
                    title: 'tatae ako',
                    body: msg,
                    showCloseButton: true
                });
            };

            self.PopError = function (msg) {
                toaster.pop({
                    type: 'error',
                    title: 'teka may error',
                    body: msg,
                    showCloseButton: true
                });
            };

            self.PopSuccess = function (msg) {
                toaster.pop({
                    type: 'success',
                    title: 'ooppss',
                    body: msg,
                    showCloseButton: true
                });
            };

            self.getArrayForCsv = function (accounts) {
                var list = [];

                angular.forEach(accounts, function (account) {
                    list.push({
                        UserCode: account.UserCode,
                        ReferredBy: account.ReferredBy,
                        ActivationCode: account.ActivationCode
                    });
                });

                return list;
            };


            self.getCurrentTime = function () {
                var currentTime = new Date();
                var time = currentTime.getHours() + ":" + currentTime.getMinutes() + ":" + currentTime.getSeconds();
                return time;
            };

            var timer;



            self.transformToFormEncoding = function (data) {
                var key, result = [];
                for (key in data) {
                    if (data.hasOwnProperty(key)) {
                        result.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key]));
                    }
                }
                return result.join("&");
            };

            self.getFormEncodingHeader = function(){
                return {
                    transformRequest: self.transformToFormEncoding,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                };
            };


            self.convertToFormData = function(json){
                var fd = new FormData();
                var key;
                for (key in json) {
                    fd.append(key, json[key]);
                }
                return fb;
            };

            self.getMultiUrlEncodedHeader = function(){
              return {
                  transformRequest: angular.identity,
                  headers: {'Content-Type': undefined}
              };
            };

            self.isDateWith14Days = function(rbDate){ // YYYY-MM-DD
                var value = rbDate.split('-');
                var inputDate = new Date(value[0], value[1]-1, value[2]);
                var today = new Date();
                var endDate = new Date(today.getYear(), today.getMonth(), today.getDate());
                endDate.setDate(endDate.getDate() - 14);


                return inputDate.getYear() >= endDate.getYear() &&
                inputDate.getMonth() >= endDate.getMonth() &&
                inputDate.getDate() >= endDate.getDate();
            }
        };

        return new commonFunc($http,toaster);
    });