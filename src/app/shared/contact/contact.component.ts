import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EuroExService } from 'src/app/euro-ex.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  emailForm: FormGroup;

  constructor(private _formBuilder: FormBuilder,private EuroEx: EuroExService,private router: Router) { }

  ngOnInit(): void {
    this.emailForm = this._formBuilder.group({
     
      name: ['', Validators.required],
      email: ['', Validators.required],
      msg: ['', Validators.required],
      
    });
  }

  email()
  {
    var name = this.emailForm.value['name'];
    var email = this.emailForm.value['email'];
    var msg = this.emailForm.value['msg'];

    this.EuroEx.email(name,email,msg).subscribe((result: any) => {
      if(result.ResponseCode == 200)
      {
        //alert('Email successfully send');
        Swal.fire('', 'Email successfully send', 'success')
        window.location.reload();
      }
      else
      {
        //alert("Some error occured");
        Swal.fire('', 'Some error occured', 'error')
      }
    },
    (error: HttpErrorResponse) => {
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

}
