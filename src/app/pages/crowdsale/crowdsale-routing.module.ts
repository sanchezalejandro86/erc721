import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CrowdsaleComponent} from "./crowdsale.component";
import {AddCrowdsaleComponent} from "./add-crowdsale/add-crowdsale.component";
import {SellTokensComponent} from "./sell-tokens/sell-tokens.component";

export const crowdsaleRoutes: Routes = [
	{ path: '', component: CrowdsaleComponent },
    { path: 'nueva', component: AddCrowdsaleComponent },
    { path: 'vender/:address', component: SellTokensComponent }
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
