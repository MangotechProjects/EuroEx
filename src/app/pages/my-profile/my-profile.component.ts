import { validateVerticalPosition } from '@angular/cdk/overlay';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EuroExService } from 'src/app/euro-ex.service';
import { Subject } from 'rxjs';
import * as $ from "jquery";
//import 'jquery-ui';
import { MatStepper } from '@angular/material/stepper';
//import { getDate } from 'date-fns';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';



import Swal from 'sweetalert2'; 

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit {
  form: FormGroup;
  user_login: FormGroup;
  user_register: FormGroup;
  currentSection = 'home';
  isLocalSotrage: any;
  isLocalSotrageToken : any;
  isLocalSotrageAccID : any;
  isLocalStorageUserID: any;
  isLocalSotrageUserName : any = localStorage.getItem("UserName");
  isLocalSotrageSenderID : any = localStorage.getItem("SenderID");
  isLocalSotrageUserID : any = localStorage.getItem("UserID");

 
  
  year: number = new Date().getFullYear();

  



  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {FormBuilder} _formBuilder
   *  */
  constructor(
    private _formBuilder: FormBuilder,
    private EuroEX: EuroExService,
    private router: Router,
    private modalService: NgbModal
  ) { 
    this._unsubscribeAll = new Subject(); 
  }

  ngOnInit(): void {
   

    this.getoken();

    this.getUserData();
    
    this.form = this._formBuilder.group({
      FirstName: ['', Validators.required],
      SecondName: [''],
      LastName: ['', Validators.required],
      Nationality: ['', Validators.required],
      NIC: ['', Validators.required],
      Phone1: ['', Validators.required],
      Phone2: [''],
      Mobile1: ['', Validators.required],
      Mobile2: [''],
      Address1: ['', Validators.required],
      Address2: [''],
    });
  
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
    /**
   * Window scroll method
   */
  windowScroll() {
    const navbar = document.getElementById('navbar');
    if (document.body.scrollTop >= 50 || document.documentElement.scrollTop > 50) {
      navbar.classList.add('nav-sticky');
    } else {
      navbar.classList.remove('nav-sticky');
    }
  }
    /**
   * Section changed method
   * @param sectionId specify the current sectionID
   */
  onSectionChange(sectionId: string) {
    this.currentSection = sectionId;
  }

  /**
   * Toggle navbar
   */
  toggleMenu() {
    document.getElementById('navbarCollapse').classList.toggle('show');
  }
   /**
   * Login modal
   */
  loginModal(content) {
    this.closeModal();
    this.modalService.open(content, { centered: true });
  }

  /**
   * Register modal
   * @param registercontent content
   */
  registerModal(registercontent) {
    this.closeModal();
    this.modalService.open(registercontent, { centered: true });
  }

  //logout
  logout() 
  {
    localStorage.removeItem('token');
    localStorage.removeItem('UserName');
    localStorage.removeItem("AccountID");
    localStorage.removeItem("SenderID");
    localStorage.removeItem("UserID");
    this.router.navigate(['']);
  }
  //login
  loginform() 
  {
    var Name = this.user_login.value['name'];
    var Password = this.user_login.value['password'];

    // var data = [{Name:Name,Password:Password}];
    //console.warn(Name,Password);

    this.EuroEX.userSignIn(Name,Password).subscribe((result: any) => {

        if (result.access_token != null) {

          localStorage.setItem("token",result.access_token); 
          localStorage.setItem("UserName", result.userName);
          localStorage.setItem("AccountID", result.AccountID);
          localStorage.setItem("SenderID", result.SenderID);
          localStorage.setItem("UserID", result.UserID);
          this.isLocalSotrageUserName = localStorage.getItem("UserName");
          this.isLocalSotrageToken = localStorage.getItem("token");
          this.isLocalSotrageAccID = localStorage.getItem("AccountID");
          this.isLocalSotrageSenderID = localStorage.getItem("SenderID");
          this.isLocalStorageUserID = localStorage.getItem("UserID");
          this.closeModal();
          this.router.navigate(['']);

        }
        else 
        {
             //alert("Some error occured");
             Swal.fire('', 'Some error occured', 'error')
        } 

    }, (error: HttpErrorResponse) => {
            if (error['status'] == 400) {
                //alert(error['error']['error_description']);
                Swal.fire('', error['error']['error_description'], 'error')
            }
            else {
               //alert("Server is not responding!")
               Swal.fire('', 'Server is not responding!', 'error')
            }
    });
  }

  closeModal()
  {
    this.modalService.dismissAll();
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

    this.EuroEX.userSignUp(Name,Email,Cell,Password,CPassword).subscribe((result: any) => {
      //console.log(result);
      if(result == null){
        this.closeModal();
        Swal.fire('', 'Registration Successfull', 'success')
        this.router.navigate(['']);
      }
      else{
        //alert("Some error occured");
        Swal.fire('', 'Some error occured', 'error')
      }
    }, (error: HttpErrorResponse) => {
      //console.log(error);
      if (error['status'] == 400) 
      {
        Swal.fire('', 'The request is invalid', 'error')
      }
      else 
      {
        //alert("Server is not responding!")
        Swal.fire('', 'Server is not responding!', 'error')
      }
    });
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
      //alert('Please Login In Order To Create Shipment');
      Swal.fire('', 'Please login', 'error')
    }
  }

  home()
  {
    //this.router.navigate(['/']);
    window.location.href ='/';
  }

  about()
  {
    this.router.navigate(['about-us']);
  }
  
  solutionService()
  {
    this.router.navigate(['solution-services']);
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
      //alert('Please Login In Order To Create Shipment');
      Swal.fire('', 'Please login', 'error')
    }
  }

  getoken()
  {
    this.isLocalSotrageUserName = localStorage.getItem("UserName");
    this.isLocalSotrageToken = localStorage.getItem("token");
    this.isLocalSotrageAccID = localStorage.getItem("AccountID");
    this.isLocalSotrageSenderID = localStorage.getItem("SenderID");
    //console.log(this.isLocalSotrageAccID)
  }

  password_toggle(password: any): any 
  {
    password.type = password.type === 'password' ? 'text' : 'password';
  }

  cpassword_toggle(cpassword: any): any 
  {
    cpassword.type = cpassword.type === 'password' ? 'text' : 'password';
  }

  login_password_toggle(login_password: any): any 
  {
    login_password.type = login_password.type === 'password' ? 'text' : 'password';
  }

  editProfile()
  {
    var firstName = this.form.value['FirstName'];
    var secondName = this.form.value['SecondName'];
    var lastName = this.form.value['LastName'];
    var nationality = this.form.value['Nationality'];
    var nic = this.form.value['NIC'];
    var phone1 = this.form.value['Phone1'];
    var phone2 = this.form.value['Phone2'];
    var mobile1 = this.form.value['Mobile1'];
    var mobile2 = this.form.value['Mobile2'];
    var address1 = this.form.value['Address1'];
    var address2 = this.form.value['Address2'];

    //console.log(this.form.value['FirstName']);
    // console.log(this.form.value['SecondName']);
    // console.log(this.form.value['LastName']);
    // console.log(this.form.value['Nationality']);
    // console.log(this.form.value['NIC']);
    // console.log(this.form.value['Phone1']);
    // console.log(this.form.value['Phone2']);
    // console.log(this.form.value['Mobile1']);
    // console.log(this.form.value['Mobile2']);
    // console.log(this.form.value['Address1']);
    // console.log(this.form.value['Address2']);

    if(firstName != '' && lastName != '' && nationality != '' && nic != '' && phone1 != '' && mobile1 != '' && address1 != '')
    {
      this.EuroEX.UpdateUserProfile(firstName,secondName,lastName,nationality,nic,phone1,phone2,mobile1,mobile2,address1,address2).subscribe((result: any) => { 
        if(result.ResponseCode == 200 && result.Status == true)
        {
          Swal.fire('', result.Message, 'success');
          //window.location.reload();
        }
       },(error: HttpErrorResponse) => {
        Swal.fire('', 'Something went wrong', 'error')
      });
    }
     
  }

  getUserData() {
    this.EuroEX.RegisteredUsersProfileInfo(this.isLocalSotrageUserID).subscribe((result: any) => { 
      if (result.ResponseCode == 200 && result.Status == true) { 
        this.form.controls['FirstName'].setValue(result.Data.FirstName);
        this.form.controls['SecondName'].setValue(result.Data.SecondName);
        this.form.controls['LastName'].setValue(result.Data.LastName);
        this.form.controls['Nationality'].setValue(result.Data.Nationality);
        this.form.controls['NIC'].setValue(result.Data.NIC);
        this.form.controls['Phone1'].setValue(result.Data.Phone1);
        this.form.controls['Phone2'].setValue(result.Data.Phone2);
        this.form.controls['Mobile1'].setValue(result.Data.Mobile1);
        this.form.controls['Mobile2'].setValue(result.Data.Mobile2);
        this.form.controls['Address1'].setValue(result.Data.Address1);
        this.form.controls['Address2'].setValue(result.Data.Address2);
      }
    }, (error: HttpErrorResponse) => {
      Swal.fire('', 'Something went wrong', 'error');
    });
  }
}
