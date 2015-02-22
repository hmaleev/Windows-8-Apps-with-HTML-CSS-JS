(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/daily/arrivals/arrivals.html", {

        ready: function (element, options) {

            var p = document.getElementById("txt");
            var table = document.getElementById("table-arrivals");
            var pageinfo = document.getElementById("pageinfo");
            var results = Windows.Storage.ApplicationData.current.roamingSettings.values["displayFlights"];
            var appBar = document.getElementById("appbar");
            appBar.disabled = false;
            var n = new UI.ProgressBar(document.body);
            var update = document.getElementById("update");
            var messageShown = false;

            update.addEventListener("click", function () {
                WinJS.Navigation.navigate("/pages/daily/arrivals/arrivals.html");

            }, false);

            var backBtn = document.getElementsByClassName("win-backbutton");
            backBtn[0].addEventListener("click", function () {
                WinJS.Navigation.navigate("/pages/daily/daily.html");
            }, false);

            var date = new Date().toGMTString();
            date = date.replace("UTC", "GMT");

            if (results === undefined) {
                results = "20";
            }
                table.innerHTML = "<tbody></tbody>";
                var tableEndRow;
                var currentPage;
                var endPage;

                WinJS.xhr({
                    url: "http://213.91.213.82:8089/pages/arrivals.aspx",
                    type: "GET"
                }).then(function (response) {

                    pageinfo.innerHTML = toStaticHTML(response.responseText);
                    currentPage = document.getElementsByClassName("gridLinkActivePage");
                    currentPage = currentPage[0].textContent;
                    pageinfo.outerHTML = "";

                    switch (results) {
                        case "10": endPage = parseInt(currentPage) + 1; break;
                        case "20": endPage = parseInt(currentPage) + 2; break;
                    }
                    var x = 0;
                    for (var i = currentPage; i < endPage; i++) {
                        
                        WinJS.xhr({
                            url: "http://213.91.213.82:8089/pages/arrivals.aspx?lm01=103&lm02=51&lm03=51&p=" + i,
                            type: "GET",
                            headers: {
                                "If-Modified-Since": date
                            }
                        }).then(function (response) {

                            p.innerHTML += toStaticHTML(response.responseText);
                            table.innerHTML += document.getElementsByTagName("tbody")[x].innerHTML;

                            if (tableEndRow !== undefined && tableEndRow < table.rows.length) {
                                table.rows[tableEndRow + 1].innerHTML = "";
                                table.rows[tableEndRow].innerHTML = "";
                            }
                            tableEndRow = table.rows.length;
                            x++;
                            table.rows[0].outerHTML = "<tr><th>Дата</th><th>Час</th><th>Полет</th><th>Направление</th><th>Терминал</th><th>Очакван час</th><th>Статус</th><th>Наземен оператор</th></tr>";
                            table.rows[1].innerHTML = " ";
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
                            n.Hide();
                            date = new Date().toGMTString()
                        },
                       function (error) {
                         
                           var msgpopup = new Windows.UI.Popups.MessageDialog("Възникна грешка");
                           msgpopup.commands.append(new Windows.UI.Popups.UICommand("Ok", function () { }));
                           msgpopup.commands.append(new Windows.UI.Popups.UICommand("Изпрати съобщение до разрабочика", function () {

                               WinJS.xhr({
                                   type: "post", user: "api", password: "key-434f9830mw3ezyg6e7a43bmfm2ujcp80",
                                   //type: "post",
                                   url: "https://api.mailgun.net/v2/sofia-airport-app.mailgun.org/messages",
                                   headers: {
                                       "Content-type": "application/x-www-form-urlencoded",
                                       "From": "postmaster@sofia-airport-app.mailgun.org"
                                   },
                                   data: "from=postmaster@sofia-airport-app.mailgun.org&to=hmaleev@gmail.com&subject=Error Message" + error.status  + "&text=" + error.responseText
                               }).then(function (success) {
                                   console.log("Done");
                                   var messageSent = new Windows.UI.Popups.MessageDialog("Съобщението е изпратено успешно");
                                   messageSent.commands.append(new Windows.UI.Popups.UICommand("Ok", function () { }));
                                   messageSent.showAsync();
                               }, function (error) {
                                   console.log("error")
                               });

                           }));
                           if (!messageShown) {
                               msgpopup.showAsync();
                               messageShown = true;
                           }
                          
                           n.Hide();
                       });
                    }
                }, function (error) {
                    
                             var msgpopup = new Windows.UI.Popups.MessageDialog("Възникна грешка");
                             msgpopup.commands.append(new Windows.UI.Popups.UICommand("Ok", function () { }));
                             msgpopup.commands.append(new Windows.UI.Popups.UICommand("Изпрати съобщение до разрабочика", function () {

                                 WinJS.xhr({
                                     type: "post", user: "api", password: "key-434f9830mw3ezyg6e7a43bmfm2ujcp80",
                                     //type: "post",
                                     url: "https://api.mailgun.net/v2/sofia-airport-app.mailgun.org/messages",
                                     headers: {
                                         "Content-type": "application/x-www-form-urlencoded",
                                         "From": "postmaster@sofia-airport-app.mailgun.org"
                                     },
                                     data: "from=postmaster@sofia-airport-app.mailgun.org&to=hmaleev@gmail.com&subject=Error Message " + error.status + "&text=" + error.responseText
                                 }).then(function (success) {
                                     console.log("Done");
                                     var messageSent = new Windows.UI.Popups.MessageDialog("Съобщението е изпратено успешно");
                                     messageSent.commands.append(new Windows.UI.Popups.UICommand("Ok", function () { }));
                                     messageSent.showAsync();
                                 }, function (error) {
                                     console.log("error")
                                 });

                             }));
                        msgpopup.showAsync();
                        n.Hide();
                });
        }
    });
})();