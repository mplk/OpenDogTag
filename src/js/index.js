import $ from 'jquery';
import LZString from 'lz-string';
import '@fortawesome/fontawesome-free/css/all.css';

import '../scss/styles.scss';

const delimiter = '~';
const newLinePlaceholder = '°';
const baseUrl = `${window.location.origin}${window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/'))}`;

let currentMode = 'view';
let tagData = {
    name: null,
    sex: null,
    neutered: null,
    birthday: null,
    breed: null,
    height: null,
    weight: null,
    character: null,
    specialAttributes: null,
    ownerName: null,
    ownerPhone1: null,
    ownerPhone2: null,
    ownerEmail: null,
    ownerAddress: null,
    owner2Name: null,
    owner2Phone1: null,
    owner2Phone2: null,
    owner2Email: null,
    owner2Address: null,
    chipId: null,
    chipLocation: null,
    tassoId: null,
    insuranceId: null,
    taxId: null,
    allergies: null,
    diseases: null,
    medications: null,
    vetName: null,
    vetPhone: null,
    vetEmail: null,
    vetAddress: null,
    notes: null
};

function decodeUrlParams(dataParameter) {
    const decodedParameters = LZString.decompressFromEncodedURIComponent(dataParameter);
    const dataArr = decodedParameters ? decodedParameters.split(delimiter) : [];

    Object.keys(tagData).forEach((field, index) => {
        tagData[field] = dataArr[index] || null;
    });

    return tagData;
}

function encodeUrlParams(params) {
    const dataArr = Object.keys(tagData).map(field => params[field] || '');
    const d = dataArr.join(delimiter);

    const urlParams = new URLSearchParams();
    const encoded = LZString.compressToEncodedURIComponent(d);
    urlParams.set('d', encoded);

    return urlParams.toString();
}

function calculateAge(birthday) {
    // Parse dd.mm.yyyy format
    const parts = birthday.split('.');
    if (parts.length !== 3) return null;

    const birthDate = new Date(parts[2], parts[1] - 1, parts[0]);
    const today = new Date();

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();

    if (months < 0) {
        years--;
        months += 12;
    }

    return `${years} years ${months} months`;
}


function switchMode(mode) {
    switch (mode) {
        case 'edit':
            // Switch to edit mode
            $('.view-mode').addClass('d-none'); // Hide view mode elements
            $('.edit-mode').removeClass('d-none'); // Show edit mode elements

            $('.card tr').show(); // Show all rows in edit mode
            $('.card').show(); // Show all cards in edit mode
            break;
        case 'view':
            // Switch to view mode
            $('.view-mode').removeClass('d-none'); // Show view mode elements
            $('.edit-mode').addClass('d-none'); // Hide edit mode elements

            hideEmptyRows(); // Hide empty rows in view mode
            hideEmptyCards(); // Hide empty cards in view mode

            $('#unsaved-changes-warning').hide(); // Hide unsaved changes warning
            break;
    }
}

function hideEmptyCards() {
    // Hide cards that have no visible rows
    $('.card').each(function () {
        const $card = $(this);
        const $table = $card.find('table tbody');

        // Check if this card has a table with rows
        if ($table.length > 0) {
            const visibleRows = $table.find('tr:visible').length;

            // If no visible rows, hide the entire card
            if (visibleRows === 0) {
                $card.hide();
            }
        } else {
            // For cards without tables (like Notes), check if content is empty
            const $notes = $card.find('#notes-output');
            if ($notes.length > 0 && $notes.text() === '(empty)') {
                $card.hide();
            }
        }
    });
}

function hideEmptyRows() {
    // Hide rows that have empty data
    Object.keys(tagData).forEach(field => {
        if (!tagData[field]) {
            $(`#${field}-output`).closest('tr').hide();
        }
    });
}

function populateOutputFields() {
    // Populate output fields based on tagData
    Object.keys(tagData).forEach(field => {
        if (tagData[field]) {
            switch (field) {
                // TODO: improve formatting for address fields
                case 'sex':
                    tagData[field] === '0' ? $(`#${field}-output`).text('Female') : $(`#${field}-output`).text('Male');
                    break;
                case 'neutered':
                    tagData[field] === '1' ? $(`#${field}-output`).text('Yes') : $(`#${field}-output`).text('No');
                    break;
                case 'birthday':
                    const date = tagData[field];
                    if (date) {
                        const [year, month, day] = date.split('-');
                        const formattedDate = `${day}.${month}.${year}`;
                        $(`#${field}-output`).text(formattedDate);
                        $('#age-output').text(calculateAge(formattedDate) || 'Unknown');
                    } else {
                        $(`#${field}-output`).text('Unknown');
                        $('#age-output').text('Unknown');
                    }
                    break;
                case 'ownerAddress':
                case 'owner2Address':
                case 'vetAddress':
                    // Replace placeholder with new lines
                    const addressValue = tagData[field].replace(new RegExp(newLinePlaceholder, 'g'), '<br>');
                    $(`#${field}-output`).html(addressValue);
                    break;
                default:
                    $(`#${field}-output`).text(tagData[field]);
            }
        }
    });
}

function populateInputFields() {
    // Populate input fields based on tagData
    Object.keys(tagData).forEach(field => {
        if (tagData[field]) {
            switch (field) {
                case 'sex':
                    if (tagData[field] === '0') {
                        $('#sex-female-input').prop('checked', true);
                    } else {
                        $('#sex-male-input').prop('checked', true);
                    }
                    break;
                case 'neutered':
                    if (tagData[field] === '1') {
                        $('#neutered-input').prop('checked', true);
                    } else {
                        $('#neutered-input').prop('checked', false);
                    }
                    break;
                case 'ownerAddress':
                case 'owner2Address':
                case 'vetAddress':
                    // Replace placeholder with new lines
                    const addressValue = tagData[field].replace(new RegExp(newLinePlaceholder, 'g'), '\n');
                    $(`#${field}-input`).val(addressValue);
                    break;
                default:
                    $(`#${field}-input`).val(tagData[field] || '');
            }
        }
    });
}

function updateConfiguration() {
    // Get current values
    let params = {};
    Object.keys(tagData).forEach(field => {
        switch (field) {
            case 'sex':
                params[field] = $('#sex-female-input').is(':checked') ? '0' : '1';
                break;
            case 'neutered':
                params[field] = $('#neutered-input').is(':checked') ? '1' : '0';
                break;
            case 'ownerAddress':
            case 'owner2Address':
            case 'vetAddress':
                // Replace new lines with placeholder
                const addressValue = $(`#${field}-input`).val().replace(/\n/g, newLinePlaceholder);
                params[field] = addressValue;
                break;
            default:
                params[field] = $(`#${field}-input`).val();
        }
    });

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
    tagData = decodeUrlParams(urlParams.get('d'));
    console.log('Dog tag data loaded: ', tagData);

    // Populate the fields with decoded parameters
    populateOutputFields();
    populateInputFields();

    // Set initial mode based on URL parameter
    currentMode = urlParams.has('e') ? 'edit' : 'view';
    switchMode(currentMode);

    // Toggle mode on navbar button click
    console.log('Current mode:', currentMode);
    $('#edit-navbar-button').on('click', function () {
        currentMode = currentMode === 'edit' ? 'view' : 'edit';
        switchMode(currentMode);
    });

    // Initial configuration link update
    updateConfiguration();

    // Observe changes and update configuration link
    $('input, textarea').on('change input', function () {
        $('#unsaved-changes-warning').show(); // Show unsaved changes warning
        updateConfiguration();
    });

    // Select the text when clicked for easy manual copying
    $('#config-output').on('click', function () {
        this.select();
        try {
            navigator.clipboard.writeText($('#config-output').val()).then(function () {
                alert('Configuration copied to clipboard');
            }).catch(function (err) {
                console.error('Error copying text: ', err);
            });
        } catch (err) {
            console.error('Clipboard API not available: ', err);
        }
    });

    // Preview button opens new window with current configuration
    $('#preview-button').on('click', function () {
        const previewUrl = $('#config-output').val();
        window.open(previewUrl, '_blank');
    });
});
