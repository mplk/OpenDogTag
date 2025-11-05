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
