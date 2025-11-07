import $ from 'jquery';
import LZString from 'lz-string';
import '@fortawesome/fontawesome-free/css/all.css';

import '../scss/styles.scss';

import { validateInput } from './validation.js';
import { calculateAge } from './helpers.js';
import i18next, { i18nextPromise, updateContent, changeLanguage, translate } from './i18n.js';

const delimiter = '~';
const newLinePlaceholder = '°';

const SEX = {
    EMPTY: '',
    FEMALE: '0',
    MALE: '1'
};

const NEUTERED = {
    EMPTY: '',
    YES: '1',
    NO: '0',
    UNKNOWN: '?'
};

const baseUrl = `${window.location.origin}${window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/'))}`;

let currentMode = 'view';
let currentTheme = 'light';

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

function decodeTagData(dataParameter) {
    try {
        const decodedParameters = LZString.decompressFromEncodedURIComponent(dataParameter);
        if (!decodedParameters) return tagData; // Return empty data if nothing to decode

        const dataArr = decodedParameters.split(delimiter);

        // Validate array length matches expected fields
        if (dataArr.length > Object.keys(tagData).length) {
            console.warn('Unexpected data format');
        }

        Object.keys(tagData).forEach((field, index) => {
            tagData[field] = dataArr[index] || null;
        });

        return tagData;

    } catch (error) {
        console.error('Error decoding tag data: ', error);
        return tagData; // Return empty data on error
    }
}

function encodeTagData(params) {
    const dataArr = Object.keys(tagData).map(field => params[field] || '');
    const d = dataArr.join(delimiter);

    const urlParams = new URLSearchParams();
    const encoded = LZString.compressToEncodedURIComponent(d);
    urlParams.set('d', encoded);

    return urlParams.toString();
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
                case 'name':
                    $('#greeting-view').text(translate('greeting.view', { name: tagData[field] }));
                    $(`#${field}-output`).text(tagData[field]);
                    break;
                case 'sex':
                    if (tagData[field] === SEX.EMPTY) $(`#${field}-output`).text('');
                    if (tagData[field] === SEX.FEMALE) $(`#${field}-output`).text(translate('values.female'));
                    if (tagData[field] === SEX.MALE) $(`#${field}-output`).text(translate('values.male'));
                    break;
                case 'neutered':
                    if (tagData[field] === NEUTERED.EMPTY) $(`#${field}-output`).text('');
                    if (tagData[field] === NEUTERED.YES) $(`#${field}-output`).text(translate('values.yes'));
                    if (tagData[field] === NEUTERED.NO) $(`#${field}-output`).text(translate('values.no'));
                    if (tagData[field] === NEUTERED.UNKNOWN) $(`#${field}-output`).text(translate('values.unknown'));
                    break;
                case 'birthday':
                    const date = tagData[field];
                    if (date) {
                        const [year, month, day] = date.split('-');
                        const formattedDate = `${day}.${month}.${year}`;
                        $(`#${field}-output`).text(formattedDate);
                        $('#age-output').text(calculateAge(formattedDate) || translate('values.unknown'));
                    } else {
                        $(`#${field}-output`).text(translate('values.unknown'));
                        $('#age-output').text(translate('values.unknown'));
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
        } else {
            // Set empty text for fields without data
            $(`#${field}-output`).text(translate('values.empty'));
        }
    });
}

function populateInputFields() {
    // Populate input fields based on tagData
    Object.keys(tagData).forEach(field => {
        if (tagData[field]) {
            switch (field) {
                case 'sex':
                    if (tagData[field] === SEX.EMPTY) $('#sex-noShow-input').prop('checked', true);
                    if (tagData[field] === SEX.FEMALE) $('#sex-female-input').prop('checked', true);
                    if (tagData[field] === SEX.MALE) $('#sex-male-input').prop('checked', true);
                    break;
                case 'neutered':
                    if (tagData[field] === NEUTERED.EMPTY) $('#neutered-noShow-input').prop('checked', true);
                    if (tagData[field] === NEUTERED.YES) $('#neutered-yes-input').prop('checked', true);
                    if (tagData[field] === NEUTERED.NO) $('#neutered-no-input').prop('checked', true);
                    if (tagData[field] === NEUTERED.UNKNOWN) $('#neutered-unknown-input').prop('checked', true);
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
                if ($('#sex-noShow-input').is(':checked')) params[field] = SEX.EMPTY;
                if ($('#sex-female-input').is(':checked')) params[field] = SEX.FEMALE;
                if ($('#sex-male-input').is(':checked')) params[field] = SEX.MALE;
                break;
            case 'neutered':
                if ($('#neutered-noShow-input').is(':checked')) params[field] = NEUTERED.EMPTY;
                if ($('#neutered-yes-input').is(':checked')) params[field] = NEUTERED.YES;
                if ($('#neutered-no-input').is(':checked')) params[field] = NEUTERED.NO;
                if ($('#neutered-unknown-input').is(':checked')) params[field] = NEUTERED.UNKNOWN;
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
    console.log('Current parameters: ', params);

    // Encode parameters and update output
    const encodedParams = encodeTagData(params);
    const configUrl = `${baseUrl}?${encodedParams}`;
    const byteCount = configUrl.length;

    $('#config-output').val(configUrl);
    $('#byte-counter').text(`${byteCount} bytes`);
}

function setTheme(theme) {
    const htmlElement = document.documentElement;
    htmlElement.setAttribute('data-bs-theme', theme);

    // Update theme icon
    const themeIcon = $('#theme-icon');
    if (theme === 'dark') {
        themeIcon.removeClass('fa-moon').addClass('fa-sun');
    } else {
        themeIcon.removeClass('fa-sun').addClass('fa-moon');
    }
}

$(function () {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    tagData = decodeTagData(urlParams.get('d'));
    console.log('Dog tag data loaded: ', tagData);

    // Wait for i18next to initialize before populating fields
    i18nextPromise.then(() => {
        // Update all content (static translations, outputs, and inputs)
        updateContent(); // Update static i18n content

        populateOutputFields(); // Update dynamic output/display fields
        populateInputFields(); // Update input fields

        // Set language selector to current language (handle cases like 'en-US' -> 'en')
        const currentLang = i18next.language.split('-')[0];
        $('#language-selector').val(currentLang);
    });

    // Set initial mode based on URL parameter
    currentMode = urlParams.has('e') ? 'edit' : 'view';
    switchMode(currentMode);

    // Toggle mode on navbar button click
    console.log('Current mode:', currentMode);
    $('#edit-navbar-button').on('click', function () {
        currentMode = currentMode === 'edit' ? 'view' : 'edit';
        switchMode(currentMode);
    });

    // Get preferred color scheme
    currentTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    setTheme(currentTheme);

    // Toggle theme on button click
    $('#theme-toggle-button').on('click', function () {
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';
        setTheme(currentTheme);
    });

    // Language switcher
    $('#language-selector').on('change', function () {
        const selectedLang = $(this).val();
        changeLanguage(selectedLang).then(() => {
            // Re-populate all content after language change
            updateContent(); // Update static i18n content
            populateOutputFields(); // Update dynamic output/display fields
        }).catch((error) => {
            console.error('Error changing language:', error);
            alert(translate('messages.languageChangeFailed'));
        });
    });

    // Initial configuration link update
    updateConfiguration();

    // Observe changes and update configuration link
    $('#main-content-container').on('change input', 'input, textarea', function () {
        $('#unsaved-changes-warning').show(); // Show unsaved changes warning
        updateConfiguration();
    });

    // Add validation event listeners for phone, email, and number inputs
    $('#ownerPhone1-input, #ownerPhone2-input, #owner2Phone1-input, #owner2Phone2-input, #vetPhone-input').on('blur input', function () {
        validateInput(this);
    });

    $('#ownerEmail-input, #owner2Email-input, #vetEmail-input').on('blur input', function () {
        validateInput(this);
    });

    $('#height-input, #weight-input').on('blur input', function () {
        validateInput(this);
    });

    // Select the text when clicked for easy manual copying
    $('#config-output').on('click', function () {
        this.select();
        try {
            navigator.clipboard.writeText($('#config-output').val()).then(function () {
                alert(translate('messages.configCopied'));
            }).catch(function (err) {
                console.error('Error copying text: ', err);
            });
        } catch (err) {
            console.error('Clipboard API not available: ', err);
            alert(translate('messages.manualCopy'));
        }
    });

    // Preview button opens new window with current configuration
    $('#preview-button').on('click', function () {
        const previewUrl = $('#config-output').val();
        const newWindow = window.open(previewUrl, '_blank');
        if (!newWindow) {
            alert(translate('messages.popupBlocked'));
        }
    });
});
