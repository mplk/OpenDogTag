import $ from 'jquery';
import { fields, decodeUrlParams, encodeUrlParams } from './common.js';

const baseUrl = 'http://localhost:8080/';

function updateConfigurationLink() {
    // Get current values
    let params = {};
    params.name = $('#name').val();
    params.sex = $('#sex-female-radio').is(':checked') ? '0' : '1';
    params.neutered = $('#neutered').is(':checked') ? '1' : '0';
    params.birthday = $('#birthday').val();
    params.breed = $('#breed').val();
    params.height = $('#height').val();
    params.weight = $('#weight').val();
    params.character = $('#character').val();
    params.specialAttributes = $('#specialAttributes').val();
    params.chipId = $('#chipId').val();
    params.chipLocation = $('#chipLocation').val();
    params.tassoId = $('#tassoId').val();
    params.insuranceId = $('#insuranceId').val();
    params.taxId = $('#taxId').val();

    // Encode parameters and update output
    const encodedParams = encodeUrlParams(params);
    const configUrl = `${baseUrl}?${encodedParams}`;
    $('#config-output').val(configUrl);

    // Update byte counter
    const byteCount = configUrl.length;
    $('#byte-counter').text(`${byteCount} bytes`);
}

$(function () {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const params = decodeUrlParams(urlParams);
    console.log(params);

    // Populate the fields with decoded parameters
    fields.forEach(field => {
        $(`#${field}`).val(params[field] || '');
    });

    // Initial configuration link update
    updateConfigurationLink();

    // Observe changes and update configuration link
    $('input').on('change', function () {
        updateConfigurationLink();
    });

    // Select the text when clicked for easy manual copying
    $('#config-output').on('click', function () {
        this.select();
        try {
            navigator.clipboard.writeText($('#config-output').val()).then(function () {
                alert('Parameters copied to clipboard');
            }).catch(function (err) {
                console.error('Error copying text: ', err);
            });
        } catch (err) {
            console.error('Clipboard API not available: ', err);
        }
    });
});


