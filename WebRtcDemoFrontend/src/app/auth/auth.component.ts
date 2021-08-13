import { Component, OnInit } from '@angular/core';
import {AuthGuard} from "../auth-guard.service";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  constructor(private readonly authGuard: AuthGuard) {
    if (authGuard.user) {
      authGuard.navigateToRoot();
    }
  }

  ngOnInit(): void {

  }

}
