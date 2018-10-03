import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CrowdsaleComponent} from "./crowdsale.component";
import {AddCrowdsaleComponent} from "./add-crowdsale/add-crowdsale.component";

export const crowdsaleRoutes: Routes = [
	{ path: '', component: CrowdsaleComponent },
    { path: 'nueva', component: AddCrowdsaleComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(crowdsaleRoutes)
  ],
  exports: [
		RouterModule
	]
})
export class CrowdsaleRoutingModule { }
