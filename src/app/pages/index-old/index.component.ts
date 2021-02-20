import { Component, OnInit, Inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EuroExService } from 'src/app/euro-ex.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface DialogData {
 TrkID:any
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
  currentSection = 'home';
  isLocalSotrageUserName : any;
  isLocalSotrageToken : any;
  isLocalSotrageAccID : any;
  isLocalSotrageSenderID : any;
  trackShipmentForm: FormGroup;


  constructor(private modalService: NgbModal,private EuroEx: EuroExService,private _formBuilder: FormBuilder,private router: Router,public dialog: MatDialog,) { }

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

    this.getoken();
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
          this.isLocalSotrageUserName = localStorage.getItem("UserName");
          this.isLocalSotrageToken = localStorage.getItem("token");
          this.isLocalSotrageAccID = localStorage.getItem("AccountID");
          this.isLocalSotrageSenderID = localStorage.getItem("SenderID");
          this.closeModal();
          this.router.navigate(['']);

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

  // track shipment method
  // submitData()
  // { 
  //   //console.log(this.rateCalculatorForm.value);
    
  //     var trkNumber = this.trackShipmentForm.value['trkNumber'];
     
  //     this.EuroEx.TrackShipment(trkNumber).subscribe((result: any) => {
  //       console.log(result);
  //       if (result.ResponseCode == 200 && result.Status == true) 
  //       {
  //         //this.trackship(result.Data[0].SailingStatus);
  //         this.modalService.open(result.Data[0].SailingStatus, { centered: true });
  //         //alert("Your Shipment Status Is: "+result.Data[0].SailingStatus);
  //       }
  //       else 
  //       {
  //         alert("Invalid Tracking Number");
  //       }
    
  //     }, (error: HttpErrorResponse) => {
  //       console.log(error);
  //     });
  // }

  trackship(registercontent)
  {
    this.modalService.open(registercontent, { centered: true });
    //alert(status);
  }

  about()
  {
    this.router.navigate(['/about-us']);
  }

  getoken()
  {
    this.isLocalSotrageUserName = localStorage.getItem("UserName");
    this.isLocalSotrageToken = localStorage.getItem("token");
    this.isLocalSotrageAccID = localStorage.getItem("AccountID");
    this.isLocalSotrageSenderID = localStorage.getItem("SenderID");
  }


  openDialog(): void {
    var trkNumber = this.trackShipmentForm.value['trkNumber'];
    
    const dialogRef = this.dialog.open(AssignShipmentWithWeightDialog, {
      width: '500px',
      data: {TrkID: trkNumber}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      //this.ShipmentID = result;
    });
  }
}

@Component({
  selector: 'AssignShipmentWithWeightDialog',
  templateUrl: 'AssignShipmentWithWeightDialog.html',
})
export class AssignShipmentWithWeightDialog   implements OnInit 
{
  trackShipmentForm: FormGroup;
  list: [];

  constructor(
    private modalService: NgbModal,
    private EuroEx: EuroExService,
    private _formBuilder: FormBuilder,
    private router: Router,
    private dialogRef1: MatDialogRef<AssignShipmentWithWeightDialog>,
    @Inject(MAT_DIALOG_DATA) public data1: DialogData) { }


  ngOnInit(): void {
    this.trackShipmentForm = this._formBuilder.group({
     
      trkNumber: ['', Validators.required],
      
    
    });
     this.Modal();
  }

  Modal()
  {
    this.EuroEx.TrackShipment(this.data1).subscribe((result: any) => {
      console.log(result);
      this.list = result;
    });
  }
}
