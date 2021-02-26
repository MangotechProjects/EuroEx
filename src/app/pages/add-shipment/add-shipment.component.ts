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
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-add-shipment',
  templateUrl: './add-shipment.component.html',
  styleUrls: ['./add-shipment.component.scss'],
  providers: [DatePipe]
})
export class AddShipmentComponent implements OnInit {
  user_login: FormGroup;
  user_register: FormGroup;
  currentSection = 'home';
  isLocalSotrage: any;
  isLocalSotrageToken : any;
  isLocalSotrageAccID : any;
  isLocalSotrageUserName : any = localStorage.getItem("UserName");
  isLocalSotrageSenderID : any = localStorage.getItem("SenderID");
  isLocalStorageUserID: any;
  registrationDate: any;
  Date = new Date();

  currencyID: number;
  currencyArray: any;
  ExchangeRate: any;
  Symbol: string;
 
  voucherName: string;
  year: number = new Date().getFullYear();

  addShipmentForm: FormGroup;
  horizontalStepperStep1: FormGroup;
  horizontalStepperStep2: FormGroup;
  horizontalStepperStep3: FormGroup;
  horizontalStepperStep4: FormGroup;
  horizontalStepperStep5: FormGroup;
  horizontalStepperStepReceiverDetails: FormGroup;
  horizontalStepperStepSenderDetails: FormGroup;
  horizontalStepperStepAccountConfirmation: FormGroup;



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
    private modalService: NgbModal,
    private datePipe: DatePipe
  ) { 
    this._unsubscribeAll = new Subject();
    this.registrationDate = this.datePipe.transform(this.Date, 'yyyy-MM-dd'); 
  }

  ngOnInit(): void {
    this.getCountryCodes();
    this.getCargoTypes();
    //this.getContainers();
    this.getShipmentTypes();
    this.getDocumentTypes();
    this.getSenders();
    this.getReceivers();
    this.getParcelCategories();
    this.getParcelTypes();
    this.GetPackagingTypes();
    this.GetPaymentModes();
    this.ChkMinDate();
    this.getCountries();
    this.GetUnitsData();
    this.getExistingReceivers();
    this.getExistSenders();
    this.GetSenderIDWise();

    this.getoken();

    this.getCurrencyList();
    
    // this.isLocalSotrageSenderID = localStorage.getItem("SenderID") as number;
    // console.log(this.isLocalSotrageSenderID)
    // this.Extra();
    
    // $("#senderDD").hide();
    // $("#receiverDD").hide();
  
    this.horizontalStepperStep1 = this._formBuilder.group({
      shipmentTypeDDID: ['', Validators.required],
      senderDD: [''],//, Validators.required
      receiverDD: [''],//, Validators.required
      UnitDDID: ['', Validators.required],
      CargoTypeDDID: ['', Validators.required]

    });

    this.horizontalStepperStep2 = this._formBuilder.group({

      docWeight: [''],

      parcelGrossWeight: [''],
      parcelNetWeight: [''],
      documentTypeDDID: [''],

      parcelTypeDDID: [''],

      parcelCategoryDDID: ['']
    });


    this.horizontalStepperStepAccountConfirmation = this._formBuilder.group({
      Account: ['', Validators.required]
    });

    this.horizontalStepperStepSenderDetails = this._formBuilder.group({

      SenderPostalCode: ['', Validators.required],
      SenderCountry: ['', Validators.required],
      SenderCity: ['', Validators.required],
      SenderAddress: ['', Validators.required],
      SenderEmail: ['', Validators.required],
      SenderPhone: ['', Validators.required],
      SenderLastName: ['', Validators.required],
      SenderFirstName: ['', Validators.required],
      SenderPhoneCodeDDID: ['', Validators.required],
      SenderCountryDDID: ['', Validators.required],
      ExistSenderDDID: ['']//, Validators.required]

    });

    this.horizontalStepperStepReceiverDetails = this._formBuilder.group({
      ReceiverPostalCode: ['', Validators.required],
      ReceiverCountry: ['', Validators.required],
      ReceiverCity: ['', Validators.required],
      ReceiverAddress: ['', Validators.required],
      ReceiverEmail: ['', Validators.required],
      ReceiverPhone: ['', Validators.required],
      ReceiverLastName: ['', Validators.required],
      ReceiverFirstName: ['', Validators.required],
      ReceiverPhoneCodeDDID: ['', Validators.required],
      ReceiverCountryDDID: ['', Validators.required],
      ExistReceiverDDID: [''],//, Validators.required],


    });

    this.horizontalStepperStep3 = this._formBuilder.group({
      packageTypeDDID: ['', Validators.required],
      ShipmentDate: [''],
      PickUpDate: ['', Validators.required],
      ToTime: ['', Validators.required],
      FromTime: ['', Validators.required]

    });
    this.horizontalStepperStep4 = this._formBuilder.group({
      PayModeDDID: ['', Validators.required]

    });
    this.horizontalStepperStep5 = this._formBuilder.group({


    });

    //Sender Part Start
    this.IsNewReceiver = false;
    this.IsNewSender = false;



      //  console.log("Sender saved");
      this.horizontalStepperStepSenderDetails = this._formBuilder.group({
        SenderFirstName: [{ value: '', disabled: true }],
        SenderLastName: [{ value: '', disabled: true }],
        SenderPhone: [{ value: '', disabled: false }],
        SenderEmail: [{ value: '', disabled: false }],
        SenderAddress: [{ value: '', disabled: false }],
        SenderCity: [{ value: '', disabled: false }],
        SenderCountry: [{ value: '', disabled: false }],
        SenderPostalCode: [{ value: '', disabled: false }],
        ExistSenderDDID: ['', Validators.required],
        SenderPhoneCodeDDID: [{ value: '', disabled: false }],
        SenderCountryDDID: [{ value: '', disabled: false }]

      });


      this.horizontalStepperStepReceiverDetails = this._formBuilder.group({

        ReceiverFirstName: [{ value: '', disabled: false }],
        ReceiverLastName: [{ value: '', disabled: false }],
        ReceiverPhone: [{ value: '', disabled: false }],
        ReceiverEmail: [{ value: '', disabled: false }],
        ReceiverAddress: [{ value: '', disabled: false }],
        ReceiverCity: [{ value: '', disabled: false }],
        ReceiverCountry: [{ value: '', disabled: false }],
        ReceiverPostalCode: [{ value: '', disabled: false }],
        ExistReceiverDDID: [''],
        ReceiverPhoneCodeDDID: [{ value: '', disabled: false }],
        ReceiverCountryDDID: [{ value: '', disabled: false }]

      });
      this.IsCountryAndCodeDisabled = false;
    //Sender Part End
  }



  CargoTypeData = [];
  DocumentTypeData = [];
  ContainerData = [];
  ShipmentTypeData = [];
  appendDocData = [];
  appendParcelData = [];
  SenderData = [];
  ReceiverData = [];
  ExistSenderData = [];
  ExistReceiverData = [];
  PackagingTypeData = [];
  PayModeData = [];
  ParcelTypeData = [];
  ParcelCategoryData = [];
  CountryData = [];
  PhoneCodeData = [];
  UnitData = [];

  isSenderFieldsEnabled = true;
  isReceiverFieldsEnabled = false;
  UnitDDID: number;
  // shipment form variables
  ExistSenderDDID: number;
  ExistReceiverDDID: number;
  ReceiverPhoneCodeDDID: number;
  SenderPhoneCodeDDID: number;
  SenderCountryDDID: number;
  ReceiverCountryDDID: number;
  IsCountryAndCodeDisabled:boolean = false;
  senderDD: number;
  receiverDD: number;
  NewSenderID: number;
  NewReceiverID: number;
  IsNewSender = true;
  IsNewReceiver = true;
  ShipmentDate: any;
  PickUpDate: any;
  //for document
  shipmentTypeDDID: number = 1;
  PayModeDDID: number = 1;
  packageTypeDDID: number;
  documentTypeDDID: number;
  DocDescription: string;
  docQuantity: number;
  docLength: number;
  docWidth: number;
  docHeight: number;
  docWeight: number;
  CargoTypeDDID: number;
  //end for document

  SetMinDate: any;
  SetShipmentDate: any;

  GetUnitsData() {
    this.EuroEX.GetUnits().subscribe((result: any) => {
      //console.log(result);
      if (result.ResponseCode == 200 && result.Status == true) {
        this.UnitData = result.Data;
        //this.addShipmentForm.value['perKGRate'] = result.Data;

        // this.router.navigate(['/cargos/cargo-list']);
      }
      else {
        //alert("Some error occured");
        Swal.fire('', 'Some error occured', 'error')
      }

    }, (error: HttpErrorResponse) => {
      //console.log(error);
    });
  }
  getCountries() {
    this.EuroEX.GetCountries().subscribe((result: any) => {
      //console.log(result);
      if (result.ResponseCode == 200 && result.Status == true) {
        this.CountryData = result.Data;
      }
      else {
        //alert("Some error occured");
        Swal.fire('', 'Some error occured', 'error')
      }

    }, (error: HttpErrorResponse) => {
      //console.log(error);
    });
  }
  ChkMinDate() {
    var tod;
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    tod = yyyy + '-' + mm + '-' + dd;
    // var MinPickUpDate = this.horizontalStepperStep3.value['ShipmentDate'];
    //alert(MinPickUpDate.toLocaleDateString()+"This is date");
    //console.log(tod);
    this.SetMinDate = tod;
    this.SetShipmentDate = tod;
  }

  //CountryData = [];

  getCountryCodes() {
    this.EuroEX.GetCountryCodes().subscribe((result: any) => {
      //console.log(result);
      if (result.ResponseCode == 200 && result.Status == true) {
        this.PhoneCodeData = result.Data;
      }
      else {
        //alert("Some error occured");
        Swal.fire('', 'Some error occured', 'error')
      }

    }, (error: HttpErrorResponse) => {
      //console.log(error);
    });
  }
  getPickUpDate() {
    var tod;
    var today = new Date(this.horizontalStepperStep3.value['PickUpDate']);//new Date();
    //console.log(today);
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    tod = yyyy + '-' + mm + '-' + dd;
    // var MinPickUpDate = this.horizontalStepperStep3.value['ShipmentDate'];
    //alert(MinPickUpDate.toLocaleDateString()+"This is date");
    //console.log(tod);
    this.SetShipmentDate = tod;
  }

  //for parcel

  parcelTypeDDID: number;
  parcelCategoryDDID: number;

  parcelNetWeight: number;
  parcelGrossWeight: number;
  //perKGRate:number;
  //end for parcel
  //end shipment variables


  isDocument = true;
  //

  // GetChkBoxValue() {

  //   $("#senderDD").hide();
  //   $("#receiverDD").hide();

  //   const ID = this.horizontalStepperStepAccountConfirmation.get('Account');

  //   if (ID.value === "1") {
  //     console.log(ID.value + "-chk box value");
  //     this.IsNewReceiver = true;
  //     this.IsNewSender = true;
  //     this.horizontalStepperStepSenderDetails = this._formBuilder.group({
  //       SenderFirstName: ['', Validators.required],
  //       SenderLastName: ['', Validators.required],
  //       SenderPhone: [{ value: '', disabled: false }],
  //       SenderEmail: [{ value: '', disabled: false }],
  //       SenderAddress: [{ value: '', disabled: false }],
  //       SenderCity: [{ value: '', disabled: false }],
  //       SenderCountry: [{ value: '', disabled: false }],
  //       SenderPostalCode: [{ value: '', disabled: false }],
  //       ExistSenderDDID: [],
  //       SenderPhoneCodeDDID: [{ value: '', disabled: false }],
  //       SenderCountryDDID: [{ value: '', disabled: false }]

  //     });


  //     this.horizontalStepperStepReceiverDetails = this._formBuilder.group({
  //       //SenderFirstName: [{ value: '', disabled: false,required:false }],
  //       ReceiverFirstName: ['', Validators.required],
  //       ReceiverLastName: ['', Validators.required],
  //       ReceiverPhone: [{ value: '', disabled: false }],
  //       ReceiverEmail: [{ value: '', disabled: false }],
  //       ReceiverAddress: [{ value: '', disabled: false }],
  //       ReceiverCity: [{ value: '', disabled: false }],
  //       ReceiverCountry: [{ value: '', disabled: false }],
  //       ReceiverPostalCode: [{ value: '', disabled: false }],
  //       ExistReceiverDDID: [],
  //       ReceiverPhoneCodeDDID: [{ value: '', disabled: false }],
  //       ReceiverCountryDDID: [{ value: '', disabled: false }]


  //     });

  //     this.IsCountryAndCodeDisabled = false;

  //   }
  //   else if (ID.value === "2") {
  //     console.log(ID.value + "-chk box value");
  //     this.IsNewReceiver = false;
  //     this.IsNewSender = false;



  //     //  console.log("Sender saved");
  //     this.horizontalStepperStepSenderDetails = this._formBuilder.group({
  //       SenderFirstName: [{ value: '', disabled: true }],
  //       SenderLastName: [{ value: '', disabled: true }],
  //       SenderPhone: [{ value: '', disabled: true }],
  //       SenderEmail: [{ value: '', disabled: true }],
  //       SenderAddress: [{ value: '', disabled: true }],
  //       SenderCity: [{ value: '', disabled: true }],
  //       SenderCountry: [{ value: '', disabled: true }],
  //       SenderPostalCode: [{ value: '', disabled: true }],
  //       ExistSenderDDID: ['', Validators.required],
  //       SenderPhoneCodeDDID: [{ value: '', disabled: true }],
  //       SenderCountryDDID: [{ value: '', disabled: true }]

  //     });


  //     this.horizontalStepperStepReceiverDetails = this._formBuilder.group({

  //       ReceiverFirstName: [{ value: '', disabled: true }],
  //       ReceiverLastName: [{ value: '', disabled: true }],
  //       ReceiverPhone: [{ value: '', disabled: true }],
  //       ReceiverEmail: [{ value: '', disabled: true }],
  //       ReceiverAddress: [{ value: '', disabled: true }],
  //       ReceiverCity: [{ value: '', disabled: true }],
  //       ReceiverCountry: [{ value: '', disabled: true }],
  //       ReceiverPostalCode: [{ value: '', disabled: true }],
  //       ExistReceiverDDID: ['', Validators.required],
  //       ReceiverPhoneCodeDDID: [{ value: '', disabled: true }],
  //       ReceiverCountryDDID: [{ value: '', disabled: true }]

  //     });
  //     this.IsCountryAndCodeDisabled = true;

  //     this.getExistingReceivers();
  //     this.getExistSenders();


  //   }


  // }


  GetSenderIDWise() {
    //alert("in");
    //var ID = this.horizontalStepperStepSenderDetails.value['ExistSenderDDID'];
    var ID = this.isLocalSotrageSenderID;
    if (ID > 0) {
      this.EuroEX.GetSenderDataIDWise(ID).subscribe((result: any) => {
        //console.log(result);
        if (result.ResponseCode == 200 && result.Status == true) {
          //this.router.navigate(['/shippers/shipper-list']);
          //console.log(result.Data[0].Cell);
          this.horizontalStepperStepSenderDetails = this._formBuilder.group({
            //SenderFirstName: [{ value: '', disabled: false,required:false }],
            SenderPhone: [{ value: result.Data[0].Cell, disabled: false }],
            SenderEmail: [{ value: result.Data[0].Email, disabled: false }],
            SenderAddress: [{ value: result.Data[0].Address, disabled: false }],
            SenderCity: [{ value: result.Data[0].City, disabled: false }],
            SenderCountry: [{ value: result.Data[0].Country, disabled: false }],
            SenderPostalCode: [{ value: result.Data[0].PostCode, disabled: false }],
            ExistSenderDDID: [{ value: result.Data[0].ID, disabled: true }],
            SenderPhoneCodeDDID: [{ value: result.Data[0].PhoneCodeID, disabled: false }],
            SenderCountryDDID: [{ value: result.Data[0].CountryID, disabled: false }]
          });
          this.SenderCountryDDID = result.Data[0].CountryID;
          this.IsCountryAndCodeDisabled = false;
          // horizontalStepperStepSenderDetails.next();
        }
        else {
          //alert("Some error occured");
          Swal.fire('', 'Some error occured', 'error')
        }

      }, (error: HttpErrorResponse) => {
        //console.log(error);
      });
    }

  }


  GetReceiverIDWise() {
    //alert("in");
    var ID = this.horizontalStepperStepReceiverDetails.value['ExistReceiverDDID'];
    if (ID > 0) {
      this.EuroEX.GetReceiverDataIDWise(ID).subscribe((result: any) => {
        //console.log(result);
        if (result.ResponseCode == 200 && result.Status == true) {
          //this.router.navigate(['/shippers/shipper-list']);
          //console.log(result.Data[0].Cell);
          this.horizontalStepperStepReceiverDetails = this._formBuilder.group({
           ReceiverPhone: [{ value: result.Data[0].Cell, disabled: false }],
            ReceiverEmail: [{ value: result.Data[0].Email, disabled: false }],
            ReceiverAddress: [{ value: result.Data[0].Address, disabled: false }],
            ReceiverCity: [{ value: result.Data[0].City, disabled: false }],
            ReceiverCountry: [{ value: result.Data[0].Country, disabled: false }],
            ReceiverPostalCode: [{ value: result.Data[0].PostCode, disabled: false }],
            ExistReceiverDDID: [{ value: result.Data[0].ID, disabled: false }],
            ReceiverPhoneCodeDDID: [{ value: result.Data[0].PhoneCodeID, disabled: false }],
            ReceiverCountryDDID: [{ value: result.Data[0].CountryID, disabled: false }]

          });

          this.ReceiverCountryDDID = result.Data[0].CountryID;

          this.IsCountryAndCodeDisabled = false;
          // horizontalStepperStepSenderDetails.next();
        }
        else {
          //alert("Some error occured");
          Swal.fire('', 'Some error occured', 'error')
        }

      }, (error: HttpErrorResponse) => {
        //console.log(error);
      });
    }

  }
  //#region Sender Conditional Validations
  setSenderCustomValidators() {
    // alert("-sender");
    const SenderFirstName = this.horizontalStepperStepSenderDetails.get('SenderFirstName');
    const SenderLastName = this.horizontalStepperStepSenderDetails.get('SenderLastName');
    const ExistSenderDDID = this.horizontalStepperStepSenderDetails.get('ExistSenderDDID');
    const SenderPostalCode = this.horizontalStepperStepSenderDetails.get('SenderPostalCode');
    const SenderCountry = this.horizontalStepperStepSenderDetails.get('SenderCountry');
    const SenderCity = this.horizontalStepperStepSenderDetails.get('SenderCity');
    const SenderAddress = this.horizontalStepperStepSenderDetails.get('SenderAddress');
    const SenderEmail = this.horizontalStepperStepSenderDetails.get('SenderEmail');
    const SenderPhone = this.horizontalStepperStepSenderDetails.get('SenderPhone');


    this.horizontalStepperStepAccountConfirmation.get('Account').valueChanges
      .subscribe(chkBox => {
        // alert(chkBox+"-sender");
        if (chkBox === '1') {//New
          SenderFirstName.setValidators([Validators.required]);
          SenderLastName.setValidators([Validators.required]);
          ExistSenderDDID.setValidators(null);

          SenderPostalCode.setValidators([Validators.required]);
          SenderCountry.setValidators([Validators.required]);
          SenderCity.setValidators([Validators.required]);
          SenderAddress.setValidators([Validators.required]);
          SenderEmail.setValidators([Validators.required, Validators.email]);
          SenderPhone.setValidators([Validators.required]);
        }

        if (chkBox === '2') {//Existing
          SenderFirstName.setValidators(null);
          SenderLastName.setValidators(null);
          ExistSenderDDID.setValidators([Validators.required]);

          SenderPostalCode.setValidators([Validators.required]);
          SenderCountry.setValidators([Validators.required]);
          SenderCity.setValidators([Validators.required]);
          SenderAddress.setValidators([Validators.required]);
          SenderEmail.setValidators([Validators.required, Validators.email]);
          SenderPhone.setValidators([Validators.required]);
        }

        SenderFirstName.updateValueAndValidity();
        SenderLastName.updateValueAndValidity();
        ExistSenderDDID.updateValueAndValidity();

        SenderPostalCode.updateValueAndValidity();
        SenderCountry.updateValueAndValidity();
        SenderCity.updateValueAndValidity();
        SenderAddress.updateValueAndValidity();
        SenderEmail.updateValueAndValidity();
        SenderPhone.updateValueAndValidity();
      });
  }
  //#endregion

  //#region Receiver Conditional Validations
  setReceiverCustomValidators() {
    const ReceiverFirstName = this.horizontalStepperStepReceiverDetails.get('ReceiverFirstName');
    const ReceiverLastName = this.horizontalStepperStepReceiverDetails.get('ReceiverLastName');
    const ExistReceiverDDID = this.horizontalStepperStepReceiverDetails.get('ExistReceiverDDID');
    const ReceiverPostalCode = this.horizontalStepperStepReceiverDetails.get('ReceiverPostalCode');
    const ReceiverCountry = this.horizontalStepperStepReceiverDetails.get('ReceiverCountry');
    const ReceiverCity = this.horizontalStepperStepReceiverDetails.get('ReceiverCity');
    const ReceiverAddress = this.horizontalStepperStepReceiverDetails.get('ReceiverAddress');
    const ReceiverEmail = this.horizontalStepperStepReceiverDetails.get('ReceiverEmail');
    const ReceiverPhone = this.horizontalStepperStepReceiverDetails.get('ReceiverPhone');


    this.horizontalStepperStepAccountConfirmation.get('Account').valueChanges
      .subscribe(chkBox => {
        // alert(chkBox+"-Receiver");
        if (chkBox === '1') {
          ReceiverFirstName.setValidators([Validators.required]);
          ReceiverLastName.setValidators([Validators.required]);
          ExistReceiverDDID.setValidators(null);

          ReceiverPostalCode.setValidators([Validators.required]);
          ReceiverCountry.setValidators([Validators.required]);
          ReceiverCity.setValidators([Validators.required]);
          ReceiverAddress.setValidators([Validators.required]);
          ReceiverEmail.setValidators([Validators.required, Validators.email]);
          ReceiverPhone.setValidators([Validators.required]);
        }

        if (chkBox === '2') {
          ReceiverFirstName.setValidators([Validators.required]);
          ReceiverLastName.setValidators([Validators.required]);
          ExistReceiverDDID.setValidators(null);

          ReceiverPostalCode.setValidators([Validators.required]);
          ReceiverCountry.setValidators([Validators.required]);
          ReceiverCity.setValidators([Validators.required]);
          ReceiverAddress.setValidators([Validators.required]);
          ReceiverEmail.setValidators([Validators.required, Validators.email]);
          ReceiverPhone.setValidators([Validators.required]);
        }

        ReceiverFirstName.updateValueAndValidity();
        ReceiverLastName.updateValueAndValidity();
        ExistReceiverDDID.updateValueAndValidity();

        ReceiverPostalCode.updateValueAndValidity();
        ReceiverCountry.updateValueAndValidity();
        ReceiverCity.updateValueAndValidity();
        ReceiverAddress.updateValueAndValidity();
        ReceiverEmail.updateValueAndValidity();
        ReceiverPhone.updateValueAndValidity();
      });
  }
  //#endregion

  SetSender_ReceiverID() {
    //console.log("success");
    this.getSenders();
    this.getReceivers();
    if (this.IsNewReceiver == false && this.IsNewSender == false) {
      this.senderDD = this.horizontalStepperStepSenderDetails.value['ExistSenderDDID'];
      this.receiverDD = this.horizontalStepperStepReceiverDetails.value['ExistReceiverDDID'];
      console.warn(this.senderDD);
      console.warn(this.receiverDD);
    }
    else {
      this.senderDD = this.NewSenderID;
      this.receiverDD = this.NewReceiverID;

      console.warn(this.senderDD);
      console.warn(this.receiverDD);
    }
  }
  //#region Save New Sender/Receiver
  SaveNewSender() {

    var ClientName = this.horizontalStepperStepSenderDetails.value['SenderFirstName'] + ' ' + this.horizontalStepperStepSenderDetails.value['SenderLastName'];
    var PhoneNumber = this.horizontalStepperStepSenderDetails.value['SenderPhone'];
    var Address = this.horizontalStepperStepSenderDetails.value['SenderAddress'] + '/' + this.horizontalStepperStepSenderDetails.value['SenderCity'] + '/' + this.horizontalStepperStepSenderDetails.value['SenderCountry'] + '/' + this.horizontalStepperStepSenderDetails.value['SenderPostalCode'];
    var Email = this.horizontalStepperStepSenderDetails.value['SenderEmail'];
    var PhoneCode = this.horizontalStepperStepSenderDetails.value['SenderPhoneCodeDDID'];
    var PostalCode = this.horizontalStepperStepSenderDetails.value['SenderPostalCode'];
    var City = this.horizontalStepperStepSenderDetails.value['SenderCity'];
    var Country = this.horizontalStepperStepSenderDetails.value['SenderCountryDDID'];
    //var Description = this.horizontalStepperStepSenderDetails.value['description'];
    var data = [{ ShipperName: ClientName, PhoneNumber: PhoneNumber, Address: Address, Email: Email, Description: '-', PhoneCodeID: PhoneCode, CountryID: Country }];
    console.warn(data);

    if (ClientName == '' || City == '' || Country == '' || PostalCode == '' || PhoneNumber == '' || Address == '' || Email == '' || PhoneCode == '' || Country == '') {
      //alert("Please fill out all fields");
      Swal.fire('', 'Please fill out all fields', 'error')
    }
    else {
      //console.log("Sender saved");
      this.EuroEX.AddShipper(data).subscribe((result: any) => {
        //console.log(result);
        if (result.ResponseCode == 200 && result.Status == true) {
          //this.router.navigate(['/shippers/shipper-list']);
          //console.log("Sender saved");
          this.NewSenderID = result.Data;
          $("#SenderStepperBtn").click();
          // horizontalStepperStepSenderDetails.next();
        }
        else {
          //alert("Some error occured");
          Swal.fire('', 'Some error occured', 'error')
        }

      }, (error: HttpErrorResponse) => {
        //console.log(error);
      });
    }

  }

  SaveNewReceiver() {


    var ClientName = this.horizontalStepperStepReceiverDetails.value['ReceiverFirstName'] + ' ' + this.horizontalStepperStepReceiverDetails.value['ReceiverLastName'];
    var PhoneNumber = this.horizontalStepperStepReceiverDetails.value['ReceiverPhone'];
    var Address = this.horizontalStepperStepReceiverDetails.value['ReceiverAddress'] + '/' + this.horizontalStepperStepReceiverDetails.value['ReceiverCity'] + '/' + this.horizontalStepperStepReceiverDetails.value['ReceiverCountry'] + '/' + this.horizontalStepperStepReceiverDetails.value['ReceiverPostalCode'];
    var Email = this.horizontalStepperStepReceiverDetails.value['ReceiverEmail'];
    var PhoneCode = this.horizontalStepperStepReceiverDetails.value['ReceiverPhoneCodeDDID'];
    var PostalCode = this.horizontalStepperStepReceiverDetails.value['ReceiverPostalCode'];
    var City = this.horizontalStepperStepReceiverDetails.value['ReceiverCity'];
    var Country = this.horizontalStepperStepReceiverDetails.value['ReceiverCountryDDID'];
    //var Description = this.horizontalStepperStepSenderDetails.value['description'];
    var data = [{ ClientName: ClientName, PhoneNumber: PhoneNumber, Address: Address, Email: Email, PhoneCodeID: PhoneCode, CountryID: Country }];
    console.warn(data);

    if (ClientName == '' || City == '' || Country == '' || PostalCode == '' || PhoneNumber == '' || Address == '' || Email == '' || PhoneCode == '') {
      //alert("Please fill out all fields");
      Swal.fire('', 'Please fill out all fields', 'error')
    }
    else {

      this.EuroEX.AddClient(data).subscribe((result: any) => {
        //console.log(result);
        if (result.ResponseCode == 200 && result.Status == true) {
          //console.log("Receiver Saved");

          this.NewReceiverID = result.Data;
          $("#ReceiverStepperBtn").click();
        }
        else {
          //alert("Some error occured");
          Swal.fire('', 'Some error occured', 'error')
        }
        //localStorage.setItem('userToken',result.access_token);
        //  this.router.navigate(['/apps/dashboards/analytics']);

      }, (error: HttpErrorResponse) => {
        //console.log(error);
      });
    }
  }
  //#endregion


  resetFileds() {

    //for document

    this.DocDescription = null;
    this.docQuantity = null;
    this.docLength = null;
    this.docWidth = null;
    this.docHeight = null;
    this.docWeight = 0;
    //end for document
    //$("#perKGRate").val(0);
   // this.shipmentTypeDDID = 0;
    //this.UnitDDID = 0;
    //this.SenderCountryDDID = 0;//$("#SenderCountryDDID").val();
    //this.ReceiverCountryDDID = 0;//$("#ReceiverCountryDDID").val();

    //for parcel

    this.parcelNetWeight = 0;
    this.parcelGrossWeight = 0;
  }
  perKGRateGlobal: number;

ChangeShipmentTypeStatus(){
  var ID = this.shipmentTypeDDID;
  if (ID == 1)//for document
  {
    this.TotalUnits = 0;
    this.TotalWeight = 0;
    this.TotalChargeAm = 0;

    this.isDocument = true;
   this.UnitDDID = null;
   
    this.appendDocData = [];
  }
  else if (ID == 2)//for parcel
  {
    this.TotalUnits = 0;
    this.TotalWeight = 0;
    this.TotalChargeAm = 0;
    this.UnitDDID = null;
    this.isDocument = false;
  
    this.appendParcelData = [];
  }
}

  getRatesID() {

    var ID = this.shipmentTypeDDID;

    if (ID == 1)//for document
    {
      this.TotalUnits = 0;
      this.TotalWeight = 0;
      this.TotalChargeAm = 0;

      this.isDocument = true;
      this.GetPerKGRate();
      this.resetFileds();
      this.appendDocData = [];
    }
    else if (ID == 2)//for parcel
    {
      this.TotalUnits = 0;
      this.TotalWeight = 0;
      this.TotalChargeAm = 0;

      this.isDocument = false;
      this.GetPerKGRate();
      this.resetFileds();
      this.appendParcelData = [];
    }
  }


  SetInfos() {
    $("#TotalUnit").val(this.TotalUnits);
    $("#TotalWeight").val(this.TotalWeight);
    $("#TotalCharge").val(this.TotalChargeAm);
  }

  finishHorizontalStepper(): void {
    this.router.navigate(['']);
  }

 SummarizedData(){
   //console.warn(this.TotalWeight);

   $("#DisShipmentType").val($("#shipmentTypeDDID").text());
   $("#DisTotalUnit").val(this.TotalUnits);
   //$("#DisShipmentDate").val($("#ShipmentDate").val());
   $("#DisPackageType").val($("#packageTypeDDID").text());
   $("#DisWeight").val(this.TotalWeight);
   $("#DisPickUpDate").val($("#PickUpDate").val());
   $("#DisPayMode").val($("#PayModeDDID").text());
   $("#DisTotalAmount").val($("#ConfirmedTotalAmount").val());
   $("#DisTimeSpan").val($("#ToTime").val()+"--"+$("#FromTime").val());
   $("#DisCargoType").val($("#CargoTypeDDID").text());
   
 }
  GetPerKGRate() {
   // alert("host")
    var ShipmentTypeID = this.shipmentTypeDDID;
    var UnitID = this.UnitDDID;
    var FromCountryID = this.SenderCountryDDID;//$("#SenderCountryDDID").val();
    var ToCountryID = this.ReceiverCountryDDID;//$("#ReceiverCountryDDID").val();

    //console.log(ShipmentTypeID)
    //console.log(UnitID)
   // console.log(FromCountryID)
    //console.log(ToCountryID)

    if (ShipmentTypeID > 0 && UnitID > 0 && FromCountryID > 0 && ToCountryID > 0) {
      this.EuroEX.GetPerKGRateShipmentWiseForShipment(ShipmentTypeID, UnitID, FromCountryID, ToCountryID).subscribe((result: any) => {
        //console.log(result);
        if (result.ResponseCode == 200 && result.Status == true) {
          $("#perKGRate").val((result.Data / this.ExchangeRate).toFixed(3));
        }
        else if (result.ResponseCode == 201 && result.Status == true) {
          //alert(result.Message);
          Swal.fire('',result.Message, 'success')
          $("#perKGRate").val((result.Data / this.ExchangeRate).toFixed(3));
        }
        else {
          $("#perKGRate").val((1 / this.ExchangeRate).toFixed(3));
          //alert("Some error occured");
          Swal.fire('','Some error occured', 'error')
        }

      }, (error: HttpErrorResponse) => {
        //console.log(error);
      });

    }
    else {

    }


  }
  SetConfirmedTotalAmount() {
    $("#ConfirmedTotalAmount").val(this.TotalChargeAm);
  }
  GetPackagingTypes() {

    var PackType = this.packageTypeDDID;
    this.EuroEX.GetPackagingTypeDropDownData().subscribe((result: any) => {
      //console.log(result);
      if (result.ResponseCode == 200 && result.Status == true) {
        this.PackagingTypeData = result.Data;
      }
      else {
        //alert("Some error occured");
        Swal.fire('','Some error occured', 'error')
      }

    }, (error: HttpErrorResponse) => {
     // console.log(error);
    });

  }

  GetPaymentModes() {

    var PackType = this.packageTypeDDID;
    this.EuroEX.GetPaymentModesDropDownData().subscribe((result: any) => {
      //console.log(result);
      if (result.ResponseCode == 200 && result.Status == true) {
        this.PayModeData = result.Data;
      }
      else {
        //alert("Some error occured");
        Swal.fire('','Some error occured', 'error')
      }

    }, (error: HttpErrorResponse) => {
      //console.log(error);
    });

  }

  TotalUnits = 0;
  TotalWeight = 0;
  TotalChargeAm = 0;
  funcDocData() {
    var rowCount = 1;
    if (this.documentTypeDDID == null || this.docWeight <= 0) {
      //alert("Please Fill Out Document Required Fields!");
      Swal.fire('','Please Fill Out Document Required Fields!', 'error')
    }
    else {
      var perKGRate = $("#perKGRate").val();
      this.perKGRateGlobal = perKGRate as number;
      var weight = this.docWeight;
      var rate = (this.perKGRateGlobal * weight).toFixed(3);

      if(this.appendDocData.length>0){
        this.appendDocData.forEach(element => {
          rowCount++;
        });
      }
      else{
        rowCount = 1;
      }

      var data = [{ rowID: rowCount,shipmentTypeID: this.shipmentTypeDDID, shipmentTypeName: $("#shipmentTypeDDID").text(), DocTypeID: this.documentTypeDDID, DocTypeName: $("#documentTypeDDID").text(), docDesc: 'Nil', docQty: 1, docDimension: 'Nil', docWeight: this.docWeight, perKiloGramRate: rate }];
      this.appendDocData.push(data);

      this.TotalUnits +=1 ;//this.appendDocData.length;
     // console.log(this.appendDocData);
      //alert("in doc length"+this.TotalUnits);
      this.TotalChargeAm += parseFloat(rate);
      this.TotalWeight += weight;
      this.resetFileds();
    }

  }

  removeDoc(id)
  {
   this.TotalUnits = 0; 
   this.TotalWeight = 0;
   this.TotalChargeAm = 0;
   var am = 0;
   var dw = 0;
   var length=0;
   $('#'+id+'').remove();
    $('#itemTable tbody tr').each(function (i, n) 
    {
      var $row = $(n);

      var TotalAm = $row.find("#docTotalAmountTable").text();
      var FinalDocWeight = $row.find("#docWeightTable").text();
      //var FInalTotalUnit =  $row.find("#docWeightTable").text();
        length++;
      am += parseFloat(TotalAm) ;
      dw += parseInt(FinalDocWeight);
    });
    this.TotalUnits =length;
    this.TotalChargeAm = am;
    this.TotalWeight = dw;
    this.SetConfirmedTotalAmount(); 
  }

  removeParcel(id)
  {
    this.TotalUnits = 0;
   this.TotalWeight = 0;
   this.TotalChargeAm = 0;
   var am = 0;
   var dw = 0;
   var length=0; 

   $('#'+id+'').remove();
    $('#itemTable tbody tr').each(function (i, n) 
    {
      var $row = $(n);

      var TotalAm = $row.find("#parcelTotalAmountTable").text();
      var FinalDocWeight = $row.find("#parcelNetWeightTable").text();
      
      am += parseFloat(TotalAm) ;
      dw += parseInt(FinalDocWeight);

      length++;
    });

    this.TotalUnits =length;
    this.TotalChargeAm = am;
    this.TotalWeight = dw;
    this.SetConfirmedTotalAmount(); 
  }

  funcParcelData() 
  {
    var rowCount = 1;
    if (this.parcelCategoryDDID == null || this.parcelTypeDDID == null || this.parcelNetWeight <= 0) 
    {
      //alert("Please Fill Out Parcel Required Fields!");
      Swal.fire('','Please Fill Out Parcel Required Fields!', 'error')
    }
    else 
    {
      var perKGRate = $("#perKGRate").val();
      this.perKGRateGlobal = perKGRate as number;
      var weight = this.parcelNetWeight;
      var rate = ( this.perKGRateGlobal * weight ).toFixed(3);

      if(this.appendParcelData.length>0){
        this.appendParcelData.forEach(element => {
          rowCount++;
        });
      }
      else{
        rowCount = 1;
      }

      var data = [{ rowID: rowCount,shipmentTypeID: this.shipmentTypeDDID, shipmentTypeName: $("#shipmentTypeDDID").text(), ParcelTypeID: this.parcelTypeDDID, ParcelTypeName: $("#parcelTypeDDID").text(), ParcelCategoryID: this.parcelCategoryDDID, ParcelCategoryName: $("#parcelCategoryDDID").text(), parcelDesc: 'Nil', parcelQty: 1, parcelDimension: 'Nil', parcelGrossWeight: this.parcelGrossWeight, parcelNetWeight: this.parcelNetWeight, parcelComodity: 'Nil', parcelUnit: 'Nil', perKiloGramRate: rate }];

      this.appendParcelData.push(data);

      this.TotalUnits +=1 ;//this.appendDocData.length;
      // console.log(this.appendDocData);
      // alert("in parcel length"+this.TotalUnits);
      this.TotalChargeAm += parseFloat(rate);
      this.TotalWeight += weight;
      this.resetFileds();
    }
  }

  submitShipment() {

    var Data = [];
    var UsersData = [];
    var TableData = [];
    //var ShipmentDate = this.horizontalStepperStep3.value['ShipmentDate'];
    var ShipmentDate = this.registrationDate;
    var PickUpDate = this.horizontalStepperStep3.value['PickUpDate'];
    var ToTime = this.horizontalStepperStep3.value['ToTime'];
    var FromTime = this.horizontalStepperStep3.value['FromTime'];
    var PayModeDDID = this.horizontalStepperStep4.value['PayModeDDID'];
    var packageTypeDDID = this.horizontalStepperStep3.value['packageTypeDDID'];
    var cargoTypeDDID = this.horizontalStepperStep1.value['CargoTypeDDID'];
    var RatePerItem = (this.perKGRateGlobal * parseFloat(this.ExchangeRate)); console.log(RatePerItem);

    var SName = this.horizontalStepperStepSenderDetails.value['SenderFirstName'] + ' ' + this.horizontalStepperStepSenderDetails.value['SenderLastName'];
    var SPhoneNumber = this.horizontalStepperStepSenderDetails.value['SenderPhone'];
    var SAddress = this.horizontalStepperStepSenderDetails.value['SenderAddress'] + '/' + this.horizontalStepperStepSenderDetails.value['SenderCity'] + '/' + this.horizontalStepperStepSenderDetails.value['SenderCountry'] + '/' + this.horizontalStepperStepSenderDetails.value['SenderPostalCode'];
    var SEmail = this.horizontalStepperStepSenderDetails.value['SenderEmail'];
    var SPhoneCode = this.horizontalStepperStepSenderDetails.value['SenderPhoneCodeDDID'];
    var SCountry = this.horizontalStepperStepSenderDetails.value['SenderCountryDDID'];
    


    var RClientName = this.horizontalStepperStepReceiverDetails.value['ReceiverFirstName'] + ' ' + this.horizontalStepperStepReceiverDetails.value['ReceiverLastName'];
    var RPhoneNumber = this.horizontalStepperStepReceiverDetails.value['ReceiverPhone'];
    var RAddress = this.horizontalStepperStepReceiverDetails.value['ReceiverAddress'] + '/' + this.horizontalStepperStepReceiverDetails.value['ReceiverCity'] + '/' + this.horizontalStepperStepReceiverDetails.value['ReceiverCountry'] + '/' + this.horizontalStepperStepReceiverDetails.value['ReceiverPostalCode'];
    var REmail = this.horizontalStepperStepReceiverDetails.value['ReceiverEmail'];
    var RPhoneCode = this.horizontalStepperStepReceiverDetails.value['ReceiverPhoneCodeDDID'];
    var RCountry = this.horizontalStepperStepReceiverDetails.value['ReceiverCountryDDID'];
    
    UsersData.push({
      SenderName:SName,
      SenderAddress:SAddress,
      SenderEmail:SEmail,
      SenderCell:SPhoneNumber,
      SenderCountryCodeID:SCountry,
      SenderPhoneCodeID:SPhoneCode,
      

      ReceiverName:RClientName,
      ReceiverAddress:RAddress,
      ReceiverEmail:REmail,
      ReceiverCell:RPhoneNumber,
      ReceiverCountryCodeID:RCountry,
      ReceiverPhoneCodeID:RPhoneCode,

    });

    if (this.shipmentTypeDDID == 1) {

      $('#itemTable tbody tr').each(function (i, n) {
        var $row = $(n);
        var shipmentTypeID = $row.find('input[id*="shipmentTypeTableID"]').val();
        var docTypeID = $row.find('input[id*="docTypeTableID"]').val();
        var docDesc = $row.find("#docDescTable").text();
        var docQty = $row.find("#docQtyTable").text();
        var docDimension = $row.find("#docDimensionTable").text();
        var docWeight = $row.find("#docWeightTable").text();

        TableData.push({
          ShipmentTypeID: shipmentTypeID,
          DocTypeID: docTypeID,
          ItemDescription: docDesc,
          ItemQty: docQty,
          Cost:RatePerItem,
          ItemDimension: docDimension,
          ItemWeight: docWeight

        });

      });

      Data.push({
        //SenderID: this.senderDD,
        SenderID: parseInt(this.isLocalSotrageSenderID),
        ReceiverID: this.receiverDD,
        ShipmentDate: ShipmentDate,
        PickUpDate: PickUpDate,
        ToTimeR: ToTime,
        FromTimeR: FromTime,
        PackageTypeID: packageTypeDDID,
        PayModeID: PayModeDDID,
        ShipmentDetails: TableData,
        CargoTypeID:cargoTypeDDID,
        ShipmentUserLogs:UsersData
      });

      if (Data) {
        console.log(Data[0]);
        this.EuroEX.submitShipment(Data).subscribe((result: any) => {
          console.log(result);
          if (result.ResponseCode == 200 && result.Status == true) {

            //console.log("Shipment Confirmed");
            setTimeout(() => {
              this.router.navigate(['/my-shipment']);
            }, 1000);

          }
          else {
            //alert("Some error occured");
            Swal.fire('','Some error occured', 'error')
          }

        }, (error: HttpErrorResponse) => {
          //console.log(error);
        });
      }
    }
    else if (this.shipmentTypeDDID == 2) {
      $('#itemTable tbody tr').each(function (i, n) {
        var $row = $(n);
        var shipmentTypeID = $row.find('input[id*="shipmentTypeTableID"]').val();
        var parcelTypeID = $row.find('input[id*="parcelTypeTableID"]').val();
        var parcelCategoryID = $row.find('input[id*="parcelCategoryTableID"]').val();
        var parcelDesc = $row.find("#parcelDescTable").text();
        var parcelQty = $row.find("#parcelQtyTable").text();
        var parcelDimension = $row.find("#parcelDimensionTable").text();
        var parcelGrossWeight = $row.find("#parcelGrossWeightTable").text();
        var parcelNetWeight = $row.find("#parcelNetWeightTable").text();
        var parcelComodity = $row.find("#parcelComodityTable").text();
        var parcelUnit = $row.find("#parcelUnitTable").text();

        TableData.push({
          ShipmentTypeID: shipmentTypeID,
          ParcelTypeID: parcelTypeID,
          ParcelCategoryID: parcelCategoryID,
          ItemDescription: parcelDesc,
          ItemQty: parcelQty,
          Cost:RatePerItem,
          ItemDimension: parcelDimension,
          ItemWeight: parcelNetWeight,
          ItemGrossWeight: parcelGrossWeight,
          ItemComodityCode: parcelComodity,
          ItemUnit: parcelUnit

        });

      });

      Data.push({
        SenderID: parseInt(this.isLocalSotrageSenderID),
        ReceiverID: this.receiverDD,
        ShipmentDate: ShipmentDate,
        PickUpDate: PickUpDate,
        ToTimeR: ToTime,
        FromTimeR: FromTime,
        CargoTypeID:cargoTypeDDID,
        PackageTypeID: packageTypeDDID,
        PayModeID: PayModeDDID,
        ShipmentDetails: TableData,
        ShipmentUserLogs:UsersData
      });

      if (Data) {
        //console.log(Data[0]);
        this.EuroEX.submitShipment(Data).subscribe((result: any) => {
          //console.log(result);
          if (result.ResponseCode == 200 && result.Status == true) {

            //console.log("Shipment Confirmed");

            setTimeout(() => {
              this.router.navigate(['/my-shipment']);
            }, 1000);

          }
          else {
            //alert("Some error occured");
            Swal.fire('','Some error occured', 'error')
          }

        }, (error: HttpErrorResponse) => {
          //console.log(error);
        });
      }

    }

  }


  getSenders() {
    this.EuroEX.getSendersDropDownData().subscribe((result: any) => {
      //console.log(result);
      if (result.ResponseCode == 200 && result.Status == true) {
        this.SenderData = result.Data;

      }
      else {
        //alert("Some error occured");
        Swal.fire('','Some error occured', 'error')
      }

    }, (error: HttpErrorResponse) => {
      //console.log(error);
    });
  }

  getParcelTypes() {
    this.EuroEX.getParcelTypesDropDownData().subscribe((result: any) => {
      //console.log(result);
      if (result.ResponseCode == 200 && result.Status == true) {
        this.ParcelTypeData = result.Data;

      }
      else {
        alert("Some error occured");
      }

    }, (error: HttpErrorResponse) => {
     // console.log(error);
    });
  }

  getParcelCategories() {
    this.EuroEX.getParcelCategoriesDropDownData().subscribe((result: any) => {
      //console.log(result);
      if (result.ResponseCode == 200 && result.Status == true) {
        this.ParcelCategoryData = result.Data;

      }
      else {
        //alert("Some error occured");
        Swal.fire('','Some error occured', 'error')
      }

    }, (error: HttpErrorResponse) => {
      //console.log(error);
    });
  }


  getReceivers() {
    this.EuroEX.getReceiversDropDownData().subscribe((result: any) => {
     // console.log(result);
      if (result.ResponseCode == 200 && result.Status == true) {
        this.ReceiverData = result.Data;

      }
      else {
        alert("Some error occured");
      }

    }, (error: HttpErrorResponse) => {
      //console.log(error);
    });
  }


  getExistingReceivers() {
    this.EuroEX.getReceiversDropDownData().subscribe((result: any) => {
      //console.log(result);
      if (result.ResponseCode == 200 && result.Status == true) {
        this.ExistReceiverData = result.Data;

      }
      else {
        //alert("Some error occured");
        Swal.fire('','Some error occured', 'error')
      }

    }, (error: HttpErrorResponse) => {
      //console.log(error);
    });
  }

  getExistSenders() {
    this.EuroEX.getSendersDropDownData().subscribe((result: any) => {
      //console.log(result);
      if (result.ResponseCode == 200 && result.Status == true) {
        this.ExistSenderData = result.Data;

      }
      else {
        alert("Some error occured");
      }

    }, (error: HttpErrorResponse) => {
      //console.log(error);
    });
  }



  getDocumentTypes() {
    this.EuroEX.getDocumentTypesDropDownData().subscribe((result: any) => {
      //console.log(result);
      if (result.ResponseCode == 200 && result.Status == true) {
        this.DocumentTypeData = result.Data;

      }
      else {
        //alert("Some error occured");
        Swal.fire('','Some error occured', 'error')
      }

    }, (error: HttpErrorResponse) => {
      //console.log(error);
    });
  }

  getShipmentTypes() {
    this.EuroEX.getShipmentTypesDropDownData().subscribe((result: any) => {
      //console.log(result);
      if (result.ResponseCode == 200 && result.Status == true) {
        this.ShipmentTypeData = result.Data;

      }
      else {
        alert("Some error occured");
      }

    }, (error: HttpErrorResponse) => {
      //console.log(error);
    });
  }

  getContainers() {
    this.EuroEX.getContainersDropDownData().subscribe((result: any) => {
      //console.log(result);
      if (result.ResponseCode == 200 && result.Status == true) {
        this.ContainerData = result.Data;

      }
      else {
        //alert("Some error occured");
        Swal.fire('','Some error occured', 'error')
      }

    }, (error: HttpErrorResponse) => {
      //console.log(error);
    });
  }

  getCargoTypes() {
    this.EuroEX.getCargoTypeDropDownData().subscribe((result: any) => {
      //console.log(result);
      if (result.ResponseCode == 200 && result.Status == true) {
        this.CargoTypeData = result.Data;

      }
      else {
        //alert("Some error occured");
        Swal.fire('','Some error occured', 'error')
      }

    }, (error: HttpErrorResponse) => {
      //console.log(error);
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
          this.isLocalSotrage = localStorage.getItem("UserName");
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

  SetSenderReceiversChangeCountry(id) {
    if (id == 1)//Set Sender Country Code Wise
    {
      var SCountry = this.horizontalStepperStepSenderDetails.value['SenderPhoneCodeDDID'];
      if (SCountry != '') {
        this.SenderCountryDDID = SCountry;
        this.SenderPhoneCodeDDID = SCountry;
      }


    }
    else if (id == 2)//Set Sender Code Country Wise
    {
      var SCountry = this.horizontalStepperStepSenderDetails.value['SenderCountryDDID'];
      if (SCountry != '') {
        this.SenderCountryDDID = SCountry;
        this.SenderPhoneCodeDDID = SCountry;
      }

    }
    else if (id == 3)//Set Receiver Country Code Wise
    {
      var RCountry = this.horizontalStepperStepReceiverDetails.value['ReceiverPhoneCodeDDID'];
      if (RCountry != '') {
        this.ReceiverCountryDDID = RCountry;
        this.ReceiverPhoneCodeDDID = RCountry;
      }

    }
    else if (id == 4)// Set Receiver Code Country Wise
    {
      var RCountry = this.horizontalStepperStepReceiverDetails.value['ReceiverCountryDDID'];
      if (RCountry != '') {
        this.ReceiverCountryDDID = RCountry;
        this.ReceiverPhoneCodeDDID = RCountry;
      }

    }

  }

  myprofile()
  {
    this.router.navigate(['my-profile']);
  }

  getCurrencyList(){

    this.EuroEX.GetCurrencyList().subscribe((result: any) => {
          
      if (result.ResponseCode == 200 && result.Status == true) { 
        this.currencyArray = result.Data;

        result.Data.forEach(e => {
            if(e.ID == 2){
              this.currencyID = e.ID;
              this.ExchangeRate = e.ExchangeRate;
              this.Symbol = e.Symbol;
            }
        });

      }
      else{
        //console.log()
      }
    }, (error: HttpErrorResponse) => {
          
    });

  }

  currencyChanged(cid) {

    this.currencyArray.forEach(e => {
      
      if(e.ID == cid){
        this.ExchangeRate = e.ExchangeRate;
        this.Symbol = e.Symbol;
      }

    });

  }
}
