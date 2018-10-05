import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TokensComponent } from './tokens.component';
import {TokensRoutingModule} from "./tokens-routing.module";
import {SharedModule} from "../../core/shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    TokensRoutingModule
  ],
  declarations: [TokensComponent]
})
export class TokensModule { }
