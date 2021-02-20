import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EuroExService } from 'src/app/euro-ex.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {TranslateService} from '@ngx-translate/core';



import Swal from 'sweetalert2';

@Component({ 
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  user_login: FormGroup;
  user_register: FormGroup;
  isLocalSotrageUserName : any;
  isLocalSotrageToken : any;
  isLocalSotrageAccID : any;
  isLocalSotrageSenderID : any;
  isLocalStorageUserID: any;
  year: number = new Date().getFullYear();



  


  constructor(public translate: TranslateService,private modalService: NgbModal,private EuroEx: EuroExService,private _formBuilder: FormBuilder,private router: Router) 
  { 
    translate.addLangs(['en', 'ar', 'ch']);
    translate.setDefaultLang('en');

    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/ar|ar/) ? 'ar' : 'en');


  }

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
    window.location.reload();
  }

  //login
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
          localStorage.setItem("UserID", result.UserID);
          this.isLocalSotrageUserName = localStorage.getItem("UserName");
          this.isLocalSotrageToken = localStorage.getItem("token");
          this.isLocalSotrageAccID = localStorage.getItem("AccountID");
          this.isLocalSotrageSenderID = localStorage.getItem("SenderID");
          this.isLocalStorageUserID = localStorage.getItem("UserID");
          this.closeModal();
          this.router.navigate(['about-us']);

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

  myprofile()
  {
    this.router.navigate(['my-profile']);
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

    this.EuroEx.userSignUp(Name,Email,Cell,Password,CPassword).subscribe((result: any) => {
      //console.log(result);
      if(result == null){
        this.closeModal();
        //alert("Registration Successfull");
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
  myShipAuth()
  {
    this.isLocalSotrageToken = localStorage.getItem("token");
    if(this.isLocalSotrageToken != null)
    {
      this.router.navigate(['/my-shipment']);
    }
    else
    {
      //alert('Please Login In Order To View Shipment');
      Swal.fire('', 'Please login', 'error')
    }
  }

  about()
  {
    this.router.navigate(['about-us']);
  }
  
  solutionService()
  {
    this.router.navigate(['solution-services']);
  }

  getoken()
  {
    this.isLocalSotrageUserName = localStorage.getItem("UserName");
    this.isLocalSotrageToken = localStorage.getItem("token");
    this.isLocalSotrageAccID = localStorage.getItem("AccountID");
    this.isLocalSotrageSenderID = localStorage.getItem("SenderID");
  }
  
  home()
  {
    //this.router.navigate(['/']);
    window.location.href ='/';
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
}
