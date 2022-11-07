import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomersService } from 'src/app/services/customers.service';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.css']
})
export class CustomerDetailsComponent implements OnInit {

  customer:any;
  currContract:any;
  customerAddressForm:any;
  isEnableEditing:boolean = false;

  constructor(private router:Router, private formBuilder:FormBuilder, private customersService:CustomersService) {}



  ngOnInit(): void {
    debugger;
    if(this.customersService.isLoggedIn){
      this.customersService.getCustomerDetails(this.customersService.currCustomer).subscribe({
        next: (customer:any)=>{
          if(customer){
            this.customer = customer;
            this.customerAddressForm = this.formBuilder.group({
              firstName: [this.customer.firstName, Validators.compose([Validators.required])],
              lastName: [this.customer.lastName, Validators.compose([Validators.required])],
              idNumber: [this.customer.idNumber, Validators.compose([Validators.required])],
              city: [this.customer.address.city, Validators.compose([Validators.required])],
              street: [this.customer.address.street, Validators.compose([Validators.required])],
              number: [this.customer.address.number, Validators.compose([Validators.required])],
              zipCode: [this.customer.address.zipCode, Validators.compose([Validators.required])]
            })
          }
        },
        error: (error:any)=>{
          this.router.navigate([''])
        }
      })
      }
  }

  openContractDetails(contractId:String){
    const contract = this.customer.contractList.find((con: any) => con.contractId == contractId);
    if(this.currContract == contract)
      this.currContract = undefined;
    else
      this.currContract = contract;
  }

  onSubmit(){
    if(this.customerAddressForm.invalid) return;

    const controls = this.customerAddressForm.controls;
    const id = controls.idNumber.value;

    const address = {
      city: controls.city.value,
      street: controls.street.value,
      number: controls.number.value,
      zipCode: controls.zipCode.value,
    }

    this.customersService.updateCustomerAddress(address, id).subscribe((data:any)=>{
       this.isEnableEditing = false;
    })
  }

}
