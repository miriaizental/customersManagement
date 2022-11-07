import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {

  constructor(private http:HttpClient) { 
    if(this.getWithExpiry(this.localStorageKey)){
      this.isLoggedIn = true;
      this.currCustomer = this.getWithExpiry(this.localStorageKey)
    }
  }
  currCustomer:any;
  isLoggedIn:boolean = false
  localStorageKey = 'logIn'

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

  getCurrentCustomer(){
    return this.currCustomer;
  }

  logIn(cus:any){
    if(cus){
      this.setWithExpiry(this.localStorageKey, cus.idNumber);
      this.currCustomer = cus;
      this.isLoggedIn = true;
    }
  }

  logOut(){
    localStorage.clear();
  }

  setWithExpiry(key:string, value:string) {
    const now = new Date()
    const ttl = 300000
  
    // `item` is an object which contains the original value
    // as well as the time when it's supposed to expire
    const item = {
      value: value,
      expiry: now.getTime() + ttl
    }
    localStorage.setItem(key, JSON.stringify(item))
  }

  getWithExpiry(key:string) {
    const itemStr = localStorage.getItem(key)
    // if the item doesn't exist, return null
    if (!itemStr) {
      return null
    }
    const item = JSON.parse(itemStr)
    const now = new Date()
    // compare the expiry time of the item with the current time
    if (now.getTime() > item.expiry) {
       //If the item is expired, delete the item from storage
       //and return null
      localStorage.removeItem(key)
      return null
    }
    return item.value
  }

}
