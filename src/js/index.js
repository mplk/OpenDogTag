import $ from 'jquery';
import { fields, decodeUrlParams, calculateAge } from './common.js';


$(function () {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const params = decodeUrlParams(urlParams);
    console.log(params);

    // Populate the fields with decoded parameters
    fields.forEach(field => {
        if(params[field]) {
            switch (field) {
                case 'sex':
                    params[field] === '0' ? $(`#${field}`).text('Female') : $(`#${field}`).text('Male');
                    break;
                case 'neutered':
                    params[field] === '1' ? $(`#${field}`).text('Yes') : $(`#${field}`).text('No');
                    break;
                case 'birthday':
                    const date = params[field];
                    if (date) {
                        const [year, month, day] = date.split('-');
                        const formattedDate = `${day}.${month}.${year}`;
                        $(`#${field}`).text(formattedDate);
                        $('#age').text(calculateAge(formattedDate) || 'Unknown');
                    } else {
                        $(`#${field}`).text('Unknown');
                        $('#age').text('Unknown');
                    }
                    break;
                default:
                    $(`#${field}`).text(params[field] || 'Unknown');
            }
        } else {
            // If parameter is null hide the complete row
            $(`#${field}`).closest('tr').hide();
        }
    });

    // Pass current GET parameters to edit page
    $('#edit-button').attr('href', `edit.html${window.location.search}`);
});
