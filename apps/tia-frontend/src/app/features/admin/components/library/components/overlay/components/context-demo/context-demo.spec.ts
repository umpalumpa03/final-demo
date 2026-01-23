import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContextDemo } from './context-demo';

describe('ContextDemo', () => {
  let component: ContextDemo;
  let fixture: ComponentFixture<ContextDemo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContextDemo],
    }).compileComponents();

    fixture = TestBed.createComponent(ContextDemo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
