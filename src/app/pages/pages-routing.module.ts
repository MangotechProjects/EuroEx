import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate  } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { Index2Component } from './index2/index2.component';
import { Index3Component } from './index3/index3.component';
import { Index4Component } from './index4/index4.component';
import { Index5Component } from './index5/index5.component';
import { Index6Component } from './index6/index6.component';
import { AddShipmentComponent } from './add-shipment/add-shipment.component';
import { ShipmentListComponent } from './shipment-list/shipment-list.component';
import { AboutComponent } from './about/about.component';
import { AuthGuardService as AuthGuard } from 'src/app/auth/auth-guard.service';
import { SolutionServiceComponent } from './solution-service/solution-service.component';
import { FaqComponent } from './faq/faq.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

const routes: Routes = [
    {
        path: '',
        component: IndexComponent
    },
    {
        path: 'index-1',
        component: IndexComponent,canActivate: [AuthGuard]
    },
    {
        path: 'index-2',
        component: Index2Component
    },
    {
        path: 'index-3',
        component: Index3Component
    },
    {
        path: 'index-4',
        component: Index4Component
    },
    {
        path: 'index-5',
        component: Index5Component
    },
    {
        path: 'index-6',
        component: Index6Component
    },
    {
        path: 'add-shipment',
        component: AddShipmentComponent
    },
    {
        path: 'my-shipment',
        component: ShipmentListComponent
    },
    {
        path: 'about-us',
        component: AboutComponent
    },
    {
        path: 'solution-services',
        component: SolutionServiceComponent
    },
    {
        path: 'faq',
        component: FaqComponent
    },
    {
        path: 'my-profile',
        component: MyProfileComponent
    },
    {
        path: 'reset-password',
        component: ResetPasswordComponent
    },
    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule { }
