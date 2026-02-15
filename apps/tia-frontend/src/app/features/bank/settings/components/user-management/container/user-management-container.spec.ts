import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserManagementContainer } from './user-management-container';
import { TranslateModule } from '@ngx-translate/core';
import { UserManagementState } from '../shared/state/user-management.state';

describe('UserManagementContainer', () => {
  let component: UserManagementContainer;
  let fixture: ComponentFixture<UserManagementContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserManagementContainer, TranslateModule.forRoot()],
      providers: [UserManagementState],
    }).compileComponents();

    fixture = TestBed.createComponent(UserManagementContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
