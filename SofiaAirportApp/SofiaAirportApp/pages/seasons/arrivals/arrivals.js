// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/seasons/arrivals/arrivals.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
              ready: function (element, options) {
            // TODO: Initialize the page here.
            var p = document.getElementById("txt");
            var table = document.getElementById("table-arrivals");
            var pageinfo = document.getElementById("pageinfo");
            var results = Windows.Storage.ApplicationData.current.roamingSettings.values["displayFlights"];
            var appBar = document.getElementById("appbar");
            appBar.disabled = false;
          //  var n = new UI.ProgressBar(document.body);
            var update = document.getElementById("update");

            update.addEventListener("click", function () {
                WinJS.Navigation.navigate("/pages/seasons/arrivals/arrivals.html");

            }, false);

            var backBtn = document.getElementsByClassName("win-backbutton");
            backBtn[0].addEventListener("click", function () {
                WinJS.Navigation.navigate("/pages/seasons/seasons.html");
            }, false);

            var date = new Date().toGMTString();
            date = date.replace("UTC", "GMT");

            if (results === undefined) {
                results = "20";
            }
                table.innerHTML = "<tbody></tbody>";
          //      n.Show();
                var tableEndRow;
                var currentPage;
                var endPage;

                WinJS.xhr({
                    url: "http://www.sofia-airport.bg/pages/seasonArrivals.aspx",
                    type: "GET"
                }).then(function (response) {

                    pageinfo.innerHTML = toStaticHTML(response.responseText);
                    currentPage = document.getElementsByClassName("gridLinkActivePage");
                    currentPage = currentPage[0].textContent;
                    pageinfo.outerHTML = "";

                    //switch (results) {
                    //    case "10": endPage = parseInt(currentPage) + 1; break;
                    //    case "20": endPage = parseInt(currentPage) + 2; break;
                    //}
                    var x = 0;
                    for (var i = 1; i < 8; i++) {
                        
                        WinJS.xhr({
                            url: "http://www.sofia-airport.bg/pages/seasonArrivals.aspx?lm01=103&lm02=52&lm03=53&p=" + i,
                            type: "GET",
                            headers: {
                                "If-Modified-Since": date
                            }
                        }).then(function (response) {
                            p.innerHTML += toStaticHTML(response.responseText);
                            table.innerHTML += document.getElementsByClassName("gridTable")[x].innerHTML;

                            if (tableEndRow !== undefined && tableEndRow < table.rows.length) {
                                //table.rows[tableEndRow + 1].innerHTML = "";
                                table.rows[tableEndRow].outerHTML = "";
                            }
                            tableEndRow = table.rows.length;
                            x++;
                            //table.rows[0].outerHTML = "<tr><th>Дата</th><th>Час</th><th>Полет</th><th>Направление</th><th>Терминал</th><th>Очакван час</th><th>Статус</th><th>Наземен оператор</th></tr>";
                            //table.rows[1].innerHTML = " ";
                            for (var i = 1; i < table.rows.length; i++) {
                                console.log(i);
                                if (i % 2 == 1) {
                                    table.rows[i].style.backgroundColor = "#200C69";
                                    table.rows[i].style.color = "#fff";
                                }
                                else {
                                    table.rows[i].style.backgroundColor = "#0093DD";
                                    table.rows[i].style.color = "#fff";
                                }
                            }
               //             n.Hide();
                            date = new Date().toGMTString()
                        },
                   function (error) {
                       if (error.status == 502) {
                           var msgpopup = new Windows.UI.Popups.MessageDialog("Няма връзка с Интернет");
                           msgpopup.commands.append(new Windows.UI.Popups.UICommand("Ok", function () { }));

                           msgpopup.showAsync();
              //             n.Hide();
                       }
                       else {
                           var msgpopup = new Windows.UI.Popups.MessageDialog("Възникна грешка");
                           msgpopup.commands.append(new Windows.UI.Popups.UICommand("Ok", function () { }));

                           msgpopup.showAsync();
             //              n.Hide();
                       }
                   });
                    }
                }, function (error) {
                    if (error.status == 502) {
                        var msgpopup = new Windows.UI.Popups.MessageDialog("Няма връзка с Интернет");
                        msgpopup.commands.append(new Windows.UI.Popups.UICommand("Ok", function () { }));

                        msgpopup.showAsync();
          //              n.Hide();
                    }
                    else {
                        var msgpopup = new Windows.UI.Popups.MessageDialog("Възникна грешка");
                        msgpopup.commands.append(new Windows.UI.Popups.UICommand("Ok", function () { }));

                        msgpopup.showAsync();
           //             n.Hide();
                    }
                });
        },

        unload: function () {
            // TODO: Respond to navigations away from this page.
        },

        updateLayout: function (element, viewState, lastViewState) {
            /// <param name="element" domElement="true" />

            // TODO: Respond to changes in viewState.
        }
    });
})();
