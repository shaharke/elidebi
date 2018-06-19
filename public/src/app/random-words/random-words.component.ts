import { Component, OnInit, ViewChild, ElementRef, ViewChildren, QueryList, AfterViewInit, Renderer, Input } from '@angular/core';

@Component({
  selector: 'app-random-words',
  templateUrl: './random-words.component.html',
  styleUrls: ['./random-words.component.css']
})
export class RandomWordsComponent implements OnInit, AfterViewInit {
  @ViewChildren('word') elements: QueryList<ElementRef>;
  elementsArr:ElementRef[];
  @Input() words = ['TOMER', 'BEN', 'YAEN', 'ITAY', 'EYAL', 'KEIDI', 'BARAK', 'ADAM'];
  @Input() draw:string;
  constructor(public renderer: Renderer) { }

  ngOnInit() {
  }
  ngAfterViewInit (){
    this.elementsArr = this.elements.toArray();
    for (let i = 0; i < this.elementsArr.length; i++)
      this.changeWord(this.elementsArr[i]);
  }

  changeWord(a) {
    this.renderer.setElementStyle(a.nativeElement, 'opacity', '0.1');
    a.nativeElement.innerHTML = this.words[this.getRandomInt(0, this.words.length - 1)];
    setTimeout(() => {
      this.renderer.setElementStyle(a.nativeElement, 'opacity', '1');
    }, 425);
    setTimeout(() => {
      this.changeWord(a);
    }, this.getRandomInt(500, 800));
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

}
