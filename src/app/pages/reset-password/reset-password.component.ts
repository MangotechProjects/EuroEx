import { validateVerticalPosition } from '@angular/cdk/overlay';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
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
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {


  resetPasswordForm: FormGroup;

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
    this.resetPasswordForm = this._formBuilder.group({
      password: ['', Validators.required],
      passwordConfirm: ['', [Validators.required, confirmPasswordValidator]]
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


  closeModal()
  {
    this.modalService.dismissAll();
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

  myprofile()
  {
    this.router.navigate(['my-profile']);
  }


  submitData() {
    var OTPCode = localStorage.getItem("PasswordResetCode");
    var Password = this.resetPasswordForm.value["password"];
    //var ConfirmPassword = this.resetPasswordForm.value["passwordConfirm"];
    //console.log("OTPCode-->"+OTPCode);
    if (OTPCode != null) {

        var Data = [{
            OTPCode: OTPCode, Password: Password
        }];
        //console.log("Data-->"+OTPCode);
        this.EuroEX.ResetPasswordRequest(Data).subscribe((result: any) => {

            if (result.ResponseCode == 200 && result.Status == true) {
                Swal.fire('', "Password Reset Successfully!", 'success');
                localStorage.removeItem("PasswordResetCode");
                setTimeout(() => {
                    window.location.href ='/';
                }, 1000);
               
            }
            else {
                localStorage.removeItem("PasswordResetCode");
                Swal.fire('Error', "Some error occured", 'error');
            }

        }, (error: HttpErrorResponse) => {
            console.log("error-->"+error);
        });

    }
  }

}

/**
 * Confirm password validator
 *
 * @param {AbstractControl} control
 * @returns {ValidationErrors | null}
 */
export const confirmPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {

  if (!control.parent || !control) {
      return null;
  }

  const password = control.parent.get('password');
  const passwordConfirm = control.parent.get('passwordConfirm');

  if (!password || !passwordConfirm) {
      return null;
  }

  if (passwordConfirm.value === '') {
      return null;
  }

  if (password.value === passwordConfirm.value) {
      return null;
  }

  return { passwordsNotMatching: true };
};
