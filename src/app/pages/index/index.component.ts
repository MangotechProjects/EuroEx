import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { EuroExService } from 'src/app/euro-ex.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {TranslateService} from '@ngx-translate/core';
import * as $ from "jquery";



import Swal from 'sweetalert2';

export interface DialogData {
  //animal: 'panda' | 'unicorn' | 'lion';
  trkNumber: any;
}

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})

/**
 * Index-1 component
 */
export class IndexComponent implements OnInit {
  user_login: FormGroup;
  user_register: FormGroup;
  trackShipmentForm: FormGroup;
  forgotPasswordForm: FormGroup;
  currentSection = 'home';
  isLocalSotrageUserName : any;
  isLocalSotrageToken : any;
  isLocalSotrageAccID : any;
  isLocalSotrageSenderID : any;
  isLocalStorageUserID: any;
  msg : any;
  ConnectionID : number;
  // ShipmentStatus:[];


  

  constructor(public translate: TranslateService,private modalService: NgbModal,private EuroEx: EuroExService,private _formBuilder: FormBuilder,private router: Router,public dialog: MatDialog) 
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

    this.trackShipmentForm = this._formBuilder.group({
     
      trkNumber: ['', Validators.required],
      
    
    });

    this.forgotPasswordForm = this._formBuilder.group({
      useremail: ['', [Validators.required, Validators.email]]
    });

    this.getoken();
    this.chatinit();
    this.getCurrencyList();

    this.getConnectionID();
    setInterval(() => {
      this.getmessages(); 
      }, 3000);
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

  /**
   * Register modal
   * @param registercontent content
   */
  forgotPasswordModal(forgotpasswordcontent) {
    this.closeModal();
    this.modalService.open(forgotpasswordcontent, { centered: true });
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
          //console.log(result);
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

  // submitData()
  // { 
  //    //console.log(this.rateCalculatorForm.value);
    
  //     var trkNumber = this.trackShipmentForm.value['trkNumber'];
     
      // this.EuroEx.TrackShipment(trkNumber).subscribe((result: any) => {
      //   console.log(result);
      //   if (result.ResponseCode == 200 && result.Status == true) 
      //   {
      //     alert("Your Shipment Status Is: "+result.Data[0].SailingStatus);
      //   }
      //   else 
      //   {
      //     alert("Invalid Tracking Number");
      //   }
    
      // }, (error: HttpErrorResponse) => {
      //   console.log(error);
      // });
  // }

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
  openDialog() {
    var trkNumber = this.trackShipmentForm.value['trkNumber'];
    if(trkNumber == '')
    {
      Swal.fire('', 'Invalid Tracking Number', 'error')
    }
    else
    {
      this.dialog.open(DialogDataExampleDialog, {
        data: {
          //animal: 'panda'
          trkNumber: trkNumber
        }
      });
    }
    
  }

  myprofile()
  {
    this.router.navigate(['my-profile']);
  }

  getmessages (){

    if(this.ConnectionID>0){
      this.EuroEx.GetClientMsgsConnectionIDWise(this.ConnectionID).subscribe((result: any) => {
        //console.log(result);
        if (result.ResponseCode == 200 && result.Status == true) {
          if(result.Data!=null){
           // this.ConnectionID = result.Data[0].ConnectionID;
            $(".chat-logs").html('');
            result.Data[0].Msgs.forEach(element => {

              if(element.UserTypeID == 1){
                this.generate_message(element.Message,element.SequenceID,'self');
              }
              else{
                this.generate_message(element.Message,element.SequenceID,'user');
              }
             
            });

          } 
         
        }
        else {
          this.ConnectionID = 0;
          alert("Some error occured");
        }
  
      }, (error: HttpErrorResponse) => {
        //console.log(error);
      });
    }
   
  }

  chatinit()
  {
    $(() =>{


        $("#chat-submit").on('click', (event: JQuery.Event) => {
          event.preventDefault();
        this.sendData();
        $("#chat-input").val(''); 
      })
      
        $("#chat-circle").on('click', (event: JQuery.Event) => {    
        $("#chat-circle").toggle();
        $(".chat-box").toggle();
      })
      
        $("#chat-box-toggle").on('click', (event: JQuery.Event) => { 
        $("#chat-circle").toggle();
        $(".chat-box").toggle();
      })
      
    })
  }

  closechat()
  {
    document.getElementById('chat-circle').style.display =  'block';
    document.getElementById('chat-box').style.display =  'none';
  }

  //for chat msg
  getConnectionID (){
    this.EuroEx.GetConnectionID().subscribe((result: any) => {
      //console.log(result);
      if (result.ResponseCode == 200 && result.Status == true) {
        this.ConnectionID = result.Data;
       
      }
      else {
        this.ConnectionID = 0;
        alert("Some error occured");
      }

    }, (error: HttpErrorResponse) => {
      //console.log(error);
    });
  }
  sendData(){
    var chatText = $("#chat-input").val();
    if((chatText!=null || chatText!='' ) && this.ConnectionID>0 ){

      var Data = [{Message : chatText,ConnectionID : this.ConnectionID,UserTypeID : 1}];
      this.EuroEx.SendMessageFromClient(Data).subscribe((result: any) => {
        //console.log(result);
        if (result.ResponseCode == 200 && result.Status == true) {
          //console.log(result.Data)
          
          if(result.Data!=null){
          
            this.EuroEx.NotificationAPI().subscribe((result: any) => {
            
            }, (error: HttpErrorResponse) => {
              console.log(error);
            });
          
            // this.ConnectionID = result.Data[0].ConnectionID;
            $(".chat-logs").html('');
            result.Data[0].Msgs.forEach(element => {

              if(element.UserTypeID == 1){
                this.generate_message(element.Message,element.SequenceID,'self');
              }
              else{
                this.generate_message(element.Message,element.SequenceID,'user');
              }
             
            });
          }
        }
        else {
            this.ConnectionID = 0;
            alert("Some error occured");
        }
      }, (error: HttpErrorResponse) => {
        //console.log(error);
      });
    }
  }

  generate_message(msg,seq,usr)
  {
        var str="";

        if(usr == 'self')
        {
          // str += "<div id='cm-msg-"+seq+"' class=\"chat-msg "+usr+"\" style='width:45px;height:45px;border-radius:50%;float:right;'>";
          // str += "<div class=\"cm-msg-text\" style='background: #e9141b;padding:10px 15px 10px 15px;color:white;max-width: 300px;float:right;margin-right:10px;position:relative;margin-bottom:20px;margin-top:20px;border-radius:30px;overflow-wrap: break-word;word-wrap: break-word;hyphens: auto;'>";
          // str += msg;
          // str += "<\/div>";
          // str += "<\/div>";
          str += "<li style='background-color: #e9141b;color: white;font-size: .85em;border-radius: 10px;position: relative;padding: 10px;margin: 1% 0;max-width: 70%;min-width: 10%;float: right;word-wrap: break-word;clear: both;animation: scaler 150ms ease-out;font-weight: 500;list-style-type: none;'>";
          str += msg;
          str += "<\/li>";
        }
        else
        {
          // str += "<div id='cm-msg-"+seq+"' class=\"chat-msg "+usr+"\" style='width:45px;height:45px;border-radius:50%;float:left;'>";
          // str += "<div class=\"cm-msg-text\" style='background:white;padding:10px 15px 10px 15px;color:#666;max-width: 300px;float:left;margin-left:10px;position:relative;margin-bottom:20px;margin-top:20px;border-radius:30px;overflow-wrap: break-word;word-wrap: break-word;hyphens: auto;'>";
          // str += msg;
          // str += "<\/div>";
          // str += "<\/div>";
          str += "<li style='background-color: #ecebfb;color: #666;font-size: .85em;border-radius: 10px;position: relative;padding: 10px;margin: 1% 0;max-width: 70%;min-width: 10%;float: left;word-wrap: break-word;clear: both;animation: scaler 150ms ease-out;font-weight: 500;list-style-type: none;'>";
          str += msg;
          str += "<\/li>";
        }

        str += "<br>";
        str += "<br>";
        str += "<br>";
        

        $(".chat-logs").append(str);  
        $(".chat-logs").stop().animate({ scrollTop: $(".chat-logs")[0].scrollHeight}, 1000);
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

  forogotpasswordform() {
        
    var Email = this.forgotPasswordForm.value["useremail"];

    if (Email != null) {
        this.EuroEx.SendForgotPasswordOTPRequest(Email).subscribe((result: any) => {
          
            if (result.ResponseCode == 200 && result.Status == true) {
               //console.log(result.Data)
                if(result.Data[0].code!=null){

                    localStorage.setItem("PasswordResetCode",result.Data[0].code);
                    Swal.fire('Sent', "Password Reset Link Sent To Email", 'success');
               
                }
                else {
                    Swal.fire('Error', "Some error occured. Code Not Generated", 'error');
                  }
             
            }
            else {
              //console.log(result.Data)
              Swal.fire('Error', "Some error occured", 'error');
            }
      
          }, (error: HttpErrorResponse) => {
          
        });
    }
  }

  getCurrencyList(){

    this.EuroEx.GetCurrencyList().subscribe((result: any) => {
          
      if (result.ResponseCode == 200 && result.Status == true) { 
        console.log(result.Data)
      }
      else{

      }

    });

  }

}

@Component({
  selector: 'dialog-data-example-dialog',
  templateUrl: 'dialog-data-example-dialog.html',
})
export class DialogDataExampleDialog {
  FromCountry: any;
  ToCountry:any;
  TrackNumber: any;
  ShipmentStatus:[];
  Sender: any;
  Receiver: any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData,private EuroEx: EuroExService) {}

  ngOnInit(): void {
    this.submitData();
  }
indexNumber :number;
  submitData()
  {
    var trkNumber = this.data.trkNumber;
    this.EuroEx.TrackShipment(trkNumber).subscribe((result: any) => {
      //console.log(result);
      if (result.ResponseCode == 200 && result.Status == true) 
      {
        //console.log(result.Data);
        this.FromCountry = result.Data[0]['FromCountry'];
        this.ToCountry = result.Data[0]['ToCountry'];
        this.TrackNumber = result.Data[0]['TrkNumber'];
        this.ShipmentStatus = result.Data[0].Data;
        this.Sender = result.Data[0].Sender;
        this.Receiver = result.Data[0].Receiver;
        this.indexNumber = this.ShipmentStatus.length;
        //console.log(this.Sender);
      }
      else if(result.ResponseCode == 500 && result.Status == false)
      {
        Swal.fire('', 'Invalid Tracking Number', 'error')
      }
      else 
      {
        //alert("Invalid Tracking Number");
        Swal.fire('', 'Invalid Tracking Number', 'error')
      }
  
    }, (error: HttpErrorResponse) => {
      //console.log(error);
    });
  }
}
