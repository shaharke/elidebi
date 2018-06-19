import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RandomWordsComponent } from './random-words.component';

describe('RandomWordsComponent', () => {
  let component: RandomWordsComponent;
  let fixture: ComponentFixture<RandomWordsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RandomWordsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RandomWordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
