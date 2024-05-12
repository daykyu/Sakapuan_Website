/*==============================================================*/
/* Script for handling the frontend of volunteer*/
/*===============================================================*/

function changeColor(select) {
    if (select.value === "empty") {
        select.style.color = 'gray';
    } else {
        select.style.color = 'black';
    }
}

// Initialize color on page load
window.onload = function () {
    var select = document.getElementById('nationality');
    changeColor(select);
};

$(document).ready(function () {
    const registerForm = $('#registerForm');
    const modalSuccess = $('#modalSuccess');
    const closeModal = $('#closeModal');

    // The function to refill the form with previously saved data.
    function refillFormWithData() {
        const savedFormData = sessionStorage.getItem('formData');
        if (savedFormData) {
            const formData = JSON.parse(savedFormData);
            for (const key in formData) {
                const input = registerForm.find(`[name="${key}"]`);
                if (input.is('select')) {
                    input.find(`option[value="${formData[key]}"]`).prop('selected', true);
                } else {
                    input.val(formData[key]);
                }
            }
        }
    }

    // Calling the function to refill the form when the document is ready.
    refillFormWithData();

    // Using session storage to store register form data.
    const savedFormData = sessionStorage.getItem('formData');
    if (savedFormData) {
        console.log('Saved form data:', JSON.parse(savedFormData));
    } else {
        const temporaryFormData = sessionStorage.getItem('temporaryFormData');
        if (temporaryFormData) {
            console.log('Temporary form data:', JSON.parse(temporaryFormData));
        }
    }

    const registeredEmails = {};

    registerForm.on('submit', function (event) {
        event.preventDefault(); // Prevent form submission

        // Form validation
        if (validateForm(registerForm)) {
            const email = registerForm.find('input[name="email"]').val().trim();

            if (registeredEmails[email]) {
                alert('Email has already been registered.');
                return;
            }

            const formData = getFormData(registerForm);
            saveFormData(formData);

            modalSuccess.css('display', 'block');

            registerForm[0].reset();

            registeredEmails[email] = true;

            // Storing form data to sessionStorage.
            sessionStorage.setItem('formData', JSON.stringify(formData));
        }
    });

    closeModal.on('click', function () {
        modalSuccess.css('display', 'none');
    });

    // Event listener to store form data before the user leaves the page.
    $(window).on('beforeunload', function (event) {
        const formData = getFormData(registerForm);
        // Storing form data to sessionStorage as temporaryFormData.
        sessionStorage.setItem('temporaryFormData', JSON.stringify(formData));
    });

    function validateForm(form) {
        const firstName = form.find('input[name="firstname"]').val().trim();
        const lastName = form.find('input[name="lastname"]').val().trim();
        const nationality = form.find('select[name="nationality"]').val();
        const occupation = form.find('input[name="occupation"]').val().trim();
        const email = form.find('input[name="email"]').val().trim();
        const phone = form.find('input[name="phone"]').val().trim();

        if (firstName === '' || lastName === '' || nationality === 'empty' || occupation === '' || email === '' || phone === '') {
            alert('Please fill in all fields.');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address.');
            return false;
        }

        const phoneRegex = /^\d{10,12}$/;
        if (!phoneRegex.test(phone)) {
            alert('Please enter a valid phone number (10-12 digits).');
            return false;
        }

        return true;
    }

    function getFormData(form) {
        // Getting data from the form
        const formData = form.serializeArray();
        const volunteerData = {};
        $.each(formData, function (_, field) {
            volunteerData[field.name] = field.value;
        });
        return volunteerData;
    }

    function saveFormData(data) {
        console.log('Data saved:', data);
    }

});
