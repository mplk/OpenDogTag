import '../scss/styles.scss';

import LZString from 'lz-string';

const delimiter = '~';
export const fields = ['name', 'sex', 'neutered', 'birthday', 'breed', 'height', 'weight', 'character', 'specialAttributes', 'chipId', 'chipLocation', 'tassoId', 'insuranceId', 'taxId'];

export function decodeUrlParams(urlParams) {
    const dataParameter = urlParams.get('d');
    const decodedParameters = LZString.decompressFromEncodedURIComponent(dataParameter);
    const dataArr = decodedParameters ? decodedParameters.split(delimiter) : [];

    const data = {};
    fields.forEach((field, index) => {
        data[field] = dataArr[index] || null;
    });

    return data;
}

export function encodeUrlParams(params) {
    const dataArr = fields.map(field => params[field] || '');
    const d = dataArr.join(delimiter);

    const urlParams = new URLSearchParams();
    const encoded = LZString.compressToEncodedURIComponent(d);
    urlParams.set('d', encoded);

    return urlParams.toString();
}

export function calculateAge(birthday) {
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

