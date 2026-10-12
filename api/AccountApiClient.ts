import { APIRequestContext } from '@playwright/test';
import { testData } from '../test-data/testData';
import {
    ApiResponse, DeleteAccountResponse, VerifyLoginResponse, UpdateAccountRequest, UpdateAccountResponse,
    GetUserDetailResponse
} from '../models/Account';

export class AccountApiClient {
    constructor(private request: APIRequestContext) { }

    async createAccount(name: string, email: string, password: string): Promise<ApiResponse> {
        const response = await this.request.post('https://automationexercise.com/api/createAccount', {
            form: {
                name,
                email,
                password,
                title: 'Mr',
                birth_date: testData.signUp.birthDay,
                birth_month: testData.signUp.birthMonth,
                birth_year: testData.signUp.birthYear,
                firstname: testData.signUp.firstName,
                lastname: testData.signUp.lastName,
                company: testData.signUp.companyName,
                address1: testData.signUp.address,
                address2: '',
                country: testData.signUp.country,
                zipcode: testData.signUp.zipCode,
                state: testData.signUp.state,
                city: testData.signUp.city,
                mobile_number: testData.signUp.mobileNumber,
            },
        });
        return response.json();
    }

    async deleteAccount(email: string, password: string): Promise<DeleteAccountResponse> {
        const response = await this.request.delete('https://automationexercise.com/api/deleteAccount', {
            form: { email, password },
        });
        return response.json();
    }

    async verifyLogin(email: string, password: string): Promise<VerifyLoginResponse> {
        const response = await this.request.post('https://automationexercise.com/api/verifyLogin', {
            form: { email, password },
        });
        return response.json();
    }

    async updateAccount(data: UpdateAccountRequest): Promise<UpdateAccountResponse> {
        const response = await this.request.put('https://automationexercise.com/api/updateAccount', {
            form: { ...data },
        });
        return response.json();
    }

    async getUserDetailByEmail(email: string): Promise<GetUserDetailResponse> {
        const response = await this.request.get('https://automationexercise.com/api/getUserDetailByEmail', {
            params: { email },
        });
        return response.json();
    }
}