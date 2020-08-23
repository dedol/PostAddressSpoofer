var alph = {};
var street_prefixes = [];
var house_prefixes = [];
var apartment_prefixes = [];
var separators = [];

function shuffle(array) {
	var currentIndex = array.length, temporaryValue, randomIndex;
	while (0 !== currentIndex) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}
	return array;
}


function hamming_distance(word1, word2) {
	value = 0;
	if (word1.length != word2.length)
		return value;
	for (var i = 0; i < word1.length; i++)
		if (word1[i] != word2[i])
			value += 1;
	return value;
}


function hamming_filter_list(input_list, min_distance=2, max_count=100) {
	results = [];
	results.push(Object.assign([], input_list[0]));
	for (var i = 0; i < input_list.length; i++) {
		good_word = true;
		for (var j = 0; j < results.length; j++) {
			if (hamming_distance(results[j], input_list[i]) < min_distance) {
				good_word = false;
				break;
			}
		}
		if (good_word)
			results.push(Object.assign([], input_list[i]));
		if (results.length >= max_count)
			break;
	}
	return results;
}	


function replace_to_letters(array, mask) {
	word = Object.assign([], array);
	for (var i = 0; i < word.length; i++)
		word[i] = mask[i][word[i]];
	return word;
}


function generate(name, min_distance) {
	var mask = [];
	for (var i = 0; i < name.length; i++)
		if (name[i] in alph)
			mask.push(alph[name[i]]);
		else
			mask.push(name[i]);
	
	results = [];
	current = [];
	max_values = [];
	for (var i = 0; i < mask.length; i++) {
		current.push(0);
		max_values.push(mask[i].length - 1);
	}
	
	var variation_count = 1;
	for (var i = 0; i < mask.length; i++)
		variation_count *= mask[i].length;
	
	for (var i = 0; i < variation_count - 1; i++) {
		finish = false;
		letter = max_values.length;
		while (finish == false && letter >= 0) {
			letter -= 1;
			current[letter] += 1;
			if (current[letter] <= max_values[letter])
				finish = true;
			else
				current[letter] = 0;
		}
		results.push(replace_to_letters(current, mask));
	}

	results = shuffle(hamming_filter_list(results, min_distance));
	
	results_text = [];
	for (i = 0; i < results.length; i++)
		results_text[i] = results[i].join('');
	
	return results_text;
}


String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}


String.prototype.title = function() {
    return this.split(' ').map(function(word) {
    return (word.charAt(0).toUpperCase() + word.slice(1));
  }).join(' ');
}


String.prototype.replaceAll = function(str1, str2, ignore) {
    return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
}


function load_data(letter_id) {
	// String -> array
	letter = [];
	arr = document.getElementById(letter_id).value.split(",");
	for (var i = 0; i < arr.length; i++) {
		value = arr[i].trim().substring(1, arr[i].trim().length - 1);
		value = value.replaceAll("{comma}", ",");
		letter.push(value);
	}
	return letter;
}


function update_settings() {
	// Update values: form -> variables
	street_prefixes = load_data("street_prefixes");
	house_prefixes = load_data("house_prefixes");
	apartment_prefixes = load_data("apartment_prefixes");
	separators = load_data("separators");
	
	alph["а"] = load_data("let_ru_1");
	alph["б"] = load_data("let_ru_2");
	alph["в"] = load_data("let_ru_3");
	alph["г"] = load_data("let_ru_4");
	alph["д"] = load_data("let_ru_5");
	alph["е"] = load_data("let_ru_6");
	alph["ё"] = load_data("let_ru_7");
	alph["ж"] = load_data("let_ru_8");
	alph["з"] = load_data("let_ru_9");
	alph["и"] = load_data("let_ru_10");
	alph["й"] = load_data("let_ru_11");
	alph["к"] = load_data("let_ru_12");
	alph["л"] = load_data("let_ru_13");
	alph["м"] = load_data("let_ru_14");
	alph["н"] = load_data("let_ru_15");
	alph["о"] = load_data("let_ru_16");
	alph["п"] = load_data("let_ru_17");
	alph["р"] = load_data("let_ru_18");
	alph["с"] = load_data("let_ru_19");
	alph["т"] = load_data("let_ru_20");
	alph["у"] = load_data("let_ru_21");
	alph["ф"] = load_data("let_ru_22");
	alph["х"] = load_data("let_ru_23");
	alph["ц"] = load_data("let_ru_24");
	alph["ч"] = load_data("let_ru_25");
	alph["ш"] = load_data("let_ru_26");
	alph["щ"] = load_data("let_ru_27");
	alph["ъ"] = load_data("let_ru_28");
	alph["ы"] = load_data("let_ru_29");
	alph["ь"] = load_data("let_ru_30");
	alph["э"] = load_data("let_ru_31");
	alph["ю"] = load_data("let_ru_32");
	alph["я"] = load_data("let_ru_33");
	
	alph["a"] = load_data("let_en_1");
	alph["b"] = load_data("let_en_2");
	alph["c"] = load_data("let_en_3");
	alph["d"] = load_data("let_en_4");
	alph["e"] = load_data("let_en_5");
	alph["f"] = load_data("let_en_6");
	alph["g"] = load_data("let_en_7");
	alph["h"] = load_data("let_en_8");
	alph["i"] = load_data("let_en_9");
	alph["j"] = load_data("let_en_10");
	alph["k"] = load_data("let_en_11");
	alph["l"] = load_data("let_en_12");
	alph["m"] = load_data("let_en_13");
	alph["n"] = load_data("let_en_14");
	alph["o"] = load_data("let_en_15");
	alph["p"] = load_data("let_en_16");
	alph["q"] = load_data("let_en_17");
	alph["r"] = load_data("let_en_18");
	alph["s"] = load_data("let_en_19");
	alph["t"] = load_data("let_en_20");
	alph["u"] = load_data("let_en_21");
	alph["v"] = load_data("let_en_22");
	alph["w"] = load_data("let_en_23");
	alph["x"] = load_data("let_en_24");
	alph["y"] = load_data("let_en_25");
	alph["z"] = load_data("let_en_26");
}


function prepare_json(data) {
	for (var i = 0; i < data.length; i++)
		data[i] = data[i].replaceAll(",", "{comma}");
	return data;
}


function prepare_alph(data) {
	prepared = {}
	prepared["а"] = prepare_json(alph["а"]);
	prepared["б"] = prepare_json(alph["б"]);
	prepared["в"] = prepare_json(alph["в"]);
	prepared["г"] = prepare_json(alph["г"]);
	prepared["д"] = prepare_json(alph["д"]);
	prepared["е"] = prepare_json(alph["е"]);
	prepared["ё"] = prepare_json(alph["ё"]);
	prepared["ж"] = prepare_json(alph["ж"]);
	prepared["з"] = prepare_json(alph["з"]);
	prepared["и"] = prepare_json(alph["и"]);
	prepared["й"] = prepare_json(alph["й"]);
	prepared["к"] = prepare_json(alph["к"]);
	prepared["л"] = prepare_json(alph["л"]);
	prepared["м"] = prepare_json(alph["м"]);
	prepared["н"] = prepare_json(alph["н"]);
	prepared["о"] = prepare_json(alph["о"]);
	prepared["п"] = prepare_json(alph["п"]);
	prepared["р"] = prepare_json(alph["р"]);
	prepared["с"] = prepare_json(alph["с"]);
	prepared["т"] = prepare_json(alph["т"]);
	prepared["у"] = prepare_json(alph["у"]);
	prepared["ф"] = prepare_json(alph["ф"]);
	prepared["х"] = prepare_json(alph["х"]);
	prepared["ц"] = prepare_json(alph["ц"]);
	prepared["ч"] = prepare_json(alph["ч"]);
	prepared["ш"] = prepare_json(alph["ш"]);
	prepared["щ"] = prepare_json(alph["щ"]);
	prepared["ъ"] = prepare_json(alph["ъ"]);
	prepared["ы"] = prepare_json(alph["ы"]);
	prepared["ь"] = prepare_json(alph["ь"]);
	prepared["э"] = prepare_json(alph["э"]);
	prepared["ю"] = prepare_json(alph["ю"]);
	prepared["я"] = prepare_json(alph["я"]);
	
	prepared["a"] = prepare_json(alph["a"]);
	prepared["b"] = prepare_json(alph["b"]);
	prepared["c"] = prepare_json(alph["c"]);
	prepared["d"] = prepare_json(alph["d"]);
	prepared["e"] = prepare_json(alph["e"]);
	prepared["f"] = prepare_json(alph["f"]);
	prepared["g"] = prepare_json(alph["g"]);
	prepared["h"] = prepare_json(alph["h"]);
	prepared["i"] = prepare_json(alph["i"]);
	prepared["j"] = prepare_json(alph["j"]);
	prepared["k"] = prepare_json(alph["k"]);
	prepared["l"] = prepare_json(alph["l"]);
	prepared["m"] = prepare_json(alph["m"]);
	prepared["n"] = prepare_json(alph["n"]);
	prepared["o"] = prepare_json(alph["o"]);
	prepared["p"] = prepare_json(alph["p"]);
	prepared["q"] = prepare_json(alph["q"]);
	prepared["r"] = prepare_json(alph["r"]);
	prepared["s"] = prepare_json(alph["s"]);
	prepared["t"] = prepare_json(alph["t"]);
	prepared["u"] = prepare_json(alph["u"]);
	prepared["v"] = prepare_json(alph["v"]);
	prepared["w"] = prepare_json(alph["w"]);
	prepared["x"] = prepare_json(alph["x"]);
	prepared["y"] = prepare_json(alph["y"]);
	prepared["z"] = prepare_json(alph["z"]);
	
	return prepared;
}


function save_settings_file() {
	update_settings();
	result = {};
	result["alph"] = prepare_alph(alph);
	
	result["street_prefixes"] = prepare_json(street_prefixes);
	result["house_prefixes"] = prepare_json(house_prefixes);
	result["apartment_prefixes"] = prepare_json(apartment_prefixes);
	result["separators"] = prepare_json(separators);
	
	value = JSON.stringify(result);
	
	download = document.createElement("a");
	download.href = "data:text/plain;content-disposition=attachment;filename=file," + value;
	download.download = "settings.json";
	download.style.display = "none";
	download.id = "download"; document.body.appendChild(download);
	document.getElementById("download").click();
	document.body.removeChild(download);
}


function create_file_input() {
	input = document.createElement("input");
	input.type = "file";
	input.id = "file_input";
	input.style.display = "none";
	input.setAttribute("onchange", "open_file(this);");
	document.body.appendChild(input);
	document.getElementById("file_input").click();
	document.body.removeChild(input);
}


function read_array(array) {
	// Array -> Srting for inputs
	string = "";
	for (var i = 0; i < array.length; i++) {
		string += '"' + array[i] + '"';
		if (i != array.length - 1) string += ", ";
	}
	return string;
}


function open_file(input) {
	let file = input.files[0];
	let reader = new FileReader();
	reader.readAsText(file);
	
	reader.onload = function() {
		res = reader.result;
		res = JSON.parse(res);
		document.getElementById("let_ru_1").value = read_array(res.alph.а);
		document.getElementById("let_ru_2").value = read_array(res.alph.б);
		document.getElementById("let_ru_3").value = read_array(res.alph.в);
		document.getElementById("let_ru_4").value = read_array(res.alph.г);
		document.getElementById("let_ru_5").value = read_array(res.alph.д);
		document.getElementById("let_ru_6").value = read_array(res.alph.е);
		document.getElementById("let_ru_7").value = read_array(res.alph.ё);
		document.getElementById("let_ru_8").value = read_array(res.alph.ж);
		document.getElementById("let_ru_9").value = read_array(res.alph.з);
		document.getElementById("let_ru_10").value = read_array(res.alph.и);
		document.getElementById("let_ru_11").value = read_array(res.alph.й);
		document.getElementById("let_ru_12").value = read_array(res.alph.к);
		document.getElementById("let_ru_13").value = read_array(res.alph.л);
		document.getElementById("let_ru_14").value = read_array(res.alph.м);
		document.getElementById("let_ru_15").value = read_array(res.alph.н);
		document.getElementById("let_ru_16").value = read_array(res.alph.о);
		document.getElementById("let_ru_17").value = read_array(res.alph.п);
		document.getElementById("let_ru_18").value = read_array(res.alph.р);
		document.getElementById("let_ru_19").value = read_array(res.alph.с);
		document.getElementById("let_ru_20").value = read_array(res.alph.т);
		document.getElementById("let_ru_21").value = read_array(res.alph.у);
		document.getElementById("let_ru_22").value = read_array(res.alph.ф);
		document.getElementById("let_ru_23").value = read_array(res.alph.х);
		document.getElementById("let_ru_24").value = read_array(res.alph.ц);
		document.getElementById("let_ru_25").value = read_array(res.alph.ч);
		document.getElementById("let_ru_26").value = read_array(res.alph.ш);
		document.getElementById("let_ru_27").value = read_array(res.alph.щ);
		document.getElementById("let_ru_28").value = read_array(res.alph.ъ);
		document.getElementById("let_ru_29").value = read_array(res.alph.ы);
		document.getElementById("let_ru_30").value = read_array(res.alph.ь);
		document.getElementById("let_ru_31").value = read_array(res.alph.э);
		document.getElementById("let_ru_32").value = read_array(res.alph.ю);
		document.getElementById("let_ru_33").value = read_array(res.alph.я);
		
		document.getElementById("let_en_1").value = read_array(res.alph.a);
		document.getElementById("let_en_2").value = read_array(res.alph.b);
		document.getElementById("let_en_3").value = read_array(res.alph.c);
		document.getElementById("let_en_4").value = read_array(res.alph.d);
		document.getElementById("let_en_5").value = read_array(res.alph.e);
		document.getElementById("let_en_6").value = read_array(res.alph.f);
		document.getElementById("let_en_7").value = read_array(res.alph.g);
		document.getElementById("let_en_8").value = read_array(res.alph.h);
		document.getElementById("let_en_9").value = read_array(res.alph.i);
		document.getElementById("let_en_10").value = read_array(res.alph.j);
		document.getElementById("let_en_11").value = read_array(res.alph.k);
		document.getElementById("let_en_12").value = read_array(res.alph.l);
		document.getElementById("let_en_13").value = read_array(res.alph.m);
		document.getElementById("let_en_14").value = read_array(res.alph.n);
		document.getElementById("let_en_15").value = read_array(res.alph.o);
		document.getElementById("let_en_16").value = read_array(res.alph.p);
		document.getElementById("let_en_17").value = read_array(res.alph.q);
		document.getElementById("let_en_18").value = read_array(res.alph.r);
		document.getElementById("let_en_19").value = read_array(res.alph.s);
		document.getElementById("let_en_20").value = read_array(res.alph.t);
		document.getElementById("let_en_21").value = read_array(res.alph.u);
		document.getElementById("let_en_22").value = read_array(res.alph.v);
		document.getElementById("let_en_23").value = read_array(res.alph.w);
		document.getElementById("let_en_24").value = read_array(res.alph.x);
		document.getElementById("let_en_25").value = read_array(res.alph.y);
		document.getElementById("let_en_26").value = read_array(res.alph.z);
		
		document.getElementById("street_prefixes").value = read_array(res.street_prefixes);
		document.getElementById("house_prefixes").value = read_array(res.house_prefixes);
		document.getElementById("apartment_prefixes").value = read_array(res.apartment_prefixes);
		document.getElementById("separators").value = read_array(res.separators);
		update_settings();
		
		UIkit.notification("Настройки из файла " + file.name + " успешно загружены", {status: 'primary', pos: 'bottom-right', timeout: 2000});
	};

	reader.onerror = function() {
		UIkit.notification("Ошибка открытия файла!", {status: 'danger', pos: 'bottom-right', timeout: 2000});
	};
	
}


function generate_name() {
	update_settings();
	
	document.getElementById("lastname").classList.remove("uk-form-danger");
	document.getElementById("lastname").classList.remove("uk-form-warning");
	document.getElementById("firstname").classList.remove("uk-form-danger");
	document.getElementById("firstname").classList.remove("uk-form-warning");
	document.getElementById("middlename").classList.remove("uk-form-danger");
	document.getElementById("middlename").classList.remove("uk-form-warning");
	document.getElementById("lastname_distance").classList.remove("uk-form-warning");
	document.getElementById("firstname_distance").classList.remove("uk-form-warning");
	document.getElementById("middlename_distance").classList.remove("uk-form-warning");
	
	lastname = document.getElementById("lastname").value.toLowerCase();
	firstname = document.getElementById("firstname").value.toLowerCase();
	middlename = document.getElementById("middlename").value.toLowerCase();
	
	if (lastname == "") {
		document.getElementById("lastname").classList.add("uk-form-danger");
		UIkit.notification("Необходимо заполнить фамилию!", {status: 'danger', pos: 'bottom-left', timeout: 2000});
		return 0;
	}
	
	if (firstname == "") {
		document.getElementById("firstname").classList.add("uk-form-danger");
		UIkit.notification("Необходимо заполнить имя!", {status: 'danger', pos: 'bottom-left', timeout: 2000});
		return 0;
	}
	
	selector = document.getElementById('lastname_distance');
    lastname_distance = selector[selector.selectedIndex].value;
	
	selector = document.getElementById('firstname_distance');
    firstname_distance = selector[selector.selectedIndex].value;
	
	selector = document.getElementById('middlename_distance');
    middlename_distance = selector[selector.selectedIndex].value;
	
	disable_middlename = document.getElementById("disable_middlename").checked;
	
	is_middlename_disabled = disable_middlename || middlename == "";
	
	disable_mix = document.getElementById("disable_mix").checked;
	
	firstnames = generate(firstname, firstname_distance);
	lastnames = generate(lastname, lastname_distance);
	if (!is_middlename_disabled)
		middlenames = generate(middlename, middlename_distance);
	
	if (!is_middlename_disabled) {
		if (!disable_mix)
			fio_vars = ["{first} {middle} {last}", "{first} {last} {middle}", "{last} {first} {middle}"];
		else
			fio_vars = ["{last} {first} {middle}"];
		minimum = Math.min(firstnames.length, lastnames.length, middlenames.length);
	}
	else {
		if (!disable_mix)
			fio_vars = ["{first} {last}", "{last} {first}"];
		else 
			fio_vars = ["{last} {first}"];
		minimum = Math.min(firstnames.length, lastnames.length);
	}
	
	tip_text = "";
	if (minimum == firstnames.length) {
		tip_text = "Уменьши уникальность имени!";
		if (firstname_distance == 1) tip_text = "Измени написание имени!";
	}
	else if (minimum == lastnames.length) {
		tip_text = "Уменьши уникальность фамилии!";
		if (lastname_distance == 1) tip_text = "Измени написание фамилии!";
	}
	else if (minimum == middlenames.length) {
		tip_text = "Уменьши уникальность отчества!";
		if (middlename_distance == 1) tip_text = "Измени написание отчества!";
	}	
	
	is_title = document.getElementById("is_title").checked;
	document.getElementById("result_name").value = '';
	for (var i = 0; i < minimum; i++) {
		name = fio_vars[i % fio_vars.length];
		name = name.replace("{first}", firstnames[i]);
		if (!is_middlename_disabled) name = name.replace("{middle}", middlenames[i]);
		name = name.replace("{last}", lastnames[i]);
		if (is_title) name = name.title()
		document.getElementById("result_name").value += name + '\n';
	}
	
	UIkit.notification("Нужно больше результатов? " + tip_text, {status: 'primary', pos: 'bottom-left', timeout: 2000})
	if (tip_text == "Уменьши уникальность имени!") document.getElementById("firstname_distance").classList.add("uk-form-warning");
	if (tip_text == "Уменьши уникальность фамилии!") document.getElementById("lastname_distance").classList.add("uk-form-warning");
	if (tip_text == "Уменьши уникальность отчества!") document.getElementById("middlename_distance").classList.add("uk-form-warning");
	if (tip_text == "Измени написание имени!") document.getElementById("firstname").classList.add("uk-form-warning");
	if (tip_text == "Измени написание фамилии!") document.getElementById("lastname").classList.add("uk-form-warning");
	if (tip_text == "Измени написание отчества!") document.getElementById("middlename").classList.add("uk-form-warning");
}


function generate_address() {
	update_settings();
	
	document.getElementById("streetname").classList.remove("uk-form-danger");
	document.getElementById("streetname").classList.remove("uk-form-warning");
	document.getElementById("streetname_distance").classList.remove("uk-form-warning");
	document.getElementById("house_number").classList.remove("uk-form-danger");
	
	streetname = document.getElementById("streetname").value.toLowerCase();
	house_number = document.getElementById("house_number").value.toLowerCase();
	apartment_number = document.getElementById("apartment_number").value.toLowerCase();
	
	if (streetname == "") {
		document.getElementById("streetname").classList.add("uk-form-danger");
		UIkit.notification("Необходимо заполнить название улицы!", {status: 'danger', pos: 'bottom-center', timeout: 2000});
		return 0;
	}
	
	if (house_number == "") {
		document.getElementById("house_number").classList.add("uk-form-danger");
		UIkit.notification("Необходимо заполнить номер дома!", {status: 'danger', pos: 'bottom-center', timeout: 2000});
		return 0;
	}
	
	selector = document.getElementById('streetname_distance');
    streetname_distance = selector[selector.selectedIndex].value;
	
	disable_apartment = document.getElementById("disable_apartment").checked;
	is_title_street = document.getElementById("is_title_street").checked;
	is_apartment_disabled = disable_apartment || apartment_number == "";
	disable_separators = document.getElementById("disable_separators").checked;
	
	streetnames = generate(streetname, streetname_distance);
	
	tip_text = "Уменьши уникальность улицы!";
	if (streetname_distance == 1) tip_text = "Измени написание улицы!";
	
	document.getElementById("result_address").value = '';
	for (var i = 0; i < streetnames.length; i++) {
		street_prefix = street_prefixes[i % street_prefixes.length];
		house_prefix = house_prefixes[i % house_prefixes.length];
		apartment_prefix = apartment_prefixes[i % apartment_prefixes.length];
		separator = separators[i % separators.length];
		
		separator_string = (disable_separators) ? (" ") : (separator + " ");
		house_string = (house_prefix) ? (separator_string + house_prefix + " " + house_number) : (separator_string + house_number);
		apartment_string = (apartment_prefix) ? (separator_string + apartment_prefix + " " + apartment_number) : (separator_string + apartment_number);
		streetname = (is_title_street) ? (streetnames[i].title()) : (streetnames[i]);
		street_string = (street_prefix) ? (street_prefix + " " + streetname) : (streetname);
		
		if (is_apartment_disabled) apartment_string = "";
		
		result = street_string + house_string + apartment_string;
		document.getElementById("result_address").value += result + '\n';
	}
	
	UIkit.notification("Нужно больше результатов? " + tip_text, {status: 'primary', pos: 'bottom-center', timeout: 2000});
	if (tip_text == "Уменьши уникальность улицы!") document.getElementById("streetname_distance").classList.add("uk-form-warning");
	if (tip_text == "Измени написание улицы!") document.getElementById("streetname").classList.add("uk-form-warning");
}