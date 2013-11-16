(function () {
    "use strict";
    WinJS.UI.Pages.define("/pages/home/home.html", {
        ready: function (element, options) {
            var appBar = document.getElementById("appbar");
            appBar.disabled = true;
        }
    });
})();

function GoToArrivals(e) {
    e.preventDefault();
    WinJS.Navigation.navigate('/pages/arrivals/arrivals.html');
}

function GoToDepartures(e) {
    e.preventDefault();
    WinJS.Navigation.navigate('/pages/departures/departures.html');
}