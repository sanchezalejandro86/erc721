import {NgModule} from "@angular/core";
import {CrowdsaleComponent} from "./crowdsale.component";
import {SharedModule} from "../../core/shared/shared.module";
import {CrowdsaleRoutingModule} from "./crowdsale-routing.module";
import { AddCrowdsaleComponent } from './add-crowdsale/add-crowdsale.component';
import { SellTokensComponent } from './sell-tokens/sell-tokens.component';

@NgModule({
  imports: [
    SharedModule,
    CrowdsaleRoutingModule
  ],
  declarations: [CrowdsaleComponent, AddCrowdsaleComponent, SellTokensComponent]
})
export class CrowdsaleModule { }
