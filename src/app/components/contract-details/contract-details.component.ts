import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-contract-details',
  templateUrl: './contract-details.component.html',
  styleUrls: ['./contract-details.component.css']
})
export class ContractDetailsComponent implements OnInit {

  @Input() contract:any;
  

  constructor() {
  }

  ngOnInit(): void {
  }

  

}
