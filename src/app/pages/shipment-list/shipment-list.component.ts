import { HttpErrorResponse } from '@angular/common/http';
import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { Router } from '@angular/router';
import { EuroExService } from 'src/app/euro-ex.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Table } from 'primeng/table';
import Swal from 'sweetalert2';
import { ShipmentList } from './ShipmentList';

@Component({
  selector: 'app-shipment-list',
  templateUrl: './shipment-list.component.html',
  styles: [`
  :host ::ng-deep .p-dialog .product-image {
      width: 150px;
      margin: 0 auto 2rem auto;
      display: block;
  }
`],
  styleUrls: ['./shipment-list.component.scss']
})

export class ShipmentListComponent implements OnInit  
{


  @ViewChild('body') reportContent: ElementRef;
  //private _unsubscribeAll: Subject<any>;
  productDialog: boolean;
  exportColumns: any[];

  @ViewChild('dt') table: Table;
  // products: Product[];

  shipmentListDTO: ShipmentList[];


  //product: Product;

  selectedShipments: ShipmentList[];


  user_login: FormGroup;
  user_register: FormGroup;
  isLocalSotrageUserName : any;
  isLocalSotrageToken : any;
  isLocalSotrageAccID : any;
  isLocalSotrageSenderID : any;
  isLocalStorageUserID: any;
  displayedColumns: string[] = ['Description', 'ShipmentCodeSt', 'ShipmentID', 'StatusName', 'TotalAmount', 'TotalWeight', 'TrackingStatus'];
  dataSource : any[] = [];
  year: number = new Date().getFullYear();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(private router: Router,
    private EuroEx: EuroExService,
    private modalService: NgbModal,
    private _formBuilder: FormBuilder
    ) 
    {
      
    }

  ngOnInit(): void 
  {
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
    this.getShipmentOrdersList();
  }

  // ngAfterViewInit() {
  //   this.dataSource.paginator = this.paginator;
  //   this.getShipmentOrdersList();
  // }


  getShipmentOrdersList() 
  {
    this.EuroEx.ShipmentOrdersList().subscribe((result: any) => {
      if (result.ResponseCode == 200 && result.Status == true) {
       // this.dataSource = result.Data;
       this.shipmentListDTO = result.Data;
       // result.Data.paginator = this.paginator;
      }
      else {
        //alert("No Data Found");
        //Swal.fire('', 'No Data Found', 'error')
      }
    }, (error: HttpErrorResponse) => {
      console.log(error);
    });
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
  getoken()
  {
    this.isLocalSotrageUserName = localStorage.getItem("UserName");
    this.isLocalSotrageToken = localStorage.getItem("token");
    this.isLocalSotrageAccID = localStorage.getItem("AccountID");
    this.isLocalSotrageSenderID = localStorage.getItem("SenderID");
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

export interface ShipmentDataList {
  Description: string;
  ShipmentCodeSt: number;
  ShipmentID: number;
  StatusName: string;
  TotalAmount: number;
  TotalWeight: number;
  TrackingStatus: string;
}