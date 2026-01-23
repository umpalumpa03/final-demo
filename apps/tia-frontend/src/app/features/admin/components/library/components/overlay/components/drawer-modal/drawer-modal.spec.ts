import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DrawerModal } from './drawer-modal';

describe('DrawerModal', () => {
  let component: DrawerModal;
  let fixture: ComponentFixture<DrawerModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrawerModal],
    }).compileComponents();

    fixture = TestBed.createComponent(DrawerModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
