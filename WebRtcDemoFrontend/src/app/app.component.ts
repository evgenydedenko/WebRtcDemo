import { Component } from '@angular/core';
import {AuthGuard} from "./auth-guard.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private readonly authGuard: AuthGuard) {

  }
}
