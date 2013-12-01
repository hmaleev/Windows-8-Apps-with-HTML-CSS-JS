/// <reference path="../../../js/YeahToast.js" />
/// <reference path="../../../js/scripts/popUpMessage.js" />
/// <reference path="../../../js/scripts/uiEditor.js" />
/// <reference path="../../../js/scripts/httpRequester.js" />
/// <reference path="//Microsoft.WinJS.2.0/js/ui.js" />
/// <reference path="//Microsoft.WinJS.2.0/js/base.js" />
(function () {
    "use strict";

    var applicationData = Windows.Storage.ApplicationData.current;
    var localSettings = applicationData.localSettings;

    WinJS.UI.Pages.define("/pages/tasks/show/show.html", {

        ready: function (element, options) {
            var appBar = document.getElementById("appbar").winControl;
            appBar.disabled = false;
            //window.addEventListener("resize", function () {
            //    var viewStates = Windows.UI.ViewManagement.ApplicationViewState;
            //    var ViewState = Windows.UI.ViewManagement.ApplicationView.value;
            //    if (ViewState === viewStates.snapped) {
            //        appBar.disabled = true;
            //    } else {
            //        appBar.disabled = false;
            //    }
            //});

            if (DataPersister.userData.data == undefined || DataPersister.userData.data == '') {
                appBar.show();
            }
            var localStorage = window.localStorage;

            var lView = element.querySelector("#tasks").winControl;
            var snappedListView = element.querySelector("#tasksSnapped").winControl;
            lView.addEventListener("selectionchanged", this.selectionChanged);
            snappedListView.addEventListener("selectionchanged", this.selectionChanged);

            var Buttons = function () {
                this.add = document.getElementById("add");
                this.edit = document.getElementById("edit");
                this.save = document.getElementById("save");
                this.uploadTasks = document.getElementById("sync");
                this.downloadTasks = document.getElementById("download");
                this.delete = document.getElementById("delete");
                this.finish = document.getElementById("finish");
                this.logout = document.getElementById("logout");
                this.calendar = document.getElementById("calendar");
            }
            var button = new Buttons();

            var selectedTasks = null;
            var localTasks = JSON.parse(localStorage.getItem(DataPersister.userData.username));
            var taskData = [];
            if (DataPersister.userData.username === "anonymous") {
                button.uploadTasks.disabled = true;
                button.downloadTasks.disabled = true;
            }
            else {
                button.uploadTasks.disabled = false;
                button.downloadTasks.disabled = false;
            }

            if (localTasks !== null) {
                for (var i = 0; i < localTasks.length; i++) {
                    taskData[i] = localTasks[i]._backingData;
                }
                DataPersister.userData.data = taskData;
                var list = document.getElementById("tasks").winControl;
                list.itemDataSource = new WinJS.Binding.List(DataPersister.userData.data).dataSource;
                var snappedList = document.getElementById("tasksSnapped").winControl;
                snappedList.itemDataSource = new WinJS.Binding.List(DataPersister.userData.data).dataSource;
            }
            else {
                DataPersister.userData.data = null;
            }

            button.add.addEventListener("click", function () {
                WinJS.Navigation.navigate("pages/tasks/create/create.html");
            });

            button.delete.addEventListener("click", function () {
                if (lView.selection._listView !== null) {
                    selectedTasks = lView.selection.getIndices();
                }
                else if (snappedListView.selection._listView !== null) {
                    selectedTasks = snappedListView.selection.getIndices();
                }
                else {
                    return;
                }
                if (selectedTasks.length == 0) {
                    Message.Show("No task(s) selected");
                }

                if (selectedTasks !== null && selectedTasks.length >= 0) {
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

            button.edit.addEventListener("click", function () {
                if (lView.selection._listView !== null) {
                    selectedTasks = lView.selection.getIndices();
                }
                else if (snappedListView.selection._listView !== null) {
                    selectedTasks = snappedListView.selection.getIndices();
                }
                else {
                    return;
                }

                if (selectedTasks !== null && selectedTasks.length == 1) {
                    var taskToEdit = selectedTasks[0];
                    WinJS.Navigation.navigate("/pages/tasks/update/update.html", taskToEdit);
                }
                else if (selectedTasks === null || selectedTasks.length == 0) {
                    Message.Show("No task selected");
                } else {
                    Message.Show("Please select only one task");
                }
            });

            button.finish.addEventListener("click", function () {
                if (lView.selection._listView !== null) {
                    selectedTasks = lView.selection.getIndices();
                }
                else if (snappedListView.selection._listView !== null) {
                    selectedTasks = snappedListView.selection.getIndices();
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

            button.uploadTasks.addEventListener("click", function () {
                if (!DataPersister.userData.hasChanges) {
                    return;
                }

                var progressBar = new UI.ProgressBar(document.body);
                progressBar.Show();

                Request.UserSync(DataPersister.userData.sessionKey, JSON.stringify(DataPersister.userData.data)).then(function (request) {

                    progressBar.Hide();
                    if (DataPersister.userData.hasChanges) {
                        YeahToast.show({ title: "Upload finished." });
                    }
                    DataPersister.userData.hasChanges = false;

                }, function (error) {
                    progressBar.Hide();
                    Message.Show("false");
                });
            });

            button.downloadTasks.addEventListener("click", function () {

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

            button.logout.addEventListener("click", function () {
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

            button.save.addEventListener("click", function () {

                var savePicker = new Windows.Storage.Pickers.FileSavePicker();
                savePicker.suggestedStartLocation = Windows.Storage.Pickers.PickerLocationId.documentsLibrary;
                savePicker.fileTypeChoices.insert("Plain Text", [".txt"]);
                savePicker.suggestedFileName = "New Document";

                savePicker.pickSaveFileAsync().then(function (file) {
                    if (file) {

                        var fileContent = "";
                        for (var i = 0; i < DataPersister.userData.data.length; i++) {
                            var title = DataPersister.userData.data[i].title;
                            var content = DataPersister.userData.data[i].content;
                            var endDate = DataPersister.userData.data[i].finishDate;
                            var status = DataPersister.userData.data[i].status;
                            if (status==="images/done.png") {
                                status = "Done";
                            }
                            else {
                                status = "Unfinished";
                            }
                            fileContent += "--------------------" + "\r\n" + "Title: " + title + "\r\n" + "Content: " + content + "\r\n" + "End date: " + endDate + "\r\n" +"Status: " + status+ "\r\n"+  "--------------------" + "\r\n" + "\r\n";
                        }
                        // Prevent updates to the remote version of the file until we finish making changes and call CompleteUpdatesAsync.
                        Windows.Storage.CachedFileManager.deferUpdates(file);
                        Windows.Storage.FileIO.writeTextAsync(file, fileContent).done(function () {

                            Windows.Storage.CachedFileManager.completeUpdatesAsync(file).done(function (updateStatus) {
                                if (updateStatus === Windows.Storage.Provider.FileUpdateStatus.complete) {
                                    YeahToast.show({ title: "File was saved successfully." });
                                } else {
                                    YeahToast.show({ title: "File was not saved." });
                                }
                            });
                        });
                    } else {
                        YeahToast.show({ title: "Operation canceled." });
                    }
                });
            });

            button.calendar.addEventListener("click", function () {
                var appointment = new Windows.ApplicationModel.Appointments.Appointment();
               
                if (lView.selection._listView !== null) {
                    selectedTasks = lView.selection.getIndices();
                }
                else if (snappedListView.selection._listView !== null) {
                    selectedTasks = snappedListView.selection.getIndices();
                }
                else {
                    return;
                }
                if (selectedTasks.length == 0) {
                    Message.Show("No task selected");
                    return;
                }
                var endDate = DataPersister.userData.data[selectedTasks[0]].finishDate.toString();
                endDate = endDate.substr(0, 15)+" "+endDate.substr(17,2)+":"+endDate.substr(22,2);

                //var duration = Date.parse(endDate)- Date.now();

                if (selectedTasks !== null && selectedTasks.length == 1) {
                    appointment.subject = DataPersister.userData.data[selectedTasks[0]].title;
                    appointment.details = DataPersister.userData.data[selectedTasks[0]].content;
                    appointment.duration = Date.parse(endDate) - Date.now();
                    if (appointment.duration<0) {
                        appointment.duration = 0;
                    }
                    
                }
                if (selectedTasks.length > 1) {
                    Message.Show("You must select only one task");
                    return;
                }

                // Get the selection rect of the button pressed to add this appointment 
                var selectionRect = { x: 1000, y: 810, width: 200, height: 200 };

                // ShowAddAppointmentAsync returns an appointment id if the appointment given was added to the user's calendar. 
                // This value should be stored in app data and roamed so that the appointment can be replaced or removed in the future. 
                // An empty string return value indicates that the user canceled the operation before the appointment was added. 
                Windows.ApplicationModel.Appointments.AppointmentManager.showAddAppointmentAsync(appointment, selectionRect, Windows.UI.Popups.Placement.default)
                    .done(function (appointmentId) {
                        if (appointmentId) {
                            YeahToast.show({title:"Appointment added"})
                        }
                    });
            });
        }
    });
})();