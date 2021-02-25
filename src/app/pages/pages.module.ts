import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexComponent,DialogDataExampleDialog } from './index/index.component';

import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxYoutubePlayerModule } from 'ngx-youtube-player';

import { PagesRoutingModule } from './pages-routing.module';

import { SharedModule } from '../shared/shared.module';
import { Index2Component } from './index2/index2.component';
import { Index3Component } from './index3/index3.component';
import { Index4Component } from './index4/index4.component';
import { Index5Component } from './index5/index5.component';
import { Index6Component } from './index6/index6.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AddShipmentComponent } from './add-shipment/add-shipment.component';
import {TableModule} from 'primeng/table';
import {MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule} from '@angular/material/button';
import { MatInputModule} from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import { MatTableModule } from '@angular/material/table'; 
import { MatPaginatorModule } from '@angular/material/paginator';
import { ShipmentListComponent } from './shipment-list/shipment-list.component';
import { AboutComponent } from './about/about.component';
import { FaqComponent } from './faq/faq.component';
import {MatCardModule} from '@angular/material/card';
import {MatExpansionModule} from '@angular/material/expansion';
import { SolutionServiceComponent } from './solution-service/solution-service.component';

import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

import { LivechatWidgetModule } from '@livechat/angular-widget';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);

  //return new TranslateHttpLoader(httpClient, 
}


@NgModule({
  declarations: [IndexComponent, Index2Component, Index3Component, Index4Component, Index5Component, Index6Component, AddShipmentComponent, ShipmentListComponent, AboutComponent, FaqComponent, DialogDataExampleDialog, SolutionServiceComponent, MyProfileComponent, ResetPasswordComponent],
  imports: [
    CommonModule,
    PagesRoutingModule,
    SharedModule,
    ScrollToModule.forRoot(),
    NgbModalModule,
    NgxYoutubePlayerModule,
    FormsModule, 
    ReactiveFormsModule,
    HttpClientModule,
    MatStepperModule, 
    MatInputModule, 
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatTableModule,
    TableModule,
    MatPaginatorModule,
    MatCardModule,
    LivechatWidgetModule,
    MatExpansionModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ]
})
export class PagesModule { }
