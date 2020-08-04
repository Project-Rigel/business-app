import { Injectable } from '@angular/core';
import { AbstractControl, ValidatorFn } from '@angular/forms';
import libphonenumber from 'google-libphonenumber';

@Injectable({
  providedIn: 'root',
})
export class PhoneValidatorService {
  static validCountryPhone = (country: string): ValidatorFn => {
    let subscribe: boolean = false;

    return (phoneControl: AbstractControl): { [key: string]: boolean } => {
      if (phoneControl.value !== '') {
        try {
          const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();
          let phoneNumber = '' + phoneControl.value + '';
          let number = phoneUtil.parse(phoneNumber, country);
          let isValidNumber = phoneUtil.isValidNumber(number);
          if (isValidNumber) {
            return null;
          }
        } catch (err) {
          return {
            validCountryPhone: true,
          };
        }
        return {
          validCountryPhone: true,
        };
      } else {
        return null;
      }
    };
  };
}
