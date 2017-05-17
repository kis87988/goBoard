import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from './providers/auth.service';
import { Router } from '@angular/router';
import {} from 'jasmine';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent {
  public isLoggedIn: Boolean;
  public user_displayName: string;
  public user_email: string;
  public user_ID: string;
  private debug = false; // debug switch

  constructor (private authService: AuthService, private router: Router) {
    this.authService.user.subscribe(
      (auth) => {
        if (auth == null) {
          this.isLoggedIn = false;
          this.user_displayName = 'logged out';
          this.user_email = '';
          this.router.navigate(['login']);
        } else {
          this.isLoggedIn = true;
          if (this.debug) debugger;
          this.user_displayName = auth.displayName;
          if (this.debug) debugger;
          this.user_email = auth.email;
          this.user_ID = auth.email.split('@')[0];
          this.router.navigate(['']);
        }
      }
    );
  }
}
