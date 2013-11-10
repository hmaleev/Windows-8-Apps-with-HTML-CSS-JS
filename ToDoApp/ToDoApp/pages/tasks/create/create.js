/// <reference path="../../../js/scripts/const.js" />
/// <reference path="../../../js/scripts/dataPersister.js" />
/// <reference path="../../../js/YeahToast.js" />
/// <reference path="../../../js/scripts/uiEditor.js" />
// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/tasks/create/create.html", {

        ready: function (element, options) {
            
            var appBar = document.getElementById("appbar").winControl;
            appBar.disabled = true;

            var titleInput = document.getElementById("title");
            var contentInput = document.getElementById("content");
            var createTaskButton = document.getElementById("create-task-button");
            var backButton = document.getElementById("back-button");

            var finishDateControl = document.getElementById("finishDate").winControl;
            var finishTimeControl = document.getElementById("finishHour").winControl;
            finishTimeControl.clock = "24HourClock";



            createTaskButton.addEventListener("click", function () {
                UI.ChageBorderColor([titleInput, contentInput], Const.InputDefaultFieldColor);
                var progressBar = new UI.ProgressBar(document.body);
                progressBar.Show();

                var currentDate = finishDateControl.current.toDateString();
                var currentTime = finishTimeControl.current.toLocaleTimeString();

                var title = titleInput.value;
                var content = contentInput.value;
                var endDate = currentDate + " " + currentTime;
                var message = "";
                var wrongInputs = new Array();

                var checkTitle = Check.TaskTitle(title);
                if (checkTitle != "") {
                    message += checkTitle;
                    wrongInputs.push(titleInput);
                }

                if (message != "") {
                    progressBar.Hide();
                    Message.Show(message);
                    UI.ChageBorderColor(wrongInputs, Const.InputWrongFieldColor);
                    return;
                }

                DataPersister.createNewTask(title, content, endDate);
                DataPersister.update();
                progressBar.Hide();
                titleInput.value = "";
                contentInput.value = "";
                YeahToast.show({ title: "Task Created" });
            });

            backButton.addEventListener("click", function () {
                WinJS.Navigation.navigate("pages/tasks/show/show.html");
            });
        }
    });
})();