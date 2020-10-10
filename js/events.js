update_profile_data_ids = [
    "lastname", "lastname_distance",
    "firstname", "firstname_distance",
    "middlename", "middlename_distance",
    "disable_mix", "is_title",
    "streetname", "streetname_distance",
    "house", "house_distance",
    "apartment", "apartment_distance",
    "disable_apartment", "is_title_street",
];

for (id of update_profile_data_ids)
    document.getElementById(id).onchange = function() {update_profile_data()};

document.getElementById("generate").onclick = function() {generate_name()};
document.getElementById("generate_mini").onclick = function() {generate_mini()};

document.getElementById("profile").onchange = function() {load_profile()};
document.getElementById("profile_name").onchange = function() {update_profile_data()};
document.getElementById("delete_profile").onclick = function() {delete_profile()};

document.getElementById("settings").onchange = function() {load_settings()};
document.getElementById("setting_name").onchange = function() {update_setting_data()};
document.getElementById("delete_setting").onclick = function() {delete_setting()};

document.getElementById("output_format").onchange = function() {update_setting_data()};

document.getElementById("value_mini").value = "";

document.getElementById("street_prefixes").onchange = function() {update_setting_data()};
document.getElementById("house_prefixes").onchange = function() {update_setting_data()};
document.getElementById("apartment_prefixes").onchange = function() {update_setting_data()};
document.getElementById("separators").onchange = function() {update_setting_data()};

for(let letter = 0; letter < letters.length; letter++)
    document.getElementById("let_"+(letter < 33 ? 'ru' : 'en')+"_"+(letter < 33 ? (letter+1) : (letter-32))).onchange = function() {update_setting_data()};

document.getElementById("workspace_save").onclick = function() {workspace_save();}
document.getElementById("workspace_open").onclick = function() {workspace_open_window();}

document.getElementById("setting_save").onclick = function() {setting_save();}
document.getElementById("setting_open").onclick = function() {setting_open_window();}

$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})

document.body.onload = function() {changelog()};

function changelog() {
    changelog_showed = {};

    // если в хранилище нет записей о версиях, то создаем первую
    if (localStorage.getItem("changelog_showed") == undefined)
        localStorage.setItem("changelog_showed", JSON.stringify(changelog_showed));
    else
        changelog_showed = JSON.parse(localStorage.getItem("changelog_showed"));

    if (!changelog_showed[version] || changelog_showed[version] == undefined) {
        document.getElementById("navbar-brand").click();

        changelog_showed[version] = true;
        localStorage.setItem("changelog_showed", JSON.stringify(changelog_showed));
    }
}