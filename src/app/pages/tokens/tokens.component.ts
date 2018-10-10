import { Component, OnInit } from '@angular/core';
import {Web3Service} from "../../core/shared/web3.service";
import {ErrorConsoleService} from "../../core/error-console/error-console.service";
import {tokenName} from "@angular/compiler";
import {Token} from "../../core/shared/token.model";

declare let require: any;
const LOSKToken_artifacts = require('../../../../build/contracts/LOSKToken.json');

@Component({
  selector: 'app-tokens',
  templateUrl: './tokens.component.html',
  styleUrls: ['./tokens.component.css']
})
export class TokensComponent implements OnInit {

  name: string;
  symbol: string;
  address: string;
  LOSKToken: any;
  tokens: Token[];
  owner: string;
  tokenName: string;

  constructor(
      private web3Service: Web3Service,
      private errorConsole: ErrorConsoleService
  ){}

  ngOnInit() {
    this.web3Service.artifactsToContract(LOSKToken_artifacts)
        .then(async (LOSKTokenAbstraction) => {
          this.LOSKToken = LOSKTokenAbstraction;

          try {
            const deployedLOSKToken = await this.LOSKToken.deployed();
            this.address = deployedLOSKToken.address;
            this.owner = await deployedLOSKToken.owner.call();
            this.name = await deployedLOSKToken.name.call();
            this.symbol = await deployedLOSKToken.symbol.call();
            this.refreshTokens();
          } catch (e) {
            console.log(e);
            this.errorConsole.showMessage('Error getting tokens; see log.');
          }
        });
  }

  async crearToken(){
    try{
      const deployedLOSKToken = await this.LOSKToken.deployed();
      await deployedLOSKToken.mint(this.tokenName, {from: this.web3Service.getAccount()});
      this.tokenName = '';
      this.refreshTokens();
    } catch (e) {
      console.log(e);
      this.errorConsole.showMessage('Error creating token; see log.');
    }
  }

  async refreshTokens(){
    const deployedLOSKToken = await this.LOSKToken.deployed();
    let totalTokens = await deployedLOSKToken.totalSupply.call();
    this.tokens = [];
    for(let i=0; i<totalTokens; i++){
      let _tokenId = await deployedLOSKToken.tokenByIndex.call(i)
      let _description = await deployedLOSKToken.tokenURI.call(_tokenId);
      this.tokens.push(new Token(_tokenId, _description));
    }
  }

}
