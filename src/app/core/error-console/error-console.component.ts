import {Component, OnDestroy, OnInit} from '@angular/core';
import {ErrorConsoleService} from "./error-console.service";
import {Subscription} from "rxjs/index";

@Component({
  selector: 'app-error-console',
  templateUrl: './error-console.component.html',
  styleUrls: ['./error-console.component.scss']
})
export class ErrorConsoleComponent implements OnInit, OnDestroy {
  msgSubs: Subscription;
  message: string;

  constructor(private errorConsoleService: ErrorConsoleService) { }

  ngOnInit() {
    this.msgSubs = this.errorConsoleService.getMessage().subscribe(msg => this.message = msg);
  }

  ngOnDestroy(){
    this.msgSubs.unsubscribe();
  }
}
