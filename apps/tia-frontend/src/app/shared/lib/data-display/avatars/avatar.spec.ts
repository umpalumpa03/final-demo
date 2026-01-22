import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Avatar } from './avatar';

describe('Avatar', () => {
  let component: Avatar;
  let fixture: ComponentFixture<Avatar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Avatar],
    }).compileComponents();

    fixture = TestBed.createComponent(Avatar);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should apply size class', () => {
    fixture.componentRef.setInput('size', 'xl');
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement.querySelector('.avatar');
    expect(el.className).toContain('avatar--xl');
  });

  it('should apply tone and color classes', () => {
    fixture.componentRef.setInput('tone', 'solid');
    fixture.componentRef.setInput('color', 'green');
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement.querySelector('.avatar');
    expect(el.className).toContain('avatar--solid');
    expect(el.className).toContain('avatar--green');
  });

  it('should render initials', () => {
    fixture.componentRef.setInput('initials', 'JD');
    fixture.detectChanges();

    const text: HTMLElement = fixture.nativeElement.querySelector('.avatar__text');
    expect(text.textContent ?? '').toContain('JD');
  });

  it('should show status when provided', () => {
    fixture.componentRef.setInput('status', 'online');
    fixture.detectChanges();

    const status: HTMLElement = fixture.nativeElement.querySelector('.avatar__status--online');
    expect(status).toBeTruthy();
  });

  it('should hide status when not provided', () => {
    fixture.componentRef.setInput('status', null);
    fixture.detectChanges();

    const status: HTMLElement | null = fixture.nativeElement.querySelector('.avatar__status');
    expect(status).toBeNull();
  });
});
