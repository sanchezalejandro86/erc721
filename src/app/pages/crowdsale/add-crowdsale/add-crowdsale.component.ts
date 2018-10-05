import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Web3Service} from "../../../core/shared/web3.service";
import {ErrorConsoleService} from "../../../core/error-console/error-console.service";
import {Token} from "../../../core/shared/token.model";
import {Router} from "@angular/router";

declare var $: any;
declare let require: any;
const demotoken_artifacts = require('../../../../../build/contracts/DemoToken.json')
const crowdsalelist_artifacts = require('../../../../../build/contracts/CrowdsaleList.json');
const democrowdsale_artifacts = require('../../../../../build/contracts/DemoCrowdsale.json');

@Component({
  selector: 'app-add-crowdsale',
  templateUrl: './add-crowdsale.component.html',
  styleUrls: ['./add-crowdsale.component.css']
})
export class AddCrowdsaleComponent implements OnInit, AfterViewInit {
  constructor(
      private web3Service: Web3Service,
      private errorConsole: ErrorConsoleService,
      private router: Router
  ){}

  DemoToken: any;
  DemoCrowdsale: any;
  CrowdsaleList: any;

  tokens: Token[];
  account: string;
  desde: any;
  hasta: any;

  ngOnInit() {
    this.watchAccount();
    this.web3Service.artifactsToContract(demotoken_artifacts)
        .then((DemoTokenAbstraction) => {
          this.DemoToken = DemoTokenAbstraction;
          this.refreshTokens();
        });
    this.web3Service.artifactsToContract(democrowdsale_artifacts)
        .then((DemoCrowdsaleAbstraction) => {
          this.DemoCrowdsale = DemoCrowdsaleAbstraction;
    });
    this.web3Service.artifactsToContract(crowdsalelist_artifacts)
        .then((CrowdsaleListAbstraction) => {
          this.CrowdsaleList = CrowdsaleListAbstraction;
        });
  }

  watchAccount() {
    this.account = this.web3Service.getAccount();
    this.web3Service.accountsObservable.subscribe((accounts) => {
      this.account = this.web3Service.getAccount();
    });
  }

  async refreshTokens() {
    try {
      const deployedDemoToken = await this.DemoToken.deployed();
      let owner = await deployedDemoToken.owner.call();
      let _tokens = await deployedDemoToken.tokensOfOwner.call(owner);
      this.tokens = [];
      for(let i=0; i<_tokens.length; i++){
        let _description = await deployedDemoToken.tokenURI.call(_tokens[i]);
        this.tokens.push(new Token(_tokens[i], _description));
      }
    } catch (e) {
      console.log(e);
      this.errorConsole.showMessage('Error getting tokens; see log.');
    }
  }


  ngAfterViewInit(): void {
    $('#datetimepicker_desde').datetimepicker();
    $('#datetimepicker_hasta').datetimepicker();
  }

  async crearCrowdsale(){
      let openingTime = Math.trunc($('#datetimepicker_desde').datetimepicker("getDate").getTime()/1000);
      let closingTime = Math.trunc($('#datetimepicker_hasta').datetimepicker("getDate").getTime()/1000);

      try {
        console.log({
              account: this.web3Service.getAccount(),
              token: this.DemoToken.address,
              openingTime: openingTime,
              closingTime: closingTime
            });

        this.DemoCrowdsale.web3.eth.defaultAccount = this.web3Service.getAccount();

        const newDemoCrowsale = await this.DemoCrowdsale.new(
            this.web3Service.getAccount(), this.DemoToken.address, openingTime, closingTime);

        const deployedDemoToken = await this.DemoToken.deployed();
        const owner = this.web3Service.getAccount();

        for(let i=0; i<this.tokens.length; i++){
          await newDemoCrowsale.addToken(this.tokens[i].id, this.tokens[i].description, this.tokens[i].price, {from: owner})
          await deployedDemoToken.safeTransferFrom(owner, newDemoCrowsale.address, this.tokens[i].id, {from: owner, gas: 1000000});
        }

        const deployedCrowdsaleList = await this.CrowdsaleList.deployed();
        await deployedCrowdsaleList.addCrowdsale(newDemoCrowsale.address, {from: this.web3Service.getAccount()});

        this.router.navigate(["/crowdsale"]);

      } catch (e) {
        console.log(e);
        this.errorConsole.showMessage('Error getting crowdsale; see log.');
      }
  }
}
