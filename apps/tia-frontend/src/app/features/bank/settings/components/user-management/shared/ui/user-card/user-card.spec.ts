import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserCard } from './user-card';
import { IUser } from '../../models/users.model';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('UserCard', () => {
  let component: UserCard;
  let fixture: ComponentFixture<UserCard>;

  const mockUser = {
    id: '123',
    firstName: 'John',
    lastName: 'Doe',
    email: 'email@g.com',
    role: 'CONSUMER',
    isBlocked: false,
    createdAt: 'odesghac',
  } as IUser;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserCard],
    }).compileComponents();

    fixture = TestBed.createComponent(UserCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('user', mockUser);
    fixture.detectChanges();
  });

  it('should have output emitters defined', () => {
    expect(component.onDetails).toBeDefined();
    expect(component.onEdit).toBeDefined();
    expect(component.onDelete).toBeDefined();
  });
});
