import { decodeUrlParams, encodeUrlParams } from './main.js';

const baseUrl = 'http://localhost:8080/';

document.addEventListener('DOMContentLoaded', function () {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const params = decodeUrlParams(urlParams);
    console.log(params);

    // Populate the fields with decoded parameters
    document.getElementById('name').value = params.name || '';
    document.getElementById('breed').value = params.breed || '';
    document.getElementById('birthday').value = params.birthday || '';

    // Add action on button click
    const saveButton = document.getElementById('saveButton');
    saveButton.addEventListener('click', function () {
        const encodedParams = encodeUrlParams({
            name: document.getElementById('name').value,
            breed: document.getElementById('breed').value,
            birthday: document.getElementById('birthday').value
        });

        document.getElementById('parameters').value = `${baseUrl}?${encodedParams}`;
    });

    // Copy the parameters to the clipboard
    const parametersField = document.getElementById('parameters');
    
    // Select the text when clicked for easy manual copying
        parametersField.addEventListener('click', function () {
        console.log('Parameters field clicked');
        parametersField.select();
        try {
            navigator.clipboard.writeText(parametersField.value).then(function () {
                alert('Parameters copied to clipboard');
            }).catch(function (err) {
                console.error('Error copying text: ', err);
            });
        } catch (err) {
            console.error('Clipboard API not available: ', err);
        }
    });
});


