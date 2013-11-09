/// <reference path="//Microsoft.WinJS.1.0/js/base.js" />
/// <reference path="//Microsoft.WinJS.1.0/js/ui.js" />
(function () {

    WinJS.Namespace.define("ErrorMessages", {
        ShortUsername: "\nUsername must be at least six symbols",
        EmailDontMatch: "\nEmail is invalide",
        ShortPassword: "\nPassword must be at least six symbols",
        PasswordDontMatch: "\nPasswords do not match",
        ShortTaskTitle: "\nTitle must not be empty",
    });

    WinJS.Namespace.define("Messages", {
        EmailSent: "\nEmail is send to email address",
    });

}())