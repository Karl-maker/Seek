export function generateRandomPin(digits: number = 5) {
    const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'; // Numeric and uppercase letters
    let pin = '';

    for (let i = 0; i < digits; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        pin += characters.charAt(randomIndex);
    }

    return pin;

}
