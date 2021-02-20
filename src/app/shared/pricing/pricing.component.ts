import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { EuroExService } from 'src/app/euro-ex.service';
import { HttpErrorResponse } from '@angular/common/http';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss']
})
export class PricingComponent implements OnInit {
  user_login: FormGroup;
  user_register: FormGroup;
  isLocalSotrageToken : any;
  isLocalSotrageUserName : any;
  isLocalSotrageAccID : any;
  isLocalSotrageSenderID : any;

  constructor(private modalService: NgbModal,private EuroEx: EuroExService,private _formBuilder: FormBuilder,private router: Router) { }

  ngOnInit(): void {
    this.user_login = this._formBuilder.group({
      name: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.user_register = this._formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required,Validators.email]],
      cell: ['', [Validators.required, Validators.maxLength(11)]],
      password: ['', Validators.required],
      cpassword: ['', Validators.required]
    });
    this.getoken();
  }

  addShipAuth()
  {
    this.isLocalSotrageToken = localStorage.getItem("token");
    if(this.isLocalSotrageToken != null)
    {
      this.router.navigate(['/add-shipment']);
    }
    else
    {
      Swal.fire('', 'Please login', 'error')
      //alert('Please Login In Order To Create Shipment');
    }
  }
  myShipAuth()
  {
    this.isLocalSotrageToken = localStorage.getItem("token");
    if(this.isLocalSotrageToken != null)
    {
      this.router.navigate(['/my-shipment']);
    }
    else
    {
      Swal.fire('', 'Please login', 'error')
      //alert('Please Login In Order To View Shipment');
    }
  }
  loginModal(content) {
    this.closeModal();
    this.modalService.open(content, { centered: true });
  }
  registerModal(registercontent) {
    this.closeModal();
    this.modalService.open(registercontent, { centered: true });
  } 
  closeModal()
  {
    this.modalService.dismissAll();
  }
  loginform() 
  {
    var Name = this.user_login.value['name'];
    var Password = this.user_login.value['password'];

    // var data = [{Name:Name,Password:Password}];
    //console.warn(Name,Password);

    this.EuroEx.userSignIn(Name,Password).subscribe((result: any) => {

        if (result.access_token != null) {
          console.log(result);
          localStorage.setItem("token",result.access_token); 
          localStorage.setItem("UserName", result.userName);
          localStorage.setItem("AccountID", result.AccountID);
          localStorage.setItem("SenderID", result.SenderID);
          this.isLocalSotrageUserName = localStorage.getItem("UserName");
          this.isLocalSotrageToken = localStorage.getItem("token");
          this.isLocalSotrageAccID = localStorage.getItem("AccountID");
          this.isLocalSotrageSenderID = localStorage.getItem("SenderID");
          this.closeModal();
          //this.router.navigate(['']);
          window.location.reload();
        }
        else 
        {
            alert("Some error occured");
        } 

    }, (error: HttpErrorResponse) => {
            if (error['status'] == 400) {
                alert(error['error']['error_description']);
            }
            else {
                alert("Server is not responding!")
            }
    });
  }

  //register
  registerform() 
  {
    var Name = this.user_register.value['name'];
    var Email = this.user_register.value['email'];
    var Cell = this.user_register.value['cell'];
    var Password = this.user_register.value['password'];
    var CPassword = this.user_register.value['cpassword'];

    //var data = [{Name:Name,Email:Email,Cell:Cell,Password:Password,CPassword:CPassword}];
    //console.warn(data);

    this.EuroEx.userSignUp(Name,Email,Cell,Password,CPassword).subscribe((result: any) => {
      //console.log(result);
      if(result == null){
        this.closeModal();
        alert("Registration Successfull");
        this.router.navigate(['']);
      }
      else{
        alert("Some error occured");
      }
    }, (error: HttpErrorResponse) => {
      console.log(error);
    });
  }

  getoken()
  {
    this.isLocalSotrageUserName = localStorage.getItem("UserName");
    this.isLocalSotrageToken = localStorage.getItem("token");
    this.isLocalSotrageAccID = localStorage.getItem("AccountID");
    this.isLocalSotrageSenderID = localStorage.getItem("SenderID");
  }
}
