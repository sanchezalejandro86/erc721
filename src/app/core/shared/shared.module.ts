import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HeaderComponent} from "../header/header.component";
import {FooterComponent} from "../footer/footer.component";
// import {Web3Service} from "./web3.service-old";
import {RouterModule} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {ErrorConsoleComponent} from "../error-console/error-console.component";

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
  declarations: [
    HeaderComponent,
    FooterComponent,
    ErrorConsoleComponent,
  ],
  exports: [
    CommonModule,
    RouterModule,
    FormsModule,
    HeaderComponent,
    FooterComponent,
    ErrorConsoleComponent,
  ]
})
export class SharedModule { }
