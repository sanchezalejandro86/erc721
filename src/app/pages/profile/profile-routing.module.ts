import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ProfileComponent} from "./profile.component";

export const homeRoutes: Routes = [
	{ path: '', component: ProfileComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(homeRoutes)
  ],
  exports: [
		RouterModule
	]
})
export class ProfileRoutingModule { }
