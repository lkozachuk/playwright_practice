import { testData } from '../test-data/testData';
import { generateRandomEmail } from '../utils/random';
import { CreateAccountRequest } from '../models/Account';

/**
 * Builds a complete CreateAccountRequest (also used for updateAccount, since
 * UpdateAccountRequest is a type alias of CreateAccountRequest) using sensible
 * defaults from testData, with an always-fresh random email unless overridden.
 *
 * Pass only the fields a specific test cares about via `overrides` - every
 * other field is filled in automatically.
 */
export function buildAccount(overrides: Partial<CreateAccountRequest> = {}): CreateAccountRequest {
    return {
        name: 'Test',
        email: generateRandomEmail(),
        password: testData.signUp.password,
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
        ...overrides,
    };
}