//Código de 3 letras y 3 números para los productos
export function generateMixedCode() {
    const randomNumber = Math.floor(Math.random() * 1000);
    const formattedNumber = (randomNumber.toString().padStart(3, '0'));

    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    const firstLetter = alphabet[Math.floor(Math.random() * 26)];
    const secondLetter = alphabet[Math.floor(Math.random() * 26)];
    const thirdLetter = alphabet[Math.floor(Math.random() * 26)];

    // Combine the formatted number and letters to obtain the mixed code
    const mixedCode = firstLetter + secondLetter + thirdLetter + formattedNumber;
    return mixedCode;
}
//Código random para los tickets
export function ticketCode() {
    const ticketCode= generateMixedCode() + '-' + generateMixedCode() + '-' + generateMixedCode() + '-' + generateMixedCode()
    return ticketCode
}
//Código ResetToken
export function generateResetToken(){
    const token = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
    return token.toString();
}
