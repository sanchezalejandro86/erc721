import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Web3Service} from "../../../core/shared/web3.service";
import {ErrorConsoleService} from "../../../core/error-console/error-console.service";
import {Token} from "../../../core/shared/token.model";

declare let require: any;
const loskcrowdsale_artifacts = require('../../../../../build/contracts/LOSKCrowdsale.json');

@Component({
  selector: 'app-sell-tokens',
  templateUrl: './sell-tokens.component.html',
  styleUrls: ['./sell-tokens.component.css']
})
export class SellTokensComponent implements OnInit, OnDestroy {
  private sub: any;
  LOSKCrowdsale: any;
  deployedLOSKCrowdsale: any;
  tokens: Token[];
  ethReceiver: string;
  sellingToken: Token = new Token(0, '');

  constructor( private route: ActivatedRoute,
               private router: Router,
               private web3Service: Web3Service,
               private errorConsole: ErrorConsoleService) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      let address = params['address'];

      this.web3Service.artifactsToContract(loskcrowdsale_artifacts)
        .then(async (LOSKCrowdsaleAbstraction) => {
          this.LOSKCrowdsale = LOSKCrowdsaleAbstraction;

          try {
            this.deployedLOSKCrowdsale = await this.LOSKCrowdsale.at(address);
            this.refreshTokens();
          } catch (e) {
            console.log(e);
            this.errorConsole.showMessage('Error getting tokens; see log.');
          }
      });
    });
  }

  async refreshTokens(){
    let totalTokens = await this.deployedLOSKCrowdsale.getNumberOfTokens.call();
    this.tokens = [];
    for(let i=0; i<totalTokens; i++){
      let _token = await this.deployedLOSKCrowdsale.getTokenByIndex.call(i);
      console.log(_token);
      this.tokens.push(new Token(
          +_token[0],
          _token[1],
          +_token[2],
          _token[3]
      ));
    }
  }

  ngOnDestroy(){
    this.sub.unsubscribe();
  }

  sell(t: Token){
    this.sellingToken = t;
  }

  async sellToken(){
    console.log({tokenId: this.sellingToken.id, ethReceiver: this.ethReceiver});
    await this.deployedLOSKCrowdsale.sellToken(this.sellingToken.id, this.ethReceiver, {from: this.web3Service.getAccount()});
    this.router.navigate(["/crowdsale/vender"]);
  }
}
