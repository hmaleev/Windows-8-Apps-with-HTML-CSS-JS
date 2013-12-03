/// <reference path="../../../js/scripts/dataCheck.js" />
/// <reference path="../../../js/scripts/uiEditor.js" />
/// <reference path="../../../js/scripts/dataPersister.js" />
/// <reference path="../../../js/YeahToast.js" />
/// <reference path="../../../js/scripts/popUpMessage.js" />
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/tasks/update/update.html", {
        ready: function (element, options) {
            var data = DataPersister.userData.data[options];
            var appBar = document.getElementById("appbar").winControl
            appBar.disabled = true;

            var titleInput = document.getElementById("title");
            var contentInput = document.getElementById("taskContent");
            var finishDateControl = document.getElementById("finishDate").winControl;
            var finishTimeControl = document.getElementById("finishHour").winControl;

            finishTimeControl.clock = "24HourClock";

            var backButton = document.getElementById("back-button");
            titleInput.value = data.title;
            contentInput.value = data.content;

            finishDateControl.current = new Date();
            finishTimeControl.current = new Date();
            var updateButton = document.getElementById("update-task-button");
            updateButton.addEventListener("click", function () {
                UI.ChageBorderColor([titleInput, contentInput], Const.InputDefaultFieldColor);

                var progressBar = new UI.ProgressBar(document.body);
                progressBar.Show();

                var title = titleInput.value;
                var content = contentInput.value;
                var finishDate = finishDateControl.current.toDateString();
                var finishTime = finishTimeControl.current.toLocaleTimeString();
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

                DataPersister.userData.data[options].title = title;
                DataPersister.userData.data[options].content = content;
                DataPersister.userData.data[options].finishDate = Check.CreateDate(finishDate, finishTime);

                DataPersister.userData.hasChanges = true;
                DataPersister.update();
                progressBar.Hide();
                YeahToast.show({title: "Task Updated"});
            });

            backButton.addEventListener("click", function () {
                WinJS.Navigation.navigate("/pages/tasks/show/show.html");
            });
        }
    })
})();