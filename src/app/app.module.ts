import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";

import {AppComponent} from "./app.component";
import {SharedModule} from "./core/shared/shared.module";
import {AppRoutingModule} from "./app-routing.module";
import {HomeModule} from "./pages/home/home.module";
import {Web3Service} from "./core/shared/web3.service";
import {ProfileModule} from "./pages/profile/profile.module";
import {ErrorConsoleService} from "./core/error-console/error-console.service";

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    SharedModule,
    HomeModule,
    ProfileModule,
    AppRoutingModule
  ],
  providers: [
      Web3Service,
      ErrorConsoleService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
