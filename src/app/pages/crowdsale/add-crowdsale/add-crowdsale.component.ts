import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Web3Service} from "../../../core/shared/web3.service";
import {ErrorConsoleService} from "../../../core/error-console/error-console.service";
declare var $: any;
declare let require: any;
const demotoken_artifacts = require('../../../../../build/contracts/DemoToken.json');
const democrowdsale_artifacts = require('../../../../../build/contracts/DemoCrowdsale.json');

@Component({
  selector: 'app-add-crowdsale',
  templateUrl: './add-crowdsale.component.html',
  styleUrls: ['./add-crowdsale.component.css']
})
export class AddCrowdsaleComponent implements OnInit, AfterViewInit {

  constructor(
      private web3Service: Web3Service,
      private errorConsole: ErrorConsoleService
  ){}

  DemoToken: any;
  DemoCrowdsale: any;

  tokens: any;
  account: string;

  ngOnInit() {
    this.watchAccount();
    this.web3Service.artifactsToContract(demotoken_artifacts)
        .then((DemoTokenAbstraction) => {
          this.DemoToken = DemoTokenAbstraction;
          // this.DemoToken.detectNetwork();
        });
    this.web3Service.artifactsToContract(democrowdsale_artifacts)
        .then((DemoCrowdsaleAbstraction) => {
          this.DemoCrowdsale = DemoCrowdsaleAbstraction;
          // this.DemoCrowdsale.detectNetwork();
    });
  }

  watchAccount() {
    this.web3Service.accountsObservable.subscribe((accounts) => {
      this.account = accounts[0];
      this.refreshTokens();
    });
  }

  async refreshTokens() {
    try {
      const deployedDemoToken = await this.DemoToken.deployed();
      const tokens = await deployedDemoToken.tokensOfOwner.call(this.account);
      this.tokens = tokens;
    } catch (e) {
      console.log(e);
      this.setStatus('Error getting tokens; see log.');
    }
  }

  setStatus(status) {
    this.errorConsole.showMessage(status);
  }

  ngAfterViewInit(): void {
    $('#datetimepicker_desde').datetimepicker({
      language: 'es-AR'
    });
    $('#datetimepicker_hasta').datetimepicker({
      language: 'es-AR'
    });
  }

  async crearCrowdsale(){

    try {
      let openingTime = $('#datetimepicker_desde').data('datetimepicker').getLocalDate();
      let closingTime = $('#datetimepicker_hasta').data('datetimepicker').getLocalDate();

      try {
        const newDemoCrowsale = await this.DemoCrowdsale.new(
            this.account, this.DemoToken.address, openingTime, closingTime);

        await newDemoCrowsale.addToken(this.account);

      } catch (e) {
        console.log(e);
        this.setStatus('Error creating crowsale; see log.');
    }
  }
}
