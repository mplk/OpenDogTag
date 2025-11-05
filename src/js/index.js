import $ from 'jquery';
import { fields, decodeUrlParams, calculateAge } from './common.js';
import '@fortawesome/fontawesome-free/css/all.css';


$(function () {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const params = decodeUrlParams(urlParams);
    console.log(params);

    // Populate the fields with decoded parameters
    fields.forEach(field => {
        if(params[field]) {
            switch (field) {
                // TODO: improve formatting for address fields
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

    // Hide cards that have no visible rows
    $('.card').each(function() {
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
            const $notes = $card.find('#notes');
            if ($notes.length > 0 && $notes.text() === '(empty)') {
                $card.hide();
            }
        }
    });

    // Pass current GET parameters to edit page
    $('#edit-button').attr('href', `edit.html${window.location.search}`);
});
