import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";

export const appRoutes: Routes = [
  { path: '', loadChildren: "./pages/home/home.module#HomeModule"  },
  { path: 'profile', loadChildren: "./pages/profile/profile.module#ProfileModule" },
  { path: 'crowdsale', loadChildren: "./pages/crowdsale/crowdsale.module#CrowdsaleModule" },
  { path: 'tokens', loadChildren: "./pages/tokens/tokens.module#TokensModule" }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, {onSameUrlNavigation: 'reload'})
  ],
  exports: [
    RouterModule
  ]
})

export class AppRoutingModule { }
