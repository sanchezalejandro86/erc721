import {Inject, Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs/index";

@Injectable()
export class ErrorConsoleService {
    private message = new BehaviorSubject<string>("");

    constructor() {
    }

    showMessage(error:string){
        this.message.next(error);
    }

    getMessage(){
        return this.message;
    }
}
