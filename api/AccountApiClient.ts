import { APIRequestContext } from '@playwright/test';
import { testData } from '../test-data/testData';

export class AccountApiClient {
    constructor(private request: APIRequestContext) { }

    async createAccount(name: string, email: string, password: string) {
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
}