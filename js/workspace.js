function workspace_open_window() {
    input = document.createElement("input");
    input.type = "file";
    input.id = "workspace_window";
    input.style.display = "none";
    input.setAttribute("onchange", "workspace_open(this);");
    document.body.appendChild(input);
    document.getElementById("workspace_window").click();
    document.body.removeChild(input);
}

function workspace_open() {
    let file = input.files[0];
    let reader = new FileReader();
    reader.readAsText(file);
    
    reader.onload = function() {
        res = reader.result;
        res = JSON.parse(res);

        if (!res.profiles || !res.settings) {
            workspace_alert("danger", "В файле отсутствуют необходимые данные");
            return 0;
        }
        localStorage.setItem("profiles", JSON.stringify(res.profiles));
        localStorage.setItem("settings", JSON.stringify(res.settings));

        update_profile_selector(); load_profile();
        update_settings_selector(); load_settings();
        workspace_alert("success", "Рабочее пространство успешно загружено");
    };

    reader.onerror = function() {
        workspace_alert("danger", "При открытии файла произошла ошибка");
    };
}

function workspace_save() {
    value = {};
    value["profiles"] = JSON.parse(localStorage.getItem("profiles"));
    value["settings"] = JSON.parse(localStorage.getItem("settings"));

    result = JSON.stringify(value, null, 4);
    
    download = document.createElement("a");
    download.href = "data:text/plain;content-disposition=attachment;filename=file," + result;
    download.download = "workspace.json";
    download.style.display = "none";
    download.id = "download"; 
    document.body.appendChild(download);
    document.getElementById("download").click();
    document.body.removeChild(download);
}

function workspace_alert(status, text) {
    html = "<div class=\"alert alert-" + status + " mb-2 text-center\" role=\"alert\">";
    html += text;
    html += "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">";
    html += "<span aria-hidden=\"true\">×</span></button></div>";                     
    document.getElementById("workspace_alert").innerHTML = html;
}