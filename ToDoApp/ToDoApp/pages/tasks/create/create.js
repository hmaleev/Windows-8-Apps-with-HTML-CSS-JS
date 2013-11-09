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

            var finishDateInput = document.getElementById("finishDate");
            var finishTimeInput = document.getElementById("finishHour");

            var finishDateControl = finishDateInput.winControl;
            var finishTimeControl = finishTimeInput.winControl;

            var createTaskButton = document.getElementById("create-task-button");
            var backButton = document.getElementById("back-button");

            createTaskButton.addEventListener("click", function () {

                UI.ChageBorderColor([titleInput, contentInput], Const.InputDefaultFieldColor);

                var progressBar = new UI.ProgressBar(document.body);
                progressBar.Show();

                var title = titleInput.value;
                var content = contentInput.value;
                var finishDate = finishDateControl.current;
                var finishTime = finishTimeControl.current;
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

                DataPersister.createNewTask(title, content, finishDate);
                DataPersister.update();
                progressBar.Hide();
                
                titleInput.value = "";
                contentInput.value = "";

                var currentDate = new Date().toDateString();
                var currentTime = new Date().toLocaleTimeString();

                finishDateControl.current = currentDate;
                finishTimeControl.current = currentTime;

                YeahToast.show({ title: "Task Created" });
            });

            backButton.addEventListener("click", function () {
                WinJS.Navigation.navigate("pages/tasks/show/show.html");
            });
        }
    });
})();
