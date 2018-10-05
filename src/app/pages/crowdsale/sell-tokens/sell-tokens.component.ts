import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Web3Service} from "../../../core/shared/web3.service";
import {ErrorConsoleService} from "../../../core/error-console/error-console.service";
import {Token} from "../../../core/shared/token.model";

declare let require: any;
const democrowdsale_artifacts = require('../../../../../build/contracts/DemoCrowdsale.json');

@Component({
  selector: 'app-sell-tokens',
  templateUrl: './sell-tokens.component.html',
  styleUrls: ['./sell-tokens.component.css']
})
export class SellTokensComponent implements OnInit, OnDestroy {
  private sub: any;
  DemoCrowdsale: any;
  deployedDemoCrowdsale: any;
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

      this.web3Service.artifactsToContract(democrowdsale_artifacts)
        .then(async (DemoCrowdsaleAbstraction) => {
          this.DemoCrowdsale = DemoCrowdsaleAbstraction;

          try {
            this.deployedDemoCrowdsale = await this.DemoCrowdsale.at(address);
            this.refreshTokens();
          } catch (e) {
            console.log(e);
            this.errorConsole.showMessage('Error getting tokens; see log.');
          }
      });
    });
  }

  async refreshTokens(){
    let totalTokens = await this.deployedDemoCrowdsale.getNumberOfTokens.call();
    this.tokens = [];
    for(let i=0; i<totalTokens; i++){
      let _token = await this.deployedDemoCrowdsale.getTokenByIndex.call(i);
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
    await this.deployedDemoCrowdsale.sellToken(this.sellingToken.id, this.ethReceiver, {from: this.web3Service.getAccount()});
    this.router.navigate(["/crowdsale/vender"]);
  }
}
