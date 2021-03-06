import {Component, OnDestroy, OnInit} from "@angular/core";
import {Web3Service} from "../../core/shared/web3.service";
import {ErrorConsoleService} from "../../core/error-console/error-console.service";
import {Token} from "../../core/shared/token.model";

declare let require: any;
const LOSKToken_artifacts = require('../../../../build/contracts/LOSKToken.json');

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {


  constructor(
      private web3Service: Web3Service,
      private errorConsole: ErrorConsoleService
  ){}

  account: string;
  LOSKToken: any;
  tokens: Token[];

  ngOnInit() {
    this.watchAccount();
    this.web3Service.artifactsToContract(LOSKToken_artifacts)
        .then((LOSKTokenAbstraction) => {
          this.LOSKToken = LOSKTokenAbstraction;
          this.refreshTokens();
        });
  }

  watchAccount() {
    this.account = this.web3Service.getAccount();
    this.web3Service.accountsObservable.subscribe((accounts) => {
      this.account = this.web3Service.getAccount();
      this.refreshTokens();
    });
  }

  async refreshTokens() {
    console.log('Refreshing tokens');

    try {
      const deployedLOSKToken = await this.LOSKToken.deployed();
      console.log(deployedLOSKToken);
      console.log('Account', this.web3Service.getAccount());
      const _tokens = await deployedLOSKToken.tokensOfOwner.call(this.web3Service.getAccount());
      console.log('Found tokens: ' + _tokens);
      this.tokens = [];
      for(let i=0; i<_tokens.length; i++){
        let _description = await deployedLOSKToken.tokenURI.call(_tokens[i]);
        this.tokens.push(new Token(_tokens[i], _description));
      }
    } catch (e) {
      console.log(e);
      this.errorConsole.showMessage('Error getting tokens; see log.');
    }
  }

  ngOnDestroy(){
  }
}
