import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {TokensComponent} from "./tokens.component";

export const tokensRoutes: Routes = [
	{ path: '', component: TokensComponent}
];

@NgModule({
  imports: [
    RouterModule.forChild(tokensRoutes)
  ],
  exports: [
		RouterModule
	]
})
export class TokensRoutingModule { }
