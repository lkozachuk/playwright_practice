// API 11: POST to createAccount — Response Code: 201, Message: "User created!"
export interface CreateAccountRequest {
    name: string;
    email: string;
    password: string;
    title: string; // e.g. "Mr", "Mrs", "Miss"
    birth_date: string;
    birth_month: string;
    birth_year: string;
    firstname: string;
    lastname: string;
    company: string;
    address1: string;
    address2: string;
    country: string;
    zipcode: string;
    state: string;
    city: string;
    mobile_number: string;
}

// API 14: GET user detail by email
export interface UserDetail {
    id: number;
    name: string;
    email: string;
    title: string; // e.g. "Mr", "Mrs", "Miss"
    birth_day: string;
    birth_month: string;
    birth_year: string;
    first_name: string;
    last_name: string;
    company: string;
    address1: string;
    address2: string;
    country: string;
    state: string;
    city: string;
    zipcode: string;
}

export interface DeleteAccountRequest {
    email: string;
    password: string;
}

export interface ApiResponse {
    responseCode: number;
    message: string;
}

// API 7 / API 10: POST to verifyLogin
// Valid details   -> responseCode: 200, message: "User exists!"
// Invalid details -> responseCode: 404, message: "User not found!"
export type VerifyLoginResponse = ApiResponse;

// API 12: DELETE to deleteAccount — Response Code: 200, Message: "Account deleted!"
export type DeleteAccountResponse = ApiResponse;

// API 13: PUT to updateAccount — same request shape as create, plus the account's
// email/password are required to locate and authorize the update.
export type UpdateAccountRequest = CreateAccountRequest;
export type UpdateAccountResponse = ApiResponse;

export interface GetUserDetailResponse extends ApiResponse {
    user: UserDetail;
}