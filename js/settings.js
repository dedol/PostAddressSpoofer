default_settings = {
    "id": 1,
    "name": "Новый профиль",
    "street_prefixes": ["ul", "street", "yl", "st", "ulitca"],
    "house_prefixes": ["dom", "house", "d", ""],
    "apartment_prefixes": ["kv", "k", "kvartira", ""],
    "separators": ["{comma}"],
    "output_format": '{person} | {address}',
    "alph":{"а":["a"],"б":["b","6"],"в":["v","w","vv","u"],"г":["g","j"],"д":["d"],"е":["e","ye"],"ё":["e","yo","jo"],"ж":["zh","j","z"],"з":["z","zz"],"и":["i","yi"],"й":["y","i","yi","j","jj","ii"],"к":["k","c"],"л":["l","I"],"м":["m","rn","nn"],"н":["n"],"о":["o","0"],"п":["p"],"р":["r"],"с":["s","$","5"],"т":["t"],"у":["u","y","yu"],"ф":["f","ph"],"х":["kh","x","h"],"ц":["ts","c","tc","cz","cc"],"ч":["ch","c"],"ш":["sh","s","h"],"щ":["shch","shh","sh","sc"],"ъ":["'",""],"ы":["y","i"],"ь":[""],"э":["eh","e"],"ю":["yu","u","ju","iu"],"я":["ya","ja","ia","a"],"a":["a"],"b":["b","6"],"c":["c","s","$","5"],"d":["d"],"e":["e","ye","je"],"f":["f","ph"],"g":["g","j"],"h":["h","kh","x"],"i":["i","yi","ii"],"j":["j","g","zh"],"k":["k","c"],"l":["l","I"],"m":["m","rn","nn"],"n":["n"],"o":["o","0"],"p":["p"],"q":["q","k","c"],"r":["r"],"s":["s","$","5"],"t":["t"],"u":["u","y","yu"],"v":["v","w","vv","u"],"w":["w","v","vv","u"],"x":["x","kh","h"],"y":["y","u","yu"],"z":["z","zz"]}
}

function parse_string(data) {
    // Convert string to array
    result = [];
    array = data.split(",");
    for (var i = 0; i < array.length; i++) {
        value = array[i].trim().substring(1, array[i].trim().length - 1);
        result.push(value);
    }
    return result;
}

function join_array(data) {
    // Convert array to string
    result = "";
    for (var i = 0; i < data.length; i++) {
        result += '"' + data[i] + '"';
        if (i != data.length - 1) result += ", ";
    }
    return result;
}

function update_settings_selector() {
    // --- обновляем список профилей в селекторе --- 
    selector = document.getElementById('settings');

    // если в хранилище нет профилей, то создаем дефолтный первый профиль
    if (localStorage.getItem("settings") == undefined) {
        settings = {"data": [], "current": 1};
        new_settings = JSON.parse(JSON.stringify(default_settings));
        new_settings.name = "По умолчанию";
        settings.data.push(new_settings);
        localStorage.setItem("settings", JSON.stringify(settings));
    } else {
        settings = JSON.parse(localStorage.getItem("settings"));
    }

    // добавляем опции к селектору
    selector.textContent = '';
    for (setting of settings.data) {
        option = document.createElement("option");
        option.text = setting.name;
        option.value = setting.id;
        selector.add(option);
    }
    option = document.createElement("option");
    option.text = "Добавить профиль";
    option.value = 'add';
    selector.add(option);

    // устанавливаем последний выбранный профиль
    selector.value = settings.current;
}

function load_settings() {
    selector = document.getElementById('settings');
    setting_id = selector[selector.selectedIndex].value;

    settings = JSON.parse(localStorage.getItem("settings"));

    if (setting_id == "add") {
        next_id = settings.data[settings.data.length - 1].id + 1;
        new_settings = JSON.parse(JSON.stringify(default_settings));
        new_settings.id = next_id;
        new_settings.name = get_setting_name();
        settings.data.push(new_settings);
        settings.current = next_id;
        localStorage.setItem("settings", JSON.stringify(settings));
        setting_id = next_id;
        update_settings_selector();
    }

    for (setting of settings.data) {
        if (setting.id == setting_id) {
            document.getElementById("setting_name").value = setting.name;
            document.getElementById("street_prefixes").value = join_array(setting.street_prefixes);
            document.getElementById("house_prefixes").value = join_array(setting.house_prefixes);
            document.getElementById("apartment_prefixes").value = join_array(setting.apartment_prefixes);
            document.getElementById("separators").value = join_array(setting.separators);
            document.getElementById("output_format").value = setting.output_format;
            
            for(let letter = 0; letter < letters.length; letter++){
                // document.getElementById("let_"+(letter < 33 ? 'ru' : 'en')+"_"+(letter < 33 ? (letter+1) : (letter-32))).value = setting.alph[letters[letter]];
                document.getElementById("let_"+(letter < 33 ? 'ru' : 'en')+"_"+(letter < 33 ? (letter+1) : (letter-32))).value = join_array(setting.alph[letters[letter]]);
            }

            // записываем последний выбранный профиль
            settings.current = setting_id;
            localStorage.setItem("settings", JSON.stringify(settings));
        }
    }
    
}

function delete_setting() {
    selector = document.getElementById('settings');
    setting_id = selector[selector.selectedIndex].value;

    settings = JSON.parse(localStorage.getItem("settings"));

    if (settings.data.length == 1) {
        alert("Нельзя удалить последний профиль");
        return false;
    }

    setting_index = 0;
    for (setting in settings.data)
        if (settings.data[setting].id == setting_id)
            setting_index = setting;

    // находим профиль, который будет отображаться после удаления
    if (setting_index == 0)
        next_index = 1;
    else
        next_index = setting_index - 1;
    settings.current = settings.data[next_index].id;

    settings.data.splice(setting_index, 1);
    localStorage.setItem("settings", JSON.stringify(settings));
    
    update_settings_selector();
    load_settings();
}

function update_setting_data() {
    name = document.getElementById("setting_name").value;

    selector = document.getElementById('settings');
    setting_id = selector[selector.selectedIndex].value;

    settings = JSON.parse(localStorage.getItem("settings"));

    for (setting of settings.data)
        if (setting.id == setting_id) {
            setting.name = document.getElementById("setting_name").value;
            setting.street_prefixes = parse_string(document.getElementById("street_prefixes").value);
            setting.house_prefixes = parse_string(document.getElementById("house_prefixes").value);
            setting.apartment_prefixes = parse_string(document.getElementById("apartment_prefixes").value);
            setting.separators = parse_string(document.getElementById("separators").value);
            setting.output_format = document.getElementById("output_format").value;

            for(let letter = 0; letter < letters.length; letter++){
                // document.getElementById("let_"+(letter < 33 ? 'ru' : 'en')+"_"+(letter < 33 ? (letter+1) : (letter-32))).value = join_array(setting.alph[letters[letter]]);

                setting.alph[letters[letter]] = parse_string(document.getElementById("let_"+(letter < 33 ? 'ru' : 'en')+"_"+(letter < 33 ? (letter+1) : (letter-32))).value);
            }

        }

    localStorage.setItem("settings", JSON.stringify(settings));
    update_settings_selector();
}

function get_setting_name() {
    settings = JSON.parse(localStorage.getItem("settings"));

    function find_name(name) {
        for (setting of settings.data)
            if (setting.name == name)
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

function setting_open_window() {
    input = document.createElement("input");
    input.type = "file";
    input.id = "setting_window";
    input.style.display = "none";
    input.setAttribute("onchange", "setting_open(this);");
    document.body.appendChild(input);
    document.getElementById("setting_window").click();
    document.body.removeChild(input);
}

function setting_open() {
    let file = input.files[0];
    let reader = new FileReader();
    reader.readAsText(file);

    reader.onload = function() {
        res = reader.result;
        res = JSON.parse(res);

        if (!res.name) res.name = "Без имени";
        if (!res.alph) res.alph = default_settings.alph;
        if (!res.output_format) res.output_format = default_settings.output_format;

        settings = JSON.parse(localStorage.getItem("settings"));
        res.id = settings.data[settings.data.length - 1].id + 1;
        settings.data.push(res);
        settings.current = res.id;
        localStorage.setItem("settings", JSON.stringify(settings));
        update_settings_selector(); load_settings();
        setting_alert('success', 'Профиль настроек успешно загружен')
    };

    reader.onerror = function() {
        setting_alert("danger", "При открытии файла произошла ошибка");
    };
}

function setting_save() {
    settings = JSON.parse(localStorage.getItem("settings"));
    current = settings.current;

    for (setting of settings.data) {
        if (settings.current == setting.id) {
            delete setting.id;
            result = JSON.stringify(setting, null, 4);

            download = document.createElement("a");
            download.href = "data:text/plain;content-disposition=attachment;filename=file," + result;
            download.download = "settings.json";
            download.style.display = "none";
            download.id = "download"; 
            document.body.appendChild(download);
            document.getElementById("download").click();
            document.body.removeChild(download);
            break;
        }
    }
}

function setting_alert(status, text) {
    html = "<div class=\"alert alert-" + status + " mb-2 text-center\" role=\"alert\">";
    html += text;
    html += "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">";
    html += "<span aria-hidden=\"true\">×</span></button></div>";                     
    document.getElementById("setting_alert").innerHTML = html;
}

update_settings_selector();
load_settings();