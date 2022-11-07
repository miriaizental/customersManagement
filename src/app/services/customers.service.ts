import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {

  constructor(private http:HttpClient) { }

  configUrl = 'https://localhost:4300/api/Customers';
  headers= new HttpHeaders()
    .set('Access-Control-Allow-Origin', '*');

  getCustomerDetails(id:string) {
    const url = `${this.configUrl}/${id}`;
    return this.http.get<any>(url, {headers: this.headers});
  }

  updateCustomerAddress(address:any , id:string) {
    const add = encodeURIComponent(JSON.stringify(address))
    const url = `${this.configUrl}/update?address=${add}&id=${id}`;
    return this.http.post<any>(url, {headers: this.headers});
  }

}
