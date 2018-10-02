import {Component, OnInit} from '@angular/core';
import {Web3Service} from "./core/shared/web3.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

   constructor(private web3Service: Web3Service){
   }

  ngOnInit(){
     // this.web3Service.bootstrapWeb3();
  }
}
