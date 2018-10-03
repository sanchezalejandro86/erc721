import {NgModule} from "@angular/core";
import {CrowdsaleComponent} from "./crowdsale.component";
import {SharedModule} from "../../core/shared/shared.module";
import {CrowdsaleRoutingModule} from "./crowdsale-routing.module";
import { AddCrowdsaleComponent } from './add-crowdsale/add-crowdsale.component';

@NgModule({
  imports: [
    SharedModule,
    CrowdsaleRoutingModule
  ],
  declarations: [CrowdsaleComponent, AddCrowdsaleComponent]
})
export class CrowdsaleModule { }
