﻿/// <reference path="../../tasks/test/test.html" />
/// <reference path="../../tasks/show/show.html" />
/// <reference path="../../tasks/show/show.html" />
/// <reference path="../../../js/scripts/dataCheck.js" />
/// <reference path="../../../js/scripts/uiEditor.js" />
/// <reference path="../../../js/scripts/dataPersister.js" />
/// <reference path="../../../js/scripts/httpRequester.js" />
(function () {
    "use strict";
    WinJS.UI.Pages.define("/pages/menu/login/login.html", {
        ready: function (element, options) {
            var appBar = document.getElementById("appbar").winControl
            appBar.disabled = true;
            var localStorage = window.localStorage;
            var userInput = document.getElementById("user");
            var passwordInput = document.getElementById("pass");
            var remmemberCheckBox = document.getElementById("remmember");
            var gusetLoginButton = document.getElementById("login-guest-button");
            var loginButton = document.getElementById("login-button");
            var registerButton = document.getElementById("create-account-button");
            var recoveryButton = document.getElementById("password-recover-button");

            if (localStorage.getItem("remember") !== null) {
                var loadingBar = new UI.ProgressBar(document.body);
                loadingBar.Show();
                var input = JSON.parse( localStorage.getItem("remember"));
                Request.UserLogin(input.username, input.password).then(function (request) {
                    loadingBar.Hide();
                    var response = JSON.parse(request.response);
                    DataPersister.userData.username = input.username;
                    DataPersister.userData.password = input.password;
                    DataPersister.userData.sessionKey = response.sessionKey;
                    WinJS.Navigation.navigate("pages/tasks/show/show.html");
                });
            }

            gusetLoginButton.addEventListener("click", function () {
                var loadingBar = new UI.ProgressBar(document.body);
                loadingBar.Show();
                Request.UserLogin("anonymous", "123456").then(function (request) {
                    loadingBar.Hide();
                    var response = JSON.parse(request.response);
                    DataPersister.userData.username = "anonymous";
                    DataPersister.userData.password = "123456";
                    DataPersister.userData.sessionKey = response.sessionKey;
                    DataPersister.userData.remember = remmemberCheckBox.checked;

                    if (DataPersister.userData.remember == true) {
                        var values = { username: "anonymous", password: "123456" };
                        localStorage.setItem("remember", JSON.stringify(values));
                    }
                    WinJS.Navigation.navigate("pages/tasks/show/show.html");
                }, function (error) {
                    loadingBar.Hide();
                    var respons;
                    if (error.response != "") {
                        respons = JSON.parse(error.response);
                    }
                    else {
                        respons = "";
                    }
                    if (respons == Request.ErrorMessages.UserNotExist) {
                        UI.ChageBorderColor([userInput, passwordInput], Const.InputWrongFieldColor);
                        Message.Show(Request.ErrorMessages.UserNotExist);
                    }
                    else {
                        var msgpopup = new Windows.UI.Popups.MessageDialog(Request.ErrorMessages.UnhandledError);
                        msgpopup.commands.append(new Windows.UI.Popups.UICommand("Ok"));
                        msgpopup.showAsync();
                    }
                });
            });

            loginButton.addEventListener("click", function () {
                var loadingBar = new UI.ProgressBar(document.body);
                loadingBar.Show();

                UI.ChageBorderColor([userInput, passwordInput], Const.InputDefaultFieldColor);
               
                    var remmember = remmemberCheckBox.checked;
                    var username = userInput.value;
                    var password = passwordInput.value;
                    var message = "";
                    if (remmember == true) {
                        var values = { username: username, password: password };
                        localStorage.setItem("remember", JSON.stringify(values));
                    }
                    var wrongInputs = new Array();

                    var userCheck = Check.Username(username);
                    if (userCheck != "") {
                        message += userCheck;
                        wrongInputs.push(userInput);
                    }
                    var checkPassword = Check.Password(password);
                    if (checkPassword != "") {
                        wrongInputs.push(passwordInput);
                        message += checkPassword;
                    }

                    if (wrongInputs.length != 0) {
                        UI.ChageBorderColor(wrongInputs, Const.InputWrongFieldColor);
                        loadingBar.Hide();
                        Message.Show(message);
                        return;
                    }
                
                Request.UserLogin(username, password).then(function (request) {
                    loadingBar.Hide();
                    var response = JSON.parse(request.response);
                    DataPersister.userData.username = username;
                    DataPersister.userData.password = password;
                    DataPersister.userData.sessionKey = response.sessionKey;
                    DataPersister.userData.remember = remmemberCheckBox.checked;
                    if (DataPersister.userData.remember==true) {
                        var values={username:username, password:password};
                        localStorage.setItem("remember", JSON.stringify(values));
                        }

                    WinJS.Navigation.navigate("pages/tasks/show/show.html");

                }, function (error) {
                    loadingBar.Hide();
                    var respons;
                    if (error.response != "") {
                        respons = JSON.parse(error.response);
                    }
                    else {
                        respons = "";
                    }
                    if (respons == Request.ErrorMessages.UserNotExist) {
                        UI.ChageBorderColor([userInput, passwordInput], Const.InputWrongFieldColor);
                        Message.Show(Request.ErrorMessages.UserNotExist);
                    }
                    else {
                        var msgpopup = new Windows.UI.Popups.MessageDialog(Request.ErrorMessages.UnhandledError);
                        msgpopup.commands.append(new Windows.UI.Popups.UICommand("Ok"));
                        msgpopup.showAsync();
                    }
                });
            });

            registerButton.addEventListener("click", function () {
                WinJS.Navigation.navigate("pages/menu/register/register.html");
            });

            recoveryButton.addEventListener("click", function () {
                WinJS.Navigation.navigate("pages/menu/recovery/recovery.html");
            });

        },

    });
})();