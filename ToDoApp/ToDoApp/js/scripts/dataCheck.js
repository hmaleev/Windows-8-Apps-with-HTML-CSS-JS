/// <reference path="//Microsoft.WinJS.1.0/js/base.js" />
/// <reference path="//Microsoft.WinJS.1.0/js/ui.js" />
/// <reference path="const.js" />
/// <reference path="messages.js" />
(function () {

    var createDateTime = function (date, time) {
        //var newDateTime = date;
        //newDateTime.setHours(time.getHours());
        //newDateTime.setMinutes(time.getMinutes());

        return date +" " +time;
    }

    var checkUsername = function (username) {
        var message = "";

        if (username.length < Const.UsernameLenght) {
            message += ErrorMessages.ShortUsername;
        }

        return message;
    }

    var checkEmail = function (email) {
        var message = "";
        var checkEmailRegEx = /[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;

        if (email != email.match(checkEmailRegEx)) {
            message += ErrorMessages.EmailDontMatch;
        }

        return message;
    }

    var checkPassword = function (password, passwordConfirm) {
        var message = "";

        if (password.length < Const.PasswordLenght) {
            message += ErrorMessages.ShortPassword;
        }

        if (passwordConfirm != null) {
            if (password != passwordConfirm) {
                message += ErrorMessages.PasswordDontMatch;
            }
        }

        return message;
    }

    var checkTaskTitle = function (title) {
        var message = "";

        if (title.length < Const.TaskTitleMinLenght) {
            message += ErrorMessages.ShortTaskTitle;
        }

        return message;
    }

    WinJS.Namespace.define("Check", {
        Username: checkUsername,
        Email: checkEmail,
        Password: checkPassword,
        TaskTitle: checkTaskTitle,
        CreateDate: createDateTime
    });
}());