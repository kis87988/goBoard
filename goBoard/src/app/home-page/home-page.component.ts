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

    public notes: Array<Note> = [];
    colorlist = ['#FFCDD2', '#F8BBD0', '#E1BEE7', '#D1C4E9', '#C5CAE9', '#BBDEFB',
        '#B2EBF2', '#B2DFDB', '#C8E6C9', '#F0F4C3', '#FFECB3', '#FFE0B2', '#FFCCBC'];
    randomNumber;
    rcolor;
    private debug = false;        // debug switch
    private x: number;
    private y: number;
    private rect: any;

    myNoteList: FirebaseListObservable<any>;
    items: FirebaseListObservable<any>;
    name: string;
    email: string;
    userID: string;
    msgVal: string;

    private chatIsHidden = false;
    private dark = false;

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

    toggleDark() {
        if (this.dark)  {
            document.getElementById('bodyContent').className = "lightMode";
        }
        else {
            document.getElementById('bodyContent').className = "darkMode";
        }
        this.dark = !this.dark;
    }

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
        note.setPosition(this.x, this.y);
        if (this.debug) {// Debug
            setTimeout(() => {
                console.log(' realXY:', this.x, this.y);
                console.log(' noteXY:', note.getX(), note.getY());
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
            this.notes.push(note);
            this.sendNoteToFirebase(note);
            if (this.debug) {// Debug
                console.log('inside onPress', this.notes);
                setTimeout(() => {
                    console.log('note id', document.getElementById('note').getBoundingClientRect());
                }, 1000);
                console.log(JSON.stringify(desc));
            }
        }
    }

    removeNote(note: Note) {
        this.notes.splice(this.notes.indexOf(note), 1);
    }

    ngOnInit(){
    }

    ngOnDestroy() {
    }

}
