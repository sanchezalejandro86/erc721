import { Component, OnInit } from '@angular/core';
import {Web3Service} from "../../core/shared/web3.service";
import {ErrorConsoleService} from "../../core/error-console/error-console.service";
import {tokenName} from "@angular/compiler";
import {Token} from "../../core/shared/token.model";

declare let require: any;
const demotoken_artifacts = require('../../../../build/contracts/DemoToken.json');

@Component({
  selector: 'app-tokens',
  templateUrl: './tokens.component.html',
  styleUrls: ['./tokens.component.css']
})
export class TokensComponent implements OnInit {

  name: string;
  symbol: string;
  address: string;
  DemoToken: any;
  tokens: Token[];
  owner: string;
  tokenName: string;

  constructor(
      private web3Service: Web3Service,
      private errorConsole: ErrorConsoleService
  ){}

  ngOnInit() {
    this.web3Service.artifactsToContract(demotoken_artifacts)
        .then(async (DemoTokenAbstraction) => {
          this.DemoToken = DemoTokenAbstraction;

          try {
            const deployedDemoToken = await this.DemoToken.deployed();
            this.address = deployedDemoToken.address;
            this.owner = await deployedDemoToken.owner.call();
            this.name = await deployedDemoToken.name.call();
            this.symbol = await deployedDemoToken.symbol.call();
            this.refreshTokens();
          } catch (e) {
            console.log(e);
            this.errorConsole.showMessage('Error getting tokens; see log.');
          }
        });
  }

  async crearToken(){
    try{
      const deployedDemoToken = await this.DemoToken.deployed();
      await deployedDemoToken.mint(this.tokenName, {from: this.web3Service.getAccount()});
      this.tokenName = '';
      this.refreshTokens();
    } catch (e) {
      console.log(e);
      this.errorConsole.showMessage('Error creating token; see log.');
    }
  }

  async refreshTokens(){
    const deployedDemoToken = await this.DemoToken.deployed();
    let totalTokens = await deployedDemoToken.totalSupply.call();
    this.tokens = [];
    for(let i=0; i<totalTokens; i++){
      let _tokenId = await deployedDemoToken.tokenByIndex.call(i)
      let _description = await deployedDemoToken.tokenURI.call(_tokenId);
      this.tokens.push(new Token(_tokenId, _description));
    }
  }

}
