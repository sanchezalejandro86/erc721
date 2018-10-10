import { Component, OnInit } from '@angular/core';
import {Web3Service} from "../../core/shared/web3.service";
import {ErrorConsoleService} from "../../core/error-console/error-console.service";
import {Crowdsale} from "../../core/shared/token.model";

declare let require: any;
const crowdsalelist_artifacts = require('../../../../build/contracts/CrowdsaleList.json');
const loskcrowdsale_artifacts = require('../../../../build/contracts/LOSKCrowdsale.json');

@Component({
  selector: 'app-crowdsale',
  templateUrl: './crowdsale.component.html',
  styleUrls: ['./crowdsale.component.scss']
})
export class CrowdsaleComponent implements OnInit {
  crowdsales: Crowdsale[];

  constructor(
      private web3Service: Web3Service,
      private errorConsole: ErrorConsoleService,
  ){}

  CrowdsaleList: any;
  LOSKCrowdsale: any;

  ngOnInit() {
    this.web3Service.artifactsToContract(crowdsalelist_artifacts)
        .then((CrowdsaleListAbstraction) => {
          this.CrowdsaleList = CrowdsaleListAbstraction;

          this.refreshCrowdsales();
        });
    this.web3Service.artifactsToContract(loskcrowdsale_artifacts)
        .then((LOSKCrowdsaleAbstraction) => {
          this.LOSKCrowdsale = LOSKCrowdsaleAbstraction;
        });
  }

  async refreshCrowdsales() {
    try {
      const deployedCrowdsaleList = await this.CrowdsaleList.deployed();
      let totalCrowsales = await deployedCrowdsaleList.getCrowdsaleCount.call();
      this.crowdsales = [];
      for(let i=0; i<totalCrowsales; i++){
        let _crowdsale = await deployedCrowdsaleList.getCrowdsaleByIndex.call(i);
        let _crowdsaleContract = await this.LOSKCrowdsale.at(_crowdsale);
        this.crowdsales.push(
            new Crowdsale(
                _crowdsale,
                await _crowdsaleContract.openingTime.call(),
                await _crowdsaleContract.closingTime.call(),
                new Date().getTime()/1000 > await _crowdsaleContract.closingTime.call(),
                await _crowdsaleContract.released.call(),
            )
        );
      }
      console.log(this.crowdsales);
    } catch (e) {
      console.log(e);
      this.errorConsole.showMessage('Error getting tokens; see log.');
    }
  }

  async withdraw(crowdsale: string){
    try {
      let _crowdsaleContract = await this.LOSKCrowdsale.at(crowdsale);
      await _crowdsaleContract.withdrawTokens({from: this.web3Service.getAccount(), gas: 1000000});
    } catch (e) {
      console.log(e);
      this.errorConsole.showMessage('Error releasing tokens; see log.');
    }
  }
}
