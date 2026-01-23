import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResizableHorizontal } from './resizable-horizontal';

describe('ResizableHorizontal', () => {
  let component: ResizableHorizontal;
  let fixture: ComponentFixture<ResizableHorizontal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResizableHorizontal],
    }).compileComponents();

    fixture = TestBed.createComponent(ResizableHorizontal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
