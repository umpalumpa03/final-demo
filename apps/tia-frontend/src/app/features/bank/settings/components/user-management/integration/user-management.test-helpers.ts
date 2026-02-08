import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

import { UserManagementService } from '../shared/services/user-management.service';
import { UserManagementStore } from '../store/user-management.store';
import { ProfilePhotoApiService } from '@tia/shared/services/profile-photo/profile-photo.service';

import { IUser, IUserDetail } from '../shared/models/users.model';

export const mockUsersList: IUser[] = [
  {
    id: 'user-1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@test.com',
    role: 'CONSUMER',
    isBlocked: false,
    username: 'johndoe',
    createdAt: '2024-01-01T10:00:00Z',
    avatar: 'avatar-1',
    theme: 'light',
    language: 'en',
    fullName: 'John Doe',
    hasCompletedOnboarding: true,
  } as IUser,
  {
    id: 'user-2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@test.com',
    role: 'SUPPORT',
    isBlocked: true,
    username: 'janesmith',
    createdAt: '2024-02-01T10:00:00Z',
    avatar: null,
    theme: 'dark',
    language: 'en',
    fullName: 'Jane Smith',
    hasCompletedOnboarding: true,
  } as IUser,
];

export const mockUserDetail: IUserDetail = {
  ...mockUsersList[0],
  pId: '01020304050',
  phone: '555-123-4567',
  phoneVerifiedAt: '2024-01-01T10:00:00Z',
  avatar: 'avatar-uuid-123',
  avatarUrl: null,
};

export interface TestContext {
  httpMock: HttpTestingController;
  store: InstanceType<typeof UserManagementStore>;
  profileService: any;
}

export async function setupUserManagementTest(): Promise<TestContext> {
  const profileServiceMock = {
    getCurrentUserAvatar: () =>
      of(new Blob(['fake-image'], { type: 'image/png' })),
  };

  globalThis.URL.createObjectURL = (blob: Blob) => 'blob:fake-url';

  await TestBed.configureTestingModule({
    providers: [
      provideHttpClient(),
      provideHttpClientTesting(),
      provideTranslateService(),

      UserManagementStore,
      UserManagementService,

      { provide: ProfilePhotoApiService, useValue: profileServiceMock },
    ],
  }).compileComponents();

  const httpMock = TestBed.inject(HttpTestingController);
  const store = TestBed.inject(UserManagementStore);

  return { httpMock, store, profileService: profileServiceMock };
}

export function cleanupUserManagementTest(
  httpMock: HttpTestingController,
): void {
  try {
    httpMock.verify();
  } finally {
    TestBed.resetTestingModule();
  }
}
