(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/settings/settings.html", {

        ready: function (element, options) {

            var defaultFilghtsToShow = Windows.Storage.ApplicationData.current.roamingSettings.values["displayFlights"];    
            var v = Windows.Storage.ApplicationData.current.roamingSettings.values["optionValue"];
            var x = document.getElementById("displayFlights");
                     console.log(WinJS.Application.roaming.folder.path);
            console.log(defaultFilghtsToShow);
            console.log(v);

            if (v===undefined) {
                v = 1;
                x.selectedIndex = v;
            }
            else {
                x.selectedIndex = v;
            }
            if (defaultFilghtsToShow === undefined) {
                defaultFilghtsToShow = displayFlights.options[v].value;
            }
            displayFlights.onchange = function (e) {
                Windows.Storage.ApplicationData.current.roamingSettings.values["displayFlights"] = displayFlights.options[displayFlights.selectedIndex].value;
                Windows.Storage.ApplicationData.current.roamingSettings.values["optionValue"] = displayFlights.options[displayFlights.selectedIndex].index;
                console.log(defaultFilghtsToShow);
            }
           
        },
    });
})();