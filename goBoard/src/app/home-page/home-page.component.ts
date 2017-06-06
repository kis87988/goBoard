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
    private debug = false;        // debug switch
    private x: number;
    private y: number;
    private rect: any;

    myNoteList: FirebaseListObservable<Note[]>;
    items: FirebaseListObservable<any>;
    noteArray = new Array;
    sprintArray: FirebaseListObservable<any>;
    name: string;
    email: string;
    userID: string;
    msgVal: string;
    private chatIsHidden = false;
    private dark = false;
    private sprint = 'default';
    af: AngularFireDatabase;
    constructor(
        af: AngularFireDatabase,
        public ac: AppComponent,
        private authService: AuthService,
        private router: Router,
        private _renderer: Renderer,
        private _el: ElementRef) {
            this.af = af;
            this.name = ac.user_displayName;
            this.email = ac.user_email;
            this.userID = ac.user_ID;
            this.items = af.list('/messages');
            this.sprintArray = af.list('users/' + this.userID.toString() + '/springArray');
            this.switchNoteList();
    }
    @ViewChild('scrollMe') private myScrollContainer: ElementRef;
    addSprint(newSprint: string) {
        const keyValue = this.sprintArray.push({key: '', name: newSprint}).key;
        this.sprintArray.update(keyValue, {key: keyValue});
        this.sprint = newSprint;
        this.switchNoteList();
    }
    delSprint(name: string) {
        if (name === 'default') { return; }
        let key;
        this.sprintArray.forEach(async element => {
            for (const e of element){
                if (e.name === name) {
                    key = e.key;
                }
            }
        });
        this.sprintArray.remove(key);
        this.myNoteList.remove();
        this.sprint = 'default';
        this.switchNoteList();
    }
    onChange(newValue) {
        this.sprint = newValue;
        this.switchNoteList();
    }
    toggleDark() {
        if (this.dark)  {
            document.getElementById('bodyContent').className = 'lightMode';
        } else {
            document.getElementById('bodyContent').className = 'darkMode';
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
        this.myNoteList.push({ desc: note.desc, bgcolor: note.bgcolor, x: note.x , y: note.y, sprint: note.sprint });
    }
    sendMessage(theirMessage: string) {
        if (this.ac.isLoggedIn === true) {
            this.name = this.ac.user_displayName;
        }
        this.items.push({ message: theirMessage, name: this.name });
        this.msgVal = '';
    }
    onDrag(note: Note) {
        this.rect = document.getElementById(note.key).getBoundingClientRect();
        this.x = this.rect.left;
        this.y = this.rect.top;
        note.x = (this.x - 10) + 'px';
        note.y = (this.y - 230) + 'px';
        this.myNoteList.update(note.key.toString(), note);
    }
    onPress(desc: string) {
        const randomNumber: number = Math.floor(Math.random() * this.colorlist.length);
        const rcolor: string = this.colorlist[randomNumber];
        let defaultExist = false;
        this.sprintArray.forEach(async element => {
            for (const e of element){
                if (e.name === 'default') {
                    defaultExist = true;
                }
            }
        });
        if (!defaultExist) {
            const keyValue = this.sprintArray.push({key: '', name: 'default'}).key;
            this.sprintArray.update(keyValue, {key: keyValue});
        }
        if (desc) {
            this.x = 0;
            this.y = 0;
            const note = new Note(desc, rcolor, this.x, this.y, this.sprint);
            note.key = this.myNoteList.push(note).key;
            this.noteArray.push(note);
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
    updateNote(note: Note) {
        note.desc = document.getElementById(note.key).innerText;
        this.myNoteList.update(note.key.toString(), note);
    }
    removeNote(note: Note) {
        this.myNoteList.remove(note.key);
        this.noteArray.splice(this.noteArray.indexOf(note), 1);
    }

    ngOnInit(){
    }

    ngOnDestroy() {
    }
    private switchNoteList() {
            this.myNoteList = this.af.list('users/' + this.userID.toString() + '/notes' + `/${this.sprint}`);
            this.noteArray = new Array;
            const dbToList = this.myNoteList.subscribe(data => {
                for (const n of data){
                    this.noteArray.push(n);
                }
                dbToList.unsubscribe();
            });
    }
}
function delay(ms: number) {
    return new Promise<void>(function(resolve) {
        setTimeout(resolve, ms);
    });
}
