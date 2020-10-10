default_profile = {
    "id": 1,
    "name": "Новый профиль",
    "lastname": "",
    "firstname": "",
    "middlename": "",
    "lastname_distance": "2",
    "firstname_distance": "2",
    "middlename_distance": "2",
    "disable_mix": false,
    "is_title": false,
    "streetname": "",
    "house": "",
    "apartment": "",
    "streetname_distance": "2",
    "house_distance": "1",
    "apartment_distance": "1",
    "disable_apartment": false,
    "is_title_street": false
}

function update_profile_selector() {
    // --- обновляем список профилей в селекторе --- 
    selector = document.getElementById('profile');

    // если в хранилище нет профилей, то создаем дефолтный первый профиль
    if (localStorage.getItem("profiles") == undefined) {
        profiles = {"data": [], "current": 1};
        new_profile = JSON.parse(JSON.stringify(default_profile));
        new_profile.name = "Пушкин А.С";
        new_profile.lastname = "Пушкин";
        new_profile.firstname = "Александр";
        new_profile.middlename = "Сергеевич";
        new_profile.streetname = "Пушкина";
        new_profile.house = "12, корп. 2";
        new_profile.apartment = "32";
        profiles.data.push(new_profile);
        localStorage.setItem("profiles", JSON.stringify(profiles));
    } else {
        profiles = JSON.parse(localStorage.getItem("profiles"));
    }

    // добавляем опции к селектору
    selector.textContent = '';
    for (profile of profiles.data) {
        option = document.createElement("option");
        option.text = profile.name;
        option.value = profile.id;
        selector.add(option);
    }
    option = document.createElement("option");
    option.text = "Добавить профиль";
    option.value = 'add';
    selector.add(option);

    // устанавливаем последний выбранный профиль
    selector.value = profiles.current;
}

function load_profile() {
    // При изменении активного профиля
    // убираем подсказки и очищаем результаты
    disable_validation();
    document.getElementById("alert").innerHTML = "";
    document.getElementById("result").value = "";


    selector = document.getElementById('profile');
    profile_id = selector[selector.selectedIndex].value;

    profiles = JSON.parse(localStorage.getItem("profiles"));

    if (profile_id == "add") {
        next_id = profiles.data[profiles.data.length - 1].id + 1;
        new_profile = JSON.parse(JSON.stringify(default_profile));
        new_profile.id = next_id;
        new_profile.name = get_profile_name();
        profiles.data.push(new_profile);
        profiles.current = next_id;
        localStorage.setItem("profiles", JSON.stringify(profiles));
        profile_id = next_id;
        update_profile_selector();
    }

    for (profile of profiles.data) {
        if (profile.id == profile_id) {
            document.getElementById("profile_name").value = profile.name;
            document.getElementById("lastname").value = profile.lastname;
            document.getElementById("firstname").value = profile.firstname;
            document.getElementById("middlename").value = profile.middlename;
            document.getElementById("lastname_distance").value = profile.lastname_distance;
            document.getElementById("firstname_distance").value = profile.firstname_distance;
            document.getElementById("middlename_distance").value = profile.middlename_distance;
            // document.getElementById("disable_middlename").checked = profile.disable_middlename ;
            document.getElementById("disable_mix").checked = profile.disable_mix;
            document.getElementById("is_title").checked = profile.is_title;
            document.getElementById("streetname").value = profile.streetname;
            document.getElementById("house").value = profile.house;
            document.getElementById("apartment").value = profile.apartment;
            document.getElementById("streetname_distance").value = profile.streetname_distance;
            document.getElementById("house_distance").value = profile.house_distance;
            document.getElementById("apartment_distance").value = profile.apartment_distance;
            document.getElementById("disable_apartment").checked = profile.disable_apartment;
            document.getElementById("is_title_street").checked = profile.is_title_street;
            // document.getElementById("disable_separators").checked = profile.disable_separators;

            // записываем последний выбранный профиль
            profiles.current = profile_id;
            localStorage.setItem("profiles", JSON.stringify(profiles));
        }
    }
    
}

function delete_profile() {
    selector = document.getElementById('profile');
    profile_id = selector[selector.selectedIndex].value;

    profiles = JSON.parse(localStorage.getItem("profiles"));

    if (profiles.data.length == 1) {
        alert("Нельзя удалить последний профиль");
        return false;
    }

    profile_index = 0;
    for (profile in profiles.data)
        if (profiles.data[profile].id == profile_id)
            profile_index = profile;

    // находим профиль, который будет отображаться после удаления
    if (profile_index == 0)
        next_index = 1;
    else
        next_index = profile_index - 1;
    profiles.current = profiles.data[next_index].id;

    profiles.data.splice(profile_index, 1);
    localStorage.setItem("profiles", JSON.stringify(profiles));
    
    update_profile_selector();
    load_profile();
}

function update_profile_data() {
    name = document.getElementById("profile_name").value;

    selector = document.getElementById('profile');
    profile_id = selector[selector.selectedIndex].value;

    profiles = JSON.parse(localStorage.getItem("profiles"));

    for (profile of profiles.data)
        if (profile.id == profile_id) {
            profile.name = document.getElementById("profile_name").value;
            profile.lastname = document.getElementById("lastname").value;
            profile.firstname = document.getElementById("firstname").value;
            profile.middlename = document.getElementById("middlename").value;
            profile.lastname_distance = document.getElementById("lastname_distance").value;
            profile.firstname_distance = document.getElementById("firstname_distance").value;
            profile.middlename_distance = document.getElementById("middlename_distance").value;
            profile.disable_mix = document.getElementById("disable_mix").checked;
            profile.is_title = document.getElementById("is_title").checked;
            profile.streetname = document.getElementById("streetname").value;
            profile.house = document.getElementById("house").value;
            profile.apartment = document.getElementById("apartment").value;
            profile.streetname_distance = document.getElementById("streetname_distance").value;
            profile.house_distance = document.getElementById("house_distance").value;
            profile.apartment_distance = document.getElementById("apartment_distance").value;
            profile.disable_apartment = document.getElementById("disable_apartment").checked;
            profile.is_title_street = document.getElementById("is_title_street").checked;
        }

    localStorage.setItem("profiles", JSON.stringify(profiles));
    update_profile_selector();
}


function get_profile_name() {
    profiles = JSON.parse(localStorage.getItem("profiles"));

    function find_name(name) {
        for (profile of profiles.data)
            if (profile.name == name)
                return true;
        return false;
    }

    if (find_name("Новый профиль")) {
        count = 2;
        while (find_name("Новый профиль (" + count + ")"))
            count++;
        return "Новый профиль (" + count + ")";
    }
    return "Новый профиль";
}

update_profile_selector();
load_profile();