const retries: number = 5;  // What does VS Code show?
const user = { email: "john@test.com", password: "123456" };  // What does VS Code show?
console.log(user.password);      // What does VS Code show?

function getTimeout(seconds: number): number {
    return seconds * 1000;  // Hint: look at the return type
}

const config = { baseURL: "https://staging.example.com" };
console.log(config.baseURL);  // Hint: case matters

function printName(name: string) {
    console.log(name);
}
const userName: string | undefined = undefined;
if (userName) {
    printName(userName);
} else {
    console.log("userName is undefined");
}

type Product = { name: string; price: number; inStock: boolean };

const laptop: Product = { name: "MacBook Pro", price: 1200, inStock: true };
const phone: Product = { name: "iPhone", price: 800, inStock: false };

function formatPrice(price: number): string {
    return `$${price.toFixed(2)}`;
}

console.log(formatPrice(laptop.price));  // Hint: look at the function signature
console.log(formatPrice(phone.price));   // Hint: look at the function signature