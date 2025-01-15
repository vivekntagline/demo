let arr = [];
let isEditing = false;
let editingIndex = null;

const form = document.getElementById("form");
const saveButton = document.getElementById("save");
const cancelButton = document.getElementById("cancel");
const searchInput = document.getElementById("search");
const sortDropdown = document.getElementById("sort");
const errorDiv = document.getElementById("error");

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const name = formData.get("name").trim();
    const email = formData.get("email").trim();
    const gender = formData.get("gender");
    const hobbies = formData.getAll("hobbies").join(", ");
    const age = formData.get("age").trim();
    const state = formData.get("state").trim();
    const city = formData.get("city").trim();
    const time = new Date().toLocaleString();

    if (!validateForm({ name, email, gender, hobbies, age, state, city })) return;

    const record = { name, email, gender, hobbies, age, state, city, time };

    if (isEditing) {
        arr[editingIndex] = record;
        isEditing = false;
        editingIndex = null;
        saveButton.innerHTML = "Save";
    } else {
        arr.push(record);
    }

    updateTable();
    resetForm();
});

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
stateList.innerHTML = '<option value="">Select a state</option>';

Object.keys(states).forEach(state => {
    const option = document.createElement('option');
    option.value = state;
    option.textContent = state.toUpperCase();
    stateList.appendChild(option);
});

stateList.addEventListener('change', updateCity);

function updateCity() {
    const selectedState = this.value;
    const cityList = document.getElementById("city");
    cityList.innerHTML = '<option value="">Select a city</option>';
    states[selectedState].forEach(city => {
        const option = document.createElement('option');
        option.value = city.toLowerCase();
        option.textContent = city.toUpperCase();
        cityList.appendChild(option);
    });
};

function validateForm({ name, email, gender, hobbies, age, state, city }) {
    clearError();
    if (!name) return showError("Please enter your Name.");
    if (!email || !validateEmail(email)) return showError("Please enter a valid Email.");
    if (!gender) return showError("Please select your Gender.");
    if (!hobbies) return showError("Please select at least one Hobby.");
    if (!age) return showError("Please enter your Age.");
    if (!state || !city) return showError("Please select your State and City.");
    return true;
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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
    form.reset();
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
    for (const [key, value] of Object.entries(record)) {
        const input = document.querySelector(`[name="${key}"]`);
        if (input) {
            if (input.type === "checkbox" || input.type === "radio") {
                document.querySelector(`[name="${key}"][value="${value}"]`).checked = true;
            } else {
                input.value = value;
            }
        }
    }
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

function renderFilteredTable(filtered) {
    const tbody = document.getElementById("dispdata");
    tbody.innerHTML = "";
    filtered.forEach((record, index) => {
        const row = createRow(record, index);
        tbody.appendChild(row);
    });
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
