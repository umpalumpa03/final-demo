import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserManagementContainer } from './user-management-container';
import { TranslateModule } from '@ngx-translate/core';

describe('UserManagementContainer', () => {
  let component: UserManagementContainer;
  let fixture: ComponentFixture<UserManagementContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserManagementContainer, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(UserManagementContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
