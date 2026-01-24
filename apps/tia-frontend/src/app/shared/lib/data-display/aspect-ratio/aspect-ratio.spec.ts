import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AspectRatio } from './aspect-ratio';
import { AspectRatioItem } from '../models/aspect-ratio.models';

describe('AspectRatio', () => {
  let component: AspectRatio;
  let fixture: ComponentFixture<AspectRatio>;

  const items: AspectRatioItem[] = [
    {
      id: 'video',
      label: '16:9',
      description: 'Video',
      ratio: '16 / 9',
      width: '44.8rem',
      background: '#BAE6FD',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AspectRatio],
    }).compileComponents();

    fixture = TestBed.createComponent(AspectRatio);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('items', items);
    fixture.detectChanges();
  });

  it('should emit selected item on click', () => {
    let emitted: AspectRatioItem | undefined;
    component.selected.subscribe((value) => (emitted = value));

    const card = fixture.debugElement.query(By.css('.aspect-ratio__card'));
    card.triggerEventHandler('click', null);

    expect(emitted).toEqual(items[0]);
  });
});
