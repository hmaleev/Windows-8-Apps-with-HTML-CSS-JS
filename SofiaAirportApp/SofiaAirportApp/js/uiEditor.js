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
                this.shadow.style.backgroundColor = "#fff";
                this.shadow.style.opacity = 1;

                this.progressBar.className = "win-ring";
                this.progressBar.style.width = "12%";
                this.progressBar.style.height = "12%";
                this.progressBar.style.color = "#0093DD";
                this.progressBar.style.position = "absolute";
                this.progressBar.style.left = "44%";
                this.progressBar.style.top = "44%";

                this.body.appendChild(this.shadow);
                this.body.appendChild(this.progressBar);
            },

            Hide: function () {
                this.progressBar.style.display = "none";
                this.shadow.style.display = "none";
            }
        })
    });
}())