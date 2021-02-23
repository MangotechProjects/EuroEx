import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EuroExService {

  constructor(private httpResp: HttpClient) { }
  rootUrlLocal = 'https://api.euroex.com';
  
  email(name,email,msg)
  {
    var data = 'receiverName=' + name + '&receiverEmailAddress=' + email + '&message=' + msg;
    var reqHeaders = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    return this.httpResp.post(this.rootUrlLocal + '/api/Shipment/SendEmail', data, { headers: reqHeaders });
  }

  userSignIn(Name,Password) 
  {
    var data = 'username=' + Name + '&password=' + Password + '&grant_type=password';
    var reqHeaders = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    return this.httpResp.post(this.rootUrlLocal + '/token', data, { headers: reqHeaders });
  }
  
  userSignUp(Name,Email,Cell,Password,CPassword) 
  {
    //console.warn(Data[0]);
    //var data = 'UserName=' + Name + '&email=' + Email + '&cell=' + Cell  + '&Password=' + Password + '&CPassword=' + CPassword;
    var data = 'UserName=' + Name + '&Email=' + Email + '&Cell=' + Cell  + '&Password=' + Password + '&ConfirmPassword=' + CPassword + '&UserRoles=Sender';
    var reqHeaders = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    return this.httpResp.post(this.rootUrlLocal + '/api/Account/Register', data, { headers: reqHeaders });
  }

  //#region Add Client API
  AddClient(ClientData) {
    //  console.log(ClientData[0].ClientName);
    var data = 'ClientName=' + ClientData[0].ClientName as string + '&PhoneNumber=' + ClientData[0].PhoneNumber as string + '&Address=' + ClientData[0].Address as string + '&Email=' + ClientData[0].Email as string + '&PhoneCodeID=' + ClientData[0].PhoneCodeID+ '&CountryID=' + ClientData[0].CountryID ;
    var reqHeaders = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    return this.httpResp.post(this.rootUrlLocal + '/api/Client/CreateClient', data, { headers: reqHeaders });
  }

  ClientList() {
    return this.httpResp.get(this.rootUrlLocal + '/api/Client/ClientList');
  }
  //#endregion


  //#region Add Shipper API
  AddShipper(ShipperData) {
    //  console.log(ClientData[0].ClientName);
    var data = 'ShipperName=' + ShipperData[0].ShipperName as string + '&PhoneNumber=' + ShipperData[0].PhoneNumber as string + '&Address=' + ShipperData[0].Address as string + '&Email=' + ShipperData[0].Email as string + '&Description=' + ShipperData[0].Description as string + '&PhoneCodeID=' + ShipperData[0].PhoneCodeID + '&CountryID=' + ShipperData[0].CountryID;
    var reqHeaders = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    return this.httpResp.post(this.rootUrlLocal + '/api/Shipper/CreateShipper', data, { headers: reqHeaders });
  }

  ShipperList() {
    return this.httpResp.get(this.rootUrlLocal + '/api/Shipper/ShipperList');
  }
  //#endregion


  //#region Add Cargo API
  AddCargo(CargoData) {
    //  console.log(ClientData[0].ClientName);
    var data = 'CargoName=' + CargoData[0].CargoName as string + '&Description=' + CargoData[0].Description as string + '&CargoTypeID=' + CargoData[0].CargoTypeID;
    var reqHeaders = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    return this.httpResp.post(this.rootUrlLocal + '/api/Cargo/CreateCargo', data, { headers: reqHeaders });
  }

  CargoList() {
    return this.httpResp.get(this.rootUrlLocal + '/api/Cargo/CargoList');
  }

  getCargoTypeDropDownData() {
    return this.httpResp.get(this.rootUrlLocal + '/api/Cargo/getCargoTypes');
  }
  //#endregion

  
  //#region Add Container API
  AddContainer(CargoData) {
    //  console.log(ClientData[0].ClientName);
    var data = 'CargoName=' + CargoData[0].CargoName as string + '&Description=' + CargoData[0].Description as string + '&CargoTypeID=' + CargoData[0].CargoTypeID;
    var reqHeaders = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    return this.httpResp.post(this.rootUrlLocal + '/api/Cargo/CreateCargo', data, { headers: reqHeaders });
  }

  ContainerList() {
    return this.httpResp.get(this.rootUrlLocal + '/api/Cargo/CargoList');
  }

  
  //#endregion


  //#region Create Shipment
  GetCountryCodes(){
    return this.httpResp.get(this.rootUrlLocal + '/api/Shipment/GetCountryCodes');
  }
  GetCountries(){
    return this.httpResp.get(this.rootUrlLocal + '/api/Shipment/GetCountries');
  }

  AddShipment(CargoData) {
    //  console.log(ClientData[0].ClientName);
    var data = 'CargoName=' + CargoData[0].CargoName as string + '&Description=' + CargoData[0].Description as string + '&CargoTypeID=' + CargoData[0].CargoTypeID;
    var reqHeaders = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    return this.httpResp.post(this.rootUrlLocal + '/api/Cargo/CreateCargo', data, { headers: reqHeaders });
  }
  getSendersDropDownData() {
    return this.httpResp.get(this.rootUrlLocal + '/api/Shipper/GetShippers');//Senders
  }
  getReceiversDropDownData() {
    return this.httpResp.get(this.rootUrlLocal + '/api/Client/GetClients');//Receivers
  }
  ShipmentList() {
    return this.httpResp.get(this.rootUrlLocal + '/api/Cargo/CargoList');
  }
  GetSenderDataIDWise(ID) {
    //alert("in2");
    return this.httpResp.get(this.rootUrlLocal + '/api/Shipper/GetShippersIDWise?ID='+ID);
  }

  GetReceiverDataIDWise(ID) {
    //alert("in2");
    return this.httpResp.get(this.rootUrlLocal + '/api/Client/GetReceiversIDWise?ID='+ID);
  }

  //ShipmentOrdersList() { return this.httpResp.get(this.rootUrlLocal + '/api/Shipment/ShipmentList') }
  ShipmentOrdersList() 
  { 
    var ID = localStorage.getItem("AccountID");
    var auth_token = localStorage.getItem("token");
    //console.log(auth_token,ID);
    // return this.httpResp.get(this.rootUrlLocal + '/api/Shipment/GetShipmentUserWise?AccountID='+ID); 
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth_token}`
    })
    return this.httpResp.get(this.rootUrlLocal + '/api/Shipment/GetShipmentUserWise?AccountID='+ID, { headers: headers });
  }

  getShipmentTypesDropDownData() {
    return this.httpResp.get(this.rootUrlLocal + '/api/Shipment/getShipmentType');
  }
  getDocumentTypesDropDownData() {
    return this.httpResp.get(this.rootUrlLocal + '/api/Shipment/getDocumentType');
  }
  getContainersDropDownData() {
    return this.httpResp.get(this.rootUrlLocal + '/api/Container/getContainer');
  }
  getParcelTypesDropDownData() {
    return this.httpResp.get(this.rootUrlLocal + '/api/Shipment/getParcelType');
  }
  getParcelCategoriesDropDownData() {
    return this.httpResp.get(this.rootUrlLocal + '/api/Shipment/getParcelCategory');
  }
  GetPackagingTypeDropDownData() {
    return this.httpResp.get(this.rootUrlLocal + '/api/Shipment/getPackageType');
  }
  GetPaymentModesDropDownData(){
    return this.httpResp.get(this.rootUrlLocal + '/api/Shipment/getPaymentMode');
  }

  submitShipment(Data) {
    console.log(Data[0]);
    var auth_token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth_token}`
    })
    //var reqHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpResp.post(this.rootUrlLocal + '/api/Shipment/SaveShipment', Data[0], { headers: headers });
  }

  GetPerKGRateShipmentTypeWise(ShipmentTypeID) {
    return this.httpResp.get(this.rootUrlLocal + '/api/Shipment/GetPerKGRateShipmentWise?ShipmentTypeID=' + ShipmentTypeID );
  } 

  GetPerKGRateShipmentWiseForShipment(ShipmentTypeID,UnitID,FromCountry,ToCountry) {
    //alert(Data);
    //console.log(ShipmentTypeID)
    //console.log(UnitID)
    //console.log(FromCountry)
    //console.log(ToCountry)
    //var data = '?ShipmentTypeID='+Data;
    // var reqHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpResp.get(this.rootUrlLocal + '/api/Shipment/GetPerKGRateShipmentWiseForShipment?ShipmentTypeID=' + ShipmentTypeID + '&UnitID='+UnitID+'&ToCountryID='+ToCountry+'&FromCountryID='+FromCountry+'');

  }
  //#endregion


  //#region Shipment Invoice

  GetInvoiceDetail(ShipmentID) {
    return this.httpResp.get(this.rootUrlLocal + '/api/Shipment/GetShipmentInvoice?ShipmentID=' + ShipmentID + '');
  }
  //#endregion
  //#region Rate Calculator

  GetCalculatedTotalAmount(Data) {
    var data = 'CalculatorModel:' + Data[0];
    var reqHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpResp.post(this.rootUrlLocal + '/api/Shipment/GetCalculatedRate', Data[0], { headers: reqHeaders });

  }
  GetToCountries(ID) {
    
    var reqHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpResp.get(this.rootUrlLocal + '/api/Shipment/GetToCountriesList?ID='+ID);

  }
  SaveRateFormula(Data){
   // var data = 'model:' + Data[0];
    var reqHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpResp.post(this.rootUrlLocal + '/api/Custom/SaveRateFormula', Data[0], { headers: reqHeaders });

  }
  GetUnits() {
    return this.httpResp.get(this.rootUrlLocal + '/api/Shipment/GetUnits');
  }

  RateList() {
    return this.httpResp.get(this.rootUrlLocal + '/api/Custom/RateFormulaList');
  }

  getCargoTypesDropDownData(){
    return this.httpResp.get(this.rootUrlLocal + '/api/Shipment/getCargoTypes');
  }
  //#endregion

  //#region Home
  SenderCount() {
    return this.httpResp.get(this.rootUrlLocal + '/api/Shipment/ShipperCount');
  }
  ReceiverCount() {
    return this.httpResp.get(this.rootUrlLocal + '/api/Shipment/ClientCount');
  }
  ShipmentCount() {
    return this.httpResp.get(this.rootUrlLocal + '/api/Shipment/ShipmentCount');
  }
  //#endregion

  TrackShipment(Data){
  
    return this.httpResp.get(this.rootUrlLocal + '/api/Shipment/TrackShipment?Code='+Data);
   }

   //for chat msg
   GetConnectionID(){
    return this.httpResp.get(this.rootUrlLocal + '/api/Custom/GetChatID');
  }

  SendMessageFromClient(Data){
    //console.log(Data[0]);
    var reqHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpResp.post(this.rootUrlLocal + '/api/Custom/ReceiveMessage', Data[0], { headers: reqHeaders });

  }

  NotificationAPI(){
    var Data = [{MsgType:"Chat Notification",Message:"You Have Received New Message!",TypeID:2}];
    var reqHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpResp.post(this.rootUrlLocal + '/api/Custom/SendNotification', Data[0], { headers: reqHeaders });
  }

  GetClientMsgsConnectionIDWise(ID){
    return this.httpResp.get(this.rootUrlLocal + '/api/Custom/GetClientMsgsForServer?ConnectionID='+ID);
  }

  RegisteredUsersProfileInfo(Data) {

    var reqHeaders = new HttpHeaders({ 'Authorization': 'bearer ' + localStorage.getItem("token") });

    return this.httpResp.get(this.rootUrlLocal + '/api/Custom/GetUserProfileInfo?UserID=' + Data, { headers: reqHeaders })
  }

  UpdateUserProfile(firstName,secondName,lastName,nationality,nic,phone1,phone2,mobile1,mobile2,address1,address2,City,CountryID,PostalCode)
  {
    var Data = [{
      UserID: localStorage.getItem("UserID"),
      FirstName: firstName, SecondName: secondName, LastName: lastName, Nationality: nationality,
      NIC: nic, Phone1: phone1, Phone2: phone2, Mobile1: mobile1, Mobile2: mobile2, Address1: address1,
      Address2: address2,TypeID:1,City:City,CountryID:CountryID,PostalCode:PostalCode
    }];

    //console.log(Data[0]);
      
    var reqHeaders = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'bearer ' + localStorage.getItem("token") });
    return this.httpResp.post(this.rootUrlLocal + '/api/Custom/EditUserProfileInfo', Data[0], { headers: reqHeaders });
  }
}
