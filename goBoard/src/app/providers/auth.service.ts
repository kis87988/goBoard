import { Injectable } from '@angular/core';
//import { AngularFire, AuthProviders, AuthMethods } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';
// Do not import from 'firebase' as you'd lose the tree shaking benefits
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';

import { } from 'jasmine';

@Injectable()
export class AuthService {
    user: Observable<firebase.User>;
    constructor(public af: AngularFireAuth) {
          this.user = af.authState;
    }

    /* Firebase stuff */
    login() {
        return this.af.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    }

    logout() {
        return this.af.auth.signOut();
    }

}
