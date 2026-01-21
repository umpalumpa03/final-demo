import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Badges } from './badges';

describe('Badges', () => {
  let component: Badges;
  let fixture: ComponentFixture<Badges>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Badges],
    }).compileComponents();

    fixture = TestBed.createComponent(Badges);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should apply provided variant to class', () => {
    fixture.componentRef.setInput('variant', 'secondary');
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement.querySelector('span');
    expect(el).toBeTruthy();
    expect(el.className).toContain('badge--secondary');
  });

  it('should render provided text', () => {
    fixture.componentRef.setInput('text', 'Test badge');
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement.querySelector('span');
    expect(el.textContent ?? '').toContain('Test badge');
  });
});
