import { Component, OnInit } from '@angular/core';
import {AuthGuard} from "../auth-guard.service";
import {UserModel} from "../models/user-model";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  constructor(private readonly authGuard: AuthGuard) {

  }

  ngOnInit(): void {

  }

  get user(): UserModel {
    return this.authGuard.userView;
  }

  logOut(): void {
    this.authGuard.logOut();
  }

}
