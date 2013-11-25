/// <reference path="scripts/httpRequester.js" />
/// <reference path="scripts/uiEditor.js" />
/// <reference path="scripts/dataPersister.js" />
// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232509
(function () {
    "use strict";

    WinJS.Binding.optimizeBindingReferences = true;

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;
    var nav = WinJS.Navigation;
    var applicationData = Windows.Storage.ApplicationData.current;

    var localSettings = applicationData.localSettings;

    app.onactivated = function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                // TODO: This application has been newly launched. Initialize
                // your application here.

                //Start of navigation code:

                if (app.sessionState.history) {
                    nav.history = app.sessionState.history;
                }
                args.setPromise(WinJS.UI.processAll().then(function () {
                    if (nav.location) {
                        nav.history.current.initialPlaceholder = true;
                        return nav.navigate(nav.location, nav.state);
                    } else {
                        return nav.navigate(Application.navigator.home);
                    }
                }));
                //End of navigation code


            } else {
                // TODO: This application has been reactivated from suspension.
                // Restore application state here.
            }

            

                args.setPromise(WinJS.UI.processAll());
            
        }
    };

    app.onsettings = function (e) {
        e.detail.applicationcommands = {
            "PrivacyPolicy": { title: "Privacy Policy", href: "/pages/settings/privacyPolicy.html" }
        };
        WinJS.UI.SettingsFlyout.populateSettings(e);
    };

    app.oncheckpoint = function (args) {
        if (DataPersister.userData.remember) {
            localSettings.values["user"] = DataPersister.userData.sessionKey;
        }
        else {
            localSettings.values["user"] = undefined;
        }
    };

    app.start();
})();
