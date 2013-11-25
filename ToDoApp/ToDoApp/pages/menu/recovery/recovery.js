/// <reference path="../../../js/scripts/messages.js" />
/// <reference path="../../../js/scripts/httpRequester.js" />
/// <reference path="../../../js/scripts/popUpMessage.js" />
/// <reference path="../../../js/scripts/const.js" />
/// <reference path="../../../js/scripts/uiEditor.js" />
/// <reference path="../../../js/scripts/messages.js" />
/// <reference path="../../../js/scripts/dataCheck.js" />
// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/menu/recovery/recovery.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            var usernameInput = document.getElementById("user");
            var passwordInput = document.getElementById("pass");
            var confirmPasswordInput = document.getElementById("confirmPass");
            var emailInput = document.getElementById("email");
            var recoveryBtn = document.getElementById("password-recovery-button");

            recoveryBtn.addEventListener("click", function () {
                var loadingBar = new UI.ProgressBar(document.body);
                loadingBar.Show();

                UI.ChageBorderColor([usernameInput, passwordInput, confirmPasswordInput, emailInput], Const.InputDefaultFieldColor);

                var username = usernameInput.value;
                var password = passwordInput.value;
                var confirmPassword = confirmPasswordInput.value;
                var email = emailInput.value;
                var message = "";
                var wrongInputs = new Array();

                var userCheck = Check.Username(username);
                if (userCheck.length != "") {
                    wrongInputs.push(usernameInput);
                    message += userCheck;
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

                Request.UserRecoverPassword(username, password, email).then(function (request) {
                    loadingBar.Hide();
                    Message.Show(Messages.EmailSent);
                }, function (request) {
                    UI.ChageBorderColor([usernameInput], Const.InputWrongFieldColor);
                    loadingBar.Hide();
                    var response = JSON.parse(request.response);

                    if (response == Request.ErrorMessages.UserOrEmailAreWrong) {
                        Message.Show(Request.ErrorMessages.UserOrEmailAreWrong);
                    }
                    else {
                        Message.Show(Request.ErrorMessages.UnhandledError);
                    }
                });
            });
        }
    });
})();
