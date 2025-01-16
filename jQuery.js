let arr = [], isEditing = false, editingIndex = null;

$(document).ready(function () {
    const $form = $('#form');
    const $save = $('#save');
    const $cancel = $('#cancel');
    const $search = $('#search');
    const $sort = $('#sort');
    const $error = $('#error');
    const $state = $('#state');
    const $city = $('#city');
    const $dispdata = $('#dispdata');

    $form.on("submit", function (event) {
        event.preventDefault();
        const data = Object.fromEntries(new FormData(form));
        data.hobbies = $("[name='hobbies']:checked").map((i, hobby) => hobby.value).get().join(", ");
        data.time = new Date().toLocaleDateString();
        if (!validateForm(data)) return;
        if (isEditing) arr[editingIndex] = data;
        else arr.push(data);
        renderTable(arr);
        resetForm();
    });

    $cancel.on("click", resetForm);
    $search.on("input", () => {
        const search = arr.filter(r => r.name.toLowerCase().includes($search.val().toLowerCase()));
        renderTable(search);
    });

    $sort.on("change", () => {
        const sort = arr.sort((a, b) => $sort.val() === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));
        renderTable(sort);
    });

    const states = {
        gujarat: ['Ahemdabad', 'Bharuch', 'Surat', 'Vadodara'],
        maharashtra: ['Kolhapur', 'Mumbai', 'Pune', 'Thane'],
        rajasthan: ['Ajmer', 'Jaipur', 'Jaislmer', 'Udaipur'],
        punjab: ['Amritsar', 'Bhatindar', 'Ludhiana', 'Patiala']
    };

    $state.html(`<option>Select a State</option>${Object.keys(states).map(s => `<option value='${s}'>${s.toUpperCase()}</option>`).join("")}`)
        .on("change", () => {
            $city.html(`<option>Select a City</option>${(states[$state.val()]).map(c => `<option value='${c.toLowerCase()}'>${c.toUpperCase()}</option>`).join("")}`);
        });

    function validateForm(data) {
        const { name, email, gender, hobbies, age, state, city } = data;
        clearError();
        if (!name) return showError("Please enter your Name.");
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showError("Please enter a valid Email.");
        if (!gender) return showError("Please select your Gender.");
        if (!hobbies) return showError("Please select at least one Hobby.");
        if (!age || age < 0 || age > 100) return showError("Please enter valid Age.");
        if (!state || !city) return showError("Please select your State and City.");
        return true;
    }

    function showError(msg) {
        $error.text(msg).show();
        return false;
    };

    function clearError() {
        $error.hide();
    }

    function resetForm() {
        $form[0].reset();
        $save.text("Text");
        $cancel.hide();
        isEditing = false;
        editingIndex = null;
        clearError();
    }

    function renderTable(data) {
        $dispdata.html(data.map((r, i) => `
            <tr>${Object.values(r).map(v => `<td>${v}</td>`).join("")}
                <td>
                    <button class="edit" data-index="${i}">Edit</button>
                    <button class="delete" data-index="${i}">Delete</button>
                </td>
            </tr>`).join(""));
    }

    $dispdata.on("click", ".edit", function () {
        const record = arr[$(this).data("index")];
        Object.entries(record).forEach(([k, v]) => {
            const $input = $(`[name="${k}"]`);
            if ($input.is(":checkbox")) $input.each((i, hobby) => hobby.checked = v.split(", ").includes(hobby.value));
            else if ($input.is(":radio")) $(`[name="${k}"][value="${v}"]`).prop("checked", true);
            else if ($input.is("select")) $(`[name="${k}"]`).val(v);
            else $input.val(v);
        });
        $save.text("Update");
        $cancel.show();
        isEditing = true;
        editingIndex = $(this).data(index);
    });

    $dispdata.on("click", ".delete", function () {
        arr.splice($(this).data(index), 1);
        renderTable(arr);
    });
});
