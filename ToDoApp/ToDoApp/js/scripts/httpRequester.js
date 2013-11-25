/// <reference path="//Microsoft.WinJS.2.0/js/ui.js" />
/// <reference path="cryptojs-sha1.js" />
/// <reference path="//Microsoft.WinJS.2.0/js/base.js" />
(function () {
    WinJS.Namespace.define("Request", {
        _httpRequester: function (url, type, data) {
            return WinJS.xhr({
                url: url,
                type: type,
                data: JSON.stringify(data),
                headers: { "Content-type": "application/json" }
            });
        },

        _serverRootUrl: function () { return "http://todoapp-5.apphb.com/api/" },

        UserLogin: function (username, password) {
            var data = {
                username: username,
                pasword:password,
                authoCode: CryptoJS.SHA1(username + password).toString(),
            };

            return this._httpRequester(this._serverRootUrl() + "user/login/", "post", data);
        },
        UserDownloadTasks: function (username, password) {
            var data = {
                username: username,
                authoCode: CryptoJS.SHA1(username + password).toString(),
            };

            return this._httpRequester(this._serverRootUrl() + "user/login/", "post", data);
        },

        UserRegister: function (username, password, email) {
            var data = {
                username: username,
                authoCode: CryptoJS.SHA1(username + password).toString(),
                email: email
            };

            return this._httpRequester(this._serverRootUrl() + "user/register/", "post", data);
        },

        UserSync: function (sessioKey, data) {

            return this._httpRequester(this._serverRootUrl() + "user/sync/" + sessioKey, "post", data);
        },

        UserUpdateTasks: function (sessionKey, lastLogin) {
            return this._httpRequester(this._serverRootUrl() + "user/sync/" + sessionKey, "post", lastLogin);
        },

        UserChageEmail: function (sessionKey, newEmail) {
            return this._httpRequester(this._serverRootUrl() + "user/chageemail/" + sessionKey, "post", newEmail);
        },

        UserChangePassword: function (sessionKey, username, newPassword) {
            var authoCode = CryptoJS.SHA1(username + password).toString();
            return this._httpRequester(this._serverRootUrl() + "user/chagepassword/" + sessionKey, "post", authoCode);
        },

        UserRecoverPassword: function (username, newPassword, email) {
            var data = {
                username: username,
                newAuthoCode: CryptoJS.SHA1(username + newPassword).toString(),
                email: email
            };

            return this._httpRequester(this._serverRootUrl() + "recovery/sendEmail", "post", data);
        },

        UserLogOut: function (sessionKey) {
            return this._httpRequester(this._serverRootUrl() + "user/logout/" + sessionKey, "get");
        },

        GetUserData: function (sessionKey) {
            return this._httpRequester(this._serverRootUrl() + "user/data/" + sessionKey, "get");
        },

        ErrorMessages: {
            UserNotExist: "User doesn't exist",
            UserOrEmailAreWrong: "Username or email are wrong",
            UnhandledError: "Something went wrong :(",
            UserOrPasswordAreWrong: "Username or password are wrong",
            UsernameExist: "Username already exists"
        }
    });
}())