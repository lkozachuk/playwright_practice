export function generateRandomEmail(): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    let localPart = '';
    for (let i = 0; i < 12; i++) {
        localPart += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `${localPart}@test.com`;
}