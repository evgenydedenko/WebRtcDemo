import {Injectable, NgZone, EventEmitter } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import GoogleUser = gapi.auth2.GoogleUser;
import {environment} from "../environments/environment";
import {UserService} from "./services/user.service";
import {UserModel} from "./models/user-model";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private readonly loadPromise: Promise<void>;
  private readonly gapi = window.gapi;
  private _user: GoogleUser | undefined;
  private _userView: UserModel = new UserModel();
  userLoaded = new EventEmitter();

  constructor(private readonly ngZone: NgZone,
              private readonly router: Router,
              private readonly userService: UserService) {
    (window as any).onSignIn = (user: GoogleUser) => ngZone.run(() => {
      this.user = user;
      this.checkUserInDb(true);
    });
    this.loadPromise = this.loadAuth();
  }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.loadPromise) {
      await this.loadPromise;
    }

     if (this.gapi.auth2.getAuthInstance().isSignedIn.get()) {
       return true;
     } else {
       this.navigateToAuth();
       return false;
     }
  }

  get user(): GoogleUser | undefined {
    return this._user;
  }

  set user(value: GoogleUser | undefined) {
    this._user = value;
    this._userView.fillData(this._user?.getBasicProfile());
  }

  get userView(): UserModel {
    return this._userView;
  }

  logOut(): void {
    this.gapi.auth2.getAuthInstance().signOut();
    this.user = undefined;
    this.navigateToAuth();
  }

  navigateToRoot(): void {
    this.router.navigate(['']);
  }

  navigateToAuth(): void {
    location.replace('/auth');
  }

  async initAuth(): Promise<void> {
    return await new Promise((resolve) => {
      this.gapi.auth2.init({
        client_id: environment.googleClientKey,
        scope: environment.googleScope
      }).then(some => {
        this.user = this.gapi.auth2.getAuthInstance().currentUser.get();
        this.checkUserInDb();
        resolve();
      });
    });
  }

  private async loadAuth(): Promise<void> {
    await new Promise<void>((resolve) => {
      this.gapi.load('auth2', resolve);
    });

    return this.initAuth();
  }

  private checkUserInDb(redirectToRoot: boolean = false): void {
    const sub = this.userService.getOrInsert(this.userView).subscribe(res => {
      sub.unsubscribe();
      this.userView.assign(res);
      this.userLoaded.emit();
      if (redirectToRoot) {
        this.navigateToRoot();
      }
    }, () => {
      sub.unsubscribe();
    });
  }
}
