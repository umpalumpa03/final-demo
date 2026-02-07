import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserInfoComponent } from './user-info.component';
import { vi } from 'vitest';
import { TranslateModule } from '@ngx-translate/core';

describe('UserInfoComponent', () => {
  let component: UserInfoComponent;
  let fixture: ComponentFixture<UserInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserInfoComponent, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(UserInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
