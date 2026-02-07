import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PermissionsModal } from './permissions-modal';

describe('PermissionsModal', () => {
  let component: PermissionsModal;
  let fixture: ComponentFixture<PermissionsModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PermissionsModal],
    }).compileComponents();

    fixture = TestBed.createComponent(PermissionsModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
