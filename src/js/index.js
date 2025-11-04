import { decodeUrlParams, calculateAge } from './main.js';

document.addEventListener('DOMContentLoaded', function () {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const params = decodeUrlParams(urlParams);
    console.log(params);

    // Populate the fields with decoded parameters
    document.getElementById('name').textContent = params.name || 'Unknown';
    document.getElementById('breed').textContent = params.breed || 'Unknown';
    document.getElementById('birthday').textContent = params.birthday || 'Unknown';
    document.getElementById('age').textContent = calculateAge(params.birthday);

    // Pass current GET parameters to edit page
    const editLink = document.getElementById('editLink');
    editLink.href = `edit.html${window.location.search}`;
});