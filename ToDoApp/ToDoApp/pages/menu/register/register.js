/// <reference path="../../../js/scripts/popUpMessage.js" />
/// <reference path="../../../js/scripts/dataCheck.js" />
/// <reference path="../../../js/scripts/httpRequester.js" />
/// <reference path="../../../js/scripts/dataPersister.js" />
/// <reference path="../../../js/scripts/popUpMessage.js" />
/// <reference path="../../../js/scripts/uiEditor.js" />
// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/menu/register/register.html", {

        ready: function (element, options) {
            var usernameInput = document.getElementById("user");
            var passwordInput = document.getElementById("pass");
            var confirmPasswordInput = document.getElementById("confirmPass");
            var emailInput = document.getElementById("email");
            var remmemberCheckBox = document.getElementById("remmember");
            var registerButton = document.getElementById("create-account-button");

            registerButton.addEventListener("click", function () {
                var loadingBar = new UI.ProgressBar(document.body);
                loadingBar.Show();

                UI.ChageBorderColor([usernameInput, passwordInput, confirmPasswordInput, emailInput], Const.InputDefaultFieldColor);

                var username = usernameInput.value;
                var password = passwordInput.value;
                var confirmPassword = confirmPasswordInput.value;
                var email = emailInput.value;
                var message = "";
                var wrongInputs = new Array();

                var checkUsername = Check.Username(username);
                if (checkUsername.length != "") {
                    wrongInputs.push(usernameInput);
                    message += checkUsername;
                }

                var checkEmail = Check.Email(email);
                if (checkEmail != "") {
                    wrongInputs.push(emailInput);
                    message += checkEmail;
                }

                var checkPassword = Check.Password(password, confirmPassword)
                if (checkPassword != "") {
                    wrongInputs.push(passwordInput);
                    wrongInputs.push(confirmPasswordInput);
                    message += checkPassword;
                }

                if (message != "") {
                    loadingBar.Hide();
                    UI.ChageBorderColor(wrongInputs, Const.InputWrongFieldColor);
                    Message.Show(message);
                    return;
                }

                Request.UserRegister(username, password, email).then(function (request) {
                    loadingBar.Hide();
                    var response = JSON.parse(request.response);
                    DataPersister.userData.username = username;
                    DataPersister.userData.sessionKey = response.sessionKey;
                    DataPersister.userData.remember = remmemberCheckBox.checked;
                    if (response.data != "" && response.data !== undefined) {
                        DataPersister.userData.data = JSON.parse(response.data);
                        DataPersister.update();
                    }

                    WinJS.Navigation.navigate("pages/tasks/show/show.html");

                }, function (request) {
                    loadingBar.Hide();
                    var response = JSON.parse(request.response);

                    if (response == Request.ErrorMessages.UsernameExist) {
                        Message.Show(Request.ErrorMessages.UsernameExist);
                    }
                    else {
                        Message.Show(Request.ErrorMessages.UnhandledError);
                    }
                });
            });
        }
    });
})();
