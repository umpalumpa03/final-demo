import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserEditModal } from './user-edit-modal';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { describe, it, expect, beforeEach } from 'vitest';

describe('UserEditModal', () => {
  let component: UserEditModal;
  let fixture: ComponentFixture<UserEditModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        UserEditModal,
        HttpClientTestingModule,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: 'AsyncAnimationRendererConfig', useValue: [] },
        { provide: 'RendererFactory2', useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserEditModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
