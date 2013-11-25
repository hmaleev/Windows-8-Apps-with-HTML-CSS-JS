(function () {
    WinJS.Namespace.define("UI", {
        ProgressBar: WinJS.Class.define(function (body) {
            this.body = body;
            this.shadow = document.createElement("div");
            this.progressBar = document.createElement("progress");
        }, {
            Show: function () {
                this.shadow.style.position = "absolute";
                this.shadow.style.height = "100%";
                this.shadow.style.width = "100%";
                this.shadow.style.top = 0;
                this.shadow.style.backgroundColor = "black";
                this.shadow.style.opacity = 0.5;

                this.progressBar.className = "win-ring";
                this.progressBar.style.width = "12%";
                this.progressBar.style.height = "12%";
                this.progressBar.style.color = "red";
                this.progressBar.style.position = "absolute";
                this.progressBar.style.left = "44%";
                this.progressBar.style.top = "44%";

                this.body.appendChild(this.shadow);
                this.body.appendChild(this.progressBar);
            },

            Hide: function () {
                this.body.removeChild(this.shadow);
                this.body.removeChild(this.progressBar);
            }
        }),

        ChageBorderColor: function (args, color) {
            for (var i in args) {
                args[i].style.borderColor = color;
            }
        }
    });
}())