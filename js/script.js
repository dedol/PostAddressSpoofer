var alph = {};
var street_prefixes = [];
var house_prefixes = [];
var apartment_prefixes = [];
var separators = [];

const letters = [
	"а", "б", "в", "г", "д", "е", "ё", "ж", "з", "и", "й", "к", "л", "м", "н", "о", "п", "р", "с", "т", "у", "ф", "х", "ц", "ч", "ш", "щ", "ъ", "ы", "ь", "э", "ю", "я",
	"a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"
];

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
	for(let letter = 0; letter < letters.length; letter++){
		alph[letters[letter]] = load_data("let_"+(letter < 33 ? 'ru' : 'en')+"_"+(letter < 33 ? (letter+1) : (letter-32)));
	}
}


function prepare_json(data) {
	for (var i = 0; i < data.length; i++)
		data[i] = data[i].replaceAll(",", "{comma}");
	return data;
}


function prepare_alph(data) {
	prepared = {}
	for(let letter = 0; letter < letters.length; letter++){
		prepared[letters[letter]] = prepare_json(alph[letters[letter]]);
	}	
	
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
		
		for(let letter = 0; letter < letters.length; letter++){
			document.getElementById("let_"+(letter < 33 ? 'ru' : 'en')+"_"+(letter < 33 ? (letter+1) : (letter-32))).value = read_array(res.alph[letters[letter]]);
		}
		
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