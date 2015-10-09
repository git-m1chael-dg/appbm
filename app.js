(function(){

    if( !/bookings/i.test(location.href)){
        location.href = "https://manage.grabtaxi.com/bookings";
    }
    else{

        var tds = $("td.booking-code");

        angular.forEach(tds,function(td){

            var bookingEl = td.firstChild();
            var code = bookingEl.text();

            $http.get("https://manage.grabtaxi.com/bookings/" + code)
                .success(function (data, status) {

                    var el = $('<div display="block:none"></div>');
                    el.html(data);
                    var amount = $('body > div.wrapper > div > div > div:nth-child(40) > div.span6.attrValue', el).text();

                    console.log(code + " -  " + amount);
                })
        });

    }
})();