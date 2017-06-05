export class Note {
    desc: string;
    bgcolor: string;
    x: number;
    y: number;
    key: string;
    constructor (desc: string, bgcolor: string, x: number, y: number) {
        this.desc = desc;
        this.bgcolor = bgcolor;
        this.x = x;
        this.y = y;
    }
}
