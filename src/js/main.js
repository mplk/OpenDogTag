// Import our custom CSS
import '../scss/styles.scss';

import LZString from 'lz-string';

export function decodeUrlParams(urlParams) {
    const d = urlParams.get('d');
    const decoded = LZString.decompressFromEncodedURIComponent(d);
    const data = decoded ? decoded.split('*') : [];

    const name = data[0] || null;
    const breed = data[1] || null;
    const birthday = data[2] || null;

    return { name, breed, birthday };
}

export function encodeUrlParams(params) {
    const data = [
        params.name || '',
        params.breed || '',
        params.birthday || ''
    ];
    const d = data.join('*');

    const urlParams = new URLSearchParams();
    const encoded = LZString.compressToEncodedURIComponent(d);
    urlParams.set('d', encoded);

    return urlParams.toString();
}

export function calculateAge(birthday) {
    // Parse dd.mm.yyyy format
    const parts = birthday.split('.');
    if (parts.length !== 3) return 'Unknown';

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

