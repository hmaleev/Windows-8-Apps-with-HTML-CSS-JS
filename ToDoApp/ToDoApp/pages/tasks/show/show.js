/// <reference path="../../../js/YeahToast.js" />
/// <reference path="../../../js/scripts/popUpMessage.js" />
/// <reference path="../../../js/scripts/uiEditor.js" />
/// <reference path="../../../js/scripts/httpRequester.js" />
/// <reference path="//Microsoft.WinJS.1.0/js/ui.js" />
/// <reference path="//Microsoft.WinJS.1.0/js/base.js" />
// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    var applicationData = Windows.Storage.ApplicationData.current;
    var localSettings = applicationData.localSettings;

    WinJS.UI.Pages.define("/pages/tasks/show/show.html", {
            
        ready: function (element, options) {
            var appBar = document.getElementById("appbar").winControl;
            appBar.disabled = false;

            if (DataPersister.userData.data == undefined || DataPersister.userData.data == '') {
                appBar.show();
            }
            var localStorage = window.localStorage;

            var lView = element.querySelector("#tasks").winControl;
            lView.addEventListener("selectionchanged", this.selectionChanged);

            var addButton = document.getElementById("add");
            var editButton = document.getElementById("edit");
            var uploadTasksButton = document.getElementById("sync");
            var downloadTasksButton = document.getElementById("download");

            var deleteButton = document.getElementById("delete").winControl;
            var finishButton = document.getElementById("finish").winControl;
            var logoutButton = document.getElementById("logout").winControl;
            var selectedTasks = null;

            var localTasks = JSON.parse(localStorage.getItem(DataPersister.userData.username));
            var taskData = [];

            if (localTasks !== null) {
                for (var i = 0; i < localTasks.length; i++) {
                    taskData[i] = localTasks[i]._backingData;
                }
                DataPersister.userData.data = taskData;
                var list = document.getElementById("tasks").winControl;
                list.itemDataSource = new WinJS.Binding.List(DataPersister.userData.data).dataSource;
            }
            else {
                DataPersister.userData.data = null;
            }

            addButton.addEventListener("click", function () {
                WinJS.Navigation.navigate("pages/tasks/create/create.html");
            });

            //tasksList.addEventListener("contextmenu", function () {
            //    var triger = this.winControl;
            //    selectedTasks = new Array();
            //    triger.selection.getItems().then(function (items) {
            //        if (items.length>0) {
            //            for (var i in items) {
            //                selectedTasks.push(items[i].index);
            //            }
            //        }
                   
            //    });
            //});


            deleteButton.addEventListener("click", function () {
                if (lView.selection._listView !== null) {
                    selectedTasks = lView.selection.getIndices();
                }
                else {
                    return;
                }
                if (selectedTasks.length == 0) {
                    Message.Show("No task(s) selected");
                }

                if (selectedTasks!==null && selectedTasks.length>=0) {
                    for (var i = selectedTasks.length - 1; i >= 0 ; i--) {
                        DataPersister.userData.data.splice(selectedTasks[i], 1);
                    }
                    selectedTasks = new Array();
                    localStorage.setItem("deleteTasks", "true");
                    DataPersister.update();
                    localStorage.removeItem("deleteTasks");
                    WinJS.Navigation.navigate("/pages/tasks/show/show.html");
                    DataPersister.userData.hasChanges = true;
                    selectedTasks = null;
                }
            });

            editButton.addEventListener("click", function () {
                if (lView.selection._listView!==null) {
                    selectedTasks = lView.selection.getIndices();
                }
                else {
                    return;
                }
                
                if (selectedTasks!==null && selectedTasks.length == 1) {
                    var taskToEdit = selectedTasks[0];
                    WinJS.Navigation.navigate("/pages/tasks/update/update.html", taskToEdit);
                }
                else if (selectedTasks === null ||selectedTasks.length==0 ) {
                    Message.Show("No task selected");
                } else {
                    Message.Show("Please select only one task");
                }
            });

            finishButton.addEventListener("click", function () {
                if (lView.selection._listView !== null) {
                    selectedTasks = lView.selection.getIndices();
                }
                else {
                    return;
                }
                if (selectedTasks.length == 0) {
                    Message.Show("No task(s) selected");
                }
                DataPersister.finishTasks(selectedTasks);
                DataPersister.userData.hasChanges = true;
                DataPersister.update();
                WinJS.Navigation.navigate("/pages/tasks/show/show.html");
                selectedTasks = null;
            });

            uploadTasksButton.addEventListener("click", function () {
                if (!DataPersister.userData.hasChanges) {
                    return;
                }

                var progressBar = new UI.ProgressBar(document.body);
                progressBar.Show();

                Request.UserSync(DataPersister.userData.sessionKey, JSON.stringify(DataPersister.userData.data)).then(function (request) {

                    progressBar.Hide();
                    if (DataPersister.userData.hasChanges) {
                        YeahToast.show({ title: "Sync done" });
                    }
                    DataPersister.userData.hasChanges = false;

                }, function (error) {
                    progressBar.Hide();
                    Message.Show("false");
                });
            });

            downloadTasksButton.addEventListener("click", function () {

                var userData = JSON.parse(localStorage.getItem("remember"));
                if (userData == null) {
                    userData = {};
                    userData.username = DataPersister.userData.username;
                    userData.password = DataPersister.userData.password;
                }
                Request.UserDownloadTasks(userData.username, userData.password).then(function (request) {

                    var response = JSON.parse(request.response);
                    if (response.data != "" && response.data !== undefined) {
                        DataPersister.userData.data = JSON.parse(response.data);
                        DataPersister.userData.username = userData.username;
                        DataPersister.userData.sessionKey = response.sessionKey;
                        DataPersister.update();
                    }
                   
                    WinJS.Navigation.navigate("pages/tasks/show/show.html");

                }, function (error) {
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

            logoutButton.addEventListener("click", function () {
                var progressBar = new UI.ProgressBar(document.body);
                progressBar.Show();

                Request.UserLogOut(DataPersister.userData.sessionKey).then(function (request) {
                    progressBar.Hide();
                    DataPersister.userData.remember = false;
                    localSettings.values["user"] = undefined;
                    localStorage.removeItem("remember");
                    WinJS.Navigation.navigate("pages/menu/login/login.html");

                }, function (request) {
                    progressBar.Hide();
                });
            });
        }
    });
})();
