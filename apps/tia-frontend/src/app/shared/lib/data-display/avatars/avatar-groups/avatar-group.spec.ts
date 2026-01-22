import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AvatarGroup } from './avatar-group';

describe('AvatarGroup', () => {
  let component: AvatarGroup;
  let fixture: ComponentFixture<AvatarGroup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvatarGroup],
    }).compileComponents();

    fixture = TestBed.createComponent(AvatarGroup);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should render overflow avatar when avatars exceed max', () => {
    fixture.componentRef.setInput('avatars', [
      { initials: 'JC' },
      { initials: 'AE' },
      { initials: 'MS' },
      { initials: 'SH' },
      { initials: 'LW' },
      { initials: 'BM' },
    ]);
    fixture.componentRef.setInput('max', 4);
    fixture.detectChanges();

    const overflow = fixture.nativeElement.querySelectorAll('app-avatar')[4];
    const overflowText: HTMLElement | null = overflow?.querySelector('.avatar__text');
    expect(overflowText?.textContent ?? '').toContain('+2');
  });
});
