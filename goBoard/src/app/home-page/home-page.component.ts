import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild, Renderer } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { Note } from './note';
import { AuthService } from '../providers/auth.service';
import { Router } from '@angular/router';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AppComponent } from '../app.component';

@Component({
    selector: 'app-home-page',
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.css'],
})

export class HomePageComponent implements AfterViewChecked, OnDestroy {

    colorlist = ['#FFCDD2', '#F8BBD0', '#E1BEE7', '#D1C4E9', '#C5CAE9', '#BBDEFB',
        '#B2EBF2', '#B2DFDB', '#C8E6C9', '#F0F4C3', '#FFECB3', '#FFE0B2', '#FFCCBC'];
    randomNumber;
    rcolor;
    private debug = false;        // debug switch
    private x: number;
    private y: number;
    private rect: any;

    myNoteList:FirebaseListObservable<Note[]>;
    items: FirebaseListObservable<any>;
    noteArray:any[];
    name: string;
    email: string;
    userID: string;
    msgVal: string;
    private chatIsHidden = false;

    constructor(
        public af: AngularFireDatabase,
        public ac: AppComponent,
        private authService: AuthService,
        private router: Router,
        private _renderer: Renderer,
        private _el: ElementRef) {
            this.name = ac.user_displayName;
            this.email = ac.user_email;
            this.userID = ac.user_ID;
            this.items = af.list('/messages');
            this.myNoteList = af.list('users/' + this.userID.toString() + '/notes');
    }

    @ViewChild('scrollMe') private myScrollContainer: ElementRef;

    ngAfterViewChecked() {
        this.scrollToBottom();
    }

    scrollToBottom(): void {
        try {
            this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
        } catch (err) { }
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['login']);
    }

    sendNoteToFirebase(note: Note) {
        this.myNoteList.push({ desc: note.desc, bgcolor: note.bgcolor, x: note.x , y: note.y });
    }

    sendMessage(theirMessage: string) {
        if (this.ac.isLoggedIn === true) {
            this.name = this.ac.user_displayName;
        }
        this.items.push({ message: theirMessage, name: this.name });
        this.msgVal = '';
    }

    onDrag(note: Note) {
        this.rect = document.getElementById('note').getBoundingClientRect();
        this.x = this.rect.left;
        this.y = this.rect.top;
        note.x = this.x;
        note.y = this.y;
         setTimeout((_) => {
                this.myNoteList.update(note.key.toString(), note);
        }, 5000);
        if (this.debug) {// Debug
            setTimeout(() => {
                console.log(' realXY:', this.x, this.y);
            }, 100);
        }
    }

    onPress(desc: string) {
        this.randomNumber = Math.floor(Math.random() * this.colorlist.length);
        this.rcolor = this.colorlist[this.randomNumber];
        if (desc) {
            this.x = 0;
            this.y = 0;
            let note = new Note(desc, this.rcolor, this.x, this.y);
            note.key = this.myNoteList.push(note).key;
            this.myNoteList.update(note.key.toString(), note);
            if (this.debug) {// Debug
                console.log('inside onPress');
                setTimeout(() => {
                    console.log('note id', document.getElementById('note').getBoundingClientRect());
                }, 1000);
                console.log(JSON.stringify(desc));
            }
        }
    }

    removeNote(note: Note) {
        this.myNoteList.remove(note.key);
    }

    ngOnInit(){
    }

    ngOnDestroy() {
    }

}

//  onPress(desc: string) {
//         this.randomNumber = Math.floor(Math.random() * this.colorlist.length);
//         this.rcolor = this.colorlist[this.randomNumber];
//         this.rect = document.getElementById('note').getBoundingClientRect();
//         if (desc) {
//             this.x = this.rect.left;
//             this.y = this.rect.top;
//             let note = new Note(desc, this.rcolor, this.x, this.y);
//             note.key = this.myNoteList.push(note).key;
//             this.myNoteList.update(note.key.toString(), note);
//             if (this.debug) {// Debug
//                 setTimeout(() => {
//                     console.log('note id', document.getElementById('note').getBoundingClientRect());
//                 }, 1000);
//                 console.log(JSON.stringify(desc));
//             }
//         }
//     }
