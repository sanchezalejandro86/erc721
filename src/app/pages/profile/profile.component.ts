import {Component, OnDestroy, OnInit} from "@angular/core";
import {Web3Service} from "../../core/shared/web3.service";
import {ErrorConsoleService} from "../../core/error-console/error-console.service";

declare let require: any;
const demotoken_artifacts = require('../../../../build/contracts/DemoToken.json');

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

  accounts: string[];
  account: string;
  DemoToken: any;
  tokens: number[];

  ngOnInit() {
    this.watchAccount();
    this.web3Service.artifactsToContract(demotoken_artifacts)
        .then((MetaCoinAbstraction) => {
          this.DemoToken = MetaCoinAbstraction;
        });
  }

  watchAccount() {
    this.web3Service.accountsObservable.subscribe((accounts) => {
      this.accounts = accounts;
      this.account = accounts[0];
      this.refreshTokens();
    });
  }

  async refreshTokens() {
    console.log('Refreshing tokens');

    try {
      const deployedDemoToken = await this.DemoToken.deployed();
      console.log(deployedDemoToken);
      console.log('Account', this.account);
      const tokens = await deployedDemoToken.tokensOfOwner.call(this.account);
      console.log('Found balance: ' + tokens);
      this.tokens = tokens;
    } catch (e) {
      console.log(e);
      this.setStatus('Error getting balance; see log.');
    }
  }

  setStatus(status) {
    this.errorConsole.showMessage(status);
  }

  ngOnDestroy(){
  }
}
