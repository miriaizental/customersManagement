import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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

  constructor(private router:Router, private formBuilder:FormBuilder, private idValidatorService:IdValidatorService, private customersService: CustomersService){
    this.loginForm = this.formBuilder.group({
      id: ['',Validators.compose([Validators.required, this.idValidatorService.IdValidator()])]
    })

    this.isSubmitted = false
    this.isLoggedIn = false
  }

  ngOnInit() {
    if(this.customersService.isLoggedIn){
          this.isLoggedIn = true;
          this.router.navigate(['customerDetails'])
    }
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
          this.customersService.logIn(customer);
          this.router.navigate(['customerDetails'])
        }
      },
      error: (error:any)=>{
          this.loginForm.controls.id.setErrors({idDoesNotExist:"תעודת זהות זו אינה קיימת במאגר הלקוחות"});
      }
    })

    localStorage.setItem('userId', this.loginForm.controls.id.value)
  }

  logOut(){
    this.customersService.logOut();
    this.isLoggedIn = false;
    this.loginForm.controls.id.setValue("");
    this.router.navigate([''])
  }
  
}
