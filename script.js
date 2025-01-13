let arr = [];
let isEditing = false;
let editingIndex = null;

const saveButton = document.getElementById("save");
const cancelButton = document.getElementById("cancel");
const searchInput = document.getElementById("search");
const sortDropdown = document.getElementById("sort");
const errorDiv = document.getElementById("error");
saveButton.addEventListener("click", forSave);
cancelButton.addEventListener("click", resetForm);
searchInput.addEventListener("input", forSearch);
sortDropdown.addEventListener("change", forSort);

const states = {
    gujarat: ['Ahemdabad', 'Bharuch', 'Surat', 'Vadodara'],
    maharashtra: ['Kolhapur', 'Mumbai', 'Pune', 'Thane'],
    rajasthan: ['Ajmer', 'Jaipur', 'Jaislmer', 'Udaipur'],
    punjab: ['Amritsar', 'Bhatindar', 'Ludhiana', 'Patiala']
};

const stateList = document.getElementById("state");
stateList.innerHTML = '<option>Select a state</option>';

Object.keys(states).forEach(state => {
    const option = document.createElement('option');
    option.value = state;
    option.textContent = (state).toUpperCase();
    stateList.appendChild(option);
});

stateList.addEventListener('change', function () {
    const selectedState = this.value;
    const cities = states[selectedState];
    const cityList = document.getElementById("city");
    cityList.innerHTML = '<option>Select a city</option>';

    cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city.toLowerCase();
        option.textContent = city.toUpperCase();
        cityList.appendChild(option);
    });
});

function getFormData() {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const gender = document.querySelector('input[name="gender"]:checked')?.value;
    const hobbies = Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value);
    const age = document.getElementById("age").value.trim();
    const state = document.getElementById("state").value.trim();
    const city = document.getElementById("city").value.trim();
    const time = new Date().toLocaleString();

    return { name, email, gender, hobbies: hobbies.join(", "), age, state, city, time };
}

function validateForm() {
    clearError();
    const { name, email, gender, hobbies, age, state, city } = getFormData();

    if (!name)
        return showError("Please enter your Name.");

    if (!email || !validateEmail(email))
        return showError("Please enter your proper Email.");

    if (!gender)
        return showError("Please enter your Gender.");

    if (!hobbies)
        return showError("Please enter your hobbies.");

    if (!age)
        return showError("Please enter your Age.");

    if (!state || !city)
        return showError("Please enter your State and City.");

    return true;
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function forSave() {
    if (!validateForm()) return;

    const formData = getFormData();
    if (isEditing) {
        arr[editingIndex] = formData;
        isEditing = false;
        editingIndex = null;
        saveButton.innerHTML = "Save";
    } else {
        arr.push(formData);
    }
    updateTable();
    resetForm();
}

function showError(message) {
    errorDiv.textContent = message;
    errorDiv.style.display = "block";
    return false;
}

function clearError() {
    errorDiv.textContent = "";
    errorDiv.style.display = "none";
}

function resetForm() {
    document.getElementById("form").reset();
    saveButton.innerHTML = "Save";
    cancelButton.style.display = "none";
    isEditing = false;
    editingIndex = null;
    clearError();
}

function updateTable() {
    const tbody = document.getElementById("dispdata");
    tbody.innerHTML = "";
    arr.forEach((record, index) => {
        const row = createRow(record, index);
        tbody.appendChild(row);
    });
}

function renderFilteredTable(filtered) {
    const tbody = document.getElementById("dispdata");
    tbody.innerHTML = "";

    filtered.forEach((record, index) => {
        const row = createRow(record, index);
        tbody.appendChild(row);
    });
}

function createRow(record, index) {
    const row = document.createElement("tr");

    Object.keys(record).forEach(key => {
        const cell = document.createElement("td");
        cell.textContent = record[key];
        row.appendChild(cell);

    });

    const actionCell = document.createElement("td");
    const editButton = createActionButton("Edit", () => forEdit(index));
    const deleteButton = createActionButton("Delete", () => forDelete(index));
    actionCell.append(editButton, deleteButton);
    row.appendChild(actionCell);

    return row;
}

function createActionButton(text, action) {
    const button = document.createElement("button");
    button.textContent = text;
    button.addEventListener("click", action);
    return button;
}

function forEdit(index) {
    const record = arr[index];
    document.getElementById("name").value = record.name;
    document.getElementById("email").value = record.email;
    document.querySelector(`input[name="gender"][value="${record.gender}"]`).checked = true;
    record.hobbies.split(", ").forEach(hobby => {
        document.querySelector(`input[type="checkbox"][value="${hobby}"]`).checked = true;
    });
    document.getElementById("age").value = record.age;
    document.getElementById("state").value = record.state;
    document.getElementById("city").value = record.city;
    saveButton.innerHTML = "Update";
    cancelButton.style.display = "inline";
    isEditing = true;
    editingIndex = index;
}

function forDelete(index) {
    arr.splice(index, 1);
    updateTable();
}

function forSearch() {
    const query = searchInput.value.toLowerCase();
    const filtered = arr.filter(record => record.name.toLowerCase().includes(query));
    renderFilteredTable(filtered);
}

function forSort() {
    const direction = sortDropdown.value;
    arr.sort((a, b) => {
        if (direction === "asc") {
            return a.name.localeCompare(b.name);
        } else if (direction === "desc") {
            return b.name.localeCompare(a.name);
        }
    });
    updateTable();
}