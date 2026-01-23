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

  it('should show status when provided', () => {
    fixture.componentRef.setInput('status', 'online');
    fixture.detectChanges();

    const status: HTMLElement = fixture.nativeElement.querySelector(
      '.avatar__status--online',
    );
    expect(status).toBeTruthy();
  });

  it('should use default status class when missing', () => {
    fixture.detectChanges();

    expect(component.statusClass()).toBe('avatar__status');
  });
});
