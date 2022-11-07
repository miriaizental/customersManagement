import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomersService } from './services/customers.service';
import { IdValidatorService } from './services/id-validator.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'customersManagment';

  loginForm:FormGroup
  isSubmitted:boolean
  isLoggedIn:boolean
  localStorageKey = 'logIn'
  loggedInCustomer:any | undefined

  constructor(private formBuilder:FormBuilder, private idValidatorService:IdValidatorService, private customersService: CustomersService){
    this.loginForm = this.formBuilder.group({
      id: ['',Validators.compose([Validators.required, this.idValidatorService.IdValidator()])]
    })

    this.isSubmitted = false
    this.isLoggedIn = false
  }

  ngOnInit() {
    const loggedIn = this.getWithExpiry(this.localStorageKey);
    if(loggedIn)
      this.customersService.getCustomerDetails(loggedIn).subscribe((customer:any)=>{
        if(customer){
          this.isLoggedIn = true;
          this.loggedInCustomer = customer;
        }
      })
  }

  onSubmit(){
    this.isSubmitted = true;

    if (this.loginForm && this.loginForm.invalid) {
      return;
    }

    const id = this.loginForm.controls.id.value;

    this.customersService.getCustomerDetails(id).subscribe({
      next: (customer:any)=>{
        if(customer){
          this.isLoggedIn = true;
          this.loggedInCustomer = customer;
          this.setWithExpiry(this.localStorageKey, id)
        }
      },
      error: (error:any)=>{
          this.loginForm.controls.id.setErrors({idDoesNotExist:"תעודת זהות זו אינה קיימת במאגר הלקוחות"});
      }
    })

    localStorage.setItem('userId', this.loginForm.controls.id.value)
  }

  logOut(){
    localStorage.clear();
    this.isLoggedIn = false;
    this.loggedInCustomer = undefined;
    this.loginForm.controls.id.setValue("");
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
