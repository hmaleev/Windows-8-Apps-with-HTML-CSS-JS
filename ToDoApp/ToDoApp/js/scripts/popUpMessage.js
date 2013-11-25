/// <reference path="//Microsoft.WinJS.2.0/js/base.js" />
/// <reference path="//Microsoft.WinJS.2.0/js/ui.js" />
(function () {
    WinJS.Namespace.define("Message", {
        Show: function (message) {
            var msgpopup = new Windows.UI.Popups.MessageDialog(message);
            msgpopup.commands.append(new Windows.UI.Popups.UICommand("Ok"));
            msgpopup.showAsync();
        }
    });
}())