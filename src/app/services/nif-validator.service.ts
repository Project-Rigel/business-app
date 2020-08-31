import { Injectable } from '@angular/core';
import { AbstractControl, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class NifValidatorService {
  static valid_NIF_NIE_CIF = (): ValidatorFn => {
    return (inputControl: AbstractControl): { [key: string]: boolean } => {
      if (inputControl.value !== '') {
        try {
          const nifRegex = /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKE]$/i;
          const nieRegex = /^[XYZ][0-9]{7}[TRWAGMYFPDXBNJZSQVHLCKE]$/i;
          const cifRegex = /^([a-z]|[A-Z]|[0-9])[0-9]{7}([a-z]|[A-Z]|[0-9])/g;

          if (nifRegex.test(inputControl.value.toUpperCase())) {
            let numero = inputControl.value.substr(
              0,
              inputControl.value.length - 1,
            );
            numero = numero.replace('X', 0);
            numero = numero.replace('Y', 1);
            numero = numero.replace('Z', 2);
            const letraDni = inputControl.value.substr(
              inputControl.value.length - 1,
              1,
            );
            numero = numero % 23;
            let letra = 'TRWAGMYFPDXBNJZSQVHLCKET';
            letra = letra.substring(numero, numero + 1);

            if (letra != letraDni) {
              return {
                valid: true,
              };
            } else {
              return null;
            }
          } else if (nieRegex.test(inputControl.value.toUpperCase())) {
            return null;
          } else if (cifRegex.test(inputControl.value.toUpperCase())) {
            return null;
          }
        } catch (err) {
          return {
            valid: true,
          };
        }
        return {
          valid: true,
        };
      } else {
        return null;
      }
    };
  };
}
