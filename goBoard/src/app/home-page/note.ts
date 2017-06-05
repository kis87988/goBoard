export class Note {
    desc: string;
    bgcolor: string;
    x: string;
    y: string;
    key: string;
    constructor (desc: string, bgcolor: string, x: number, y: number) {
        this.desc = desc;
        this.bgcolor = bgcolor;
        this.x = x + "px";
        this.y = y + "px";
    }
}
