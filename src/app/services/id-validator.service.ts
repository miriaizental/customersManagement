import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class IdValidatorService {

  constructor() { }

  IdValidator() {
    return (control:FormControl):{ [key: string]: any } | null =>{
      const id = control.value.trim();
      return this.is_israeli_id_number(id)? null: { israeliId : 'מספר תעודת זהות לא תקין'};
    }
  }

  is_israeli_id_number(id: any) {

    id = String(id).trim();
    if (id.length > 9 || isNaN(id)) return false;
    id = id.length < 9 ? ("00000000" + id).slice(-9) : id;

    return Array.from(id, Number).reduce((counter, digit, i) => {
      const step = digit * ((i % 2) + 1);
      return counter + (step > 9 ? step - 9 : step);
    }) % 10 === 0;

  }
}
