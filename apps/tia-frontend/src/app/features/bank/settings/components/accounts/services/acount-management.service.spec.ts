import { TestBed } from '@angular/core/testing';
import { AccountManagementService } from './acount-management.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { environment } from '../../../../../../../environments/environment';

describe('AccountManagementService', () => {
  let service: AccountManagementService;
  let http: { get: any; put: any };

  beforeEach(() => {
    http = { get: vi.fn(), put: vi.fn() };
    TestBed.configureTestingModule({
      providers: [{ provide: HttpClient, useValue: http }, AccountManagementService],
    });
    service = TestBed.inject(AccountManagementService);
  });

  it('calls getAllAccounts with correct url', () => {
    http.get.mockReturnValue(of([]));
    service.getAllAccounts().subscribe();
    expect(http.get).toHaveBeenCalledWith(`${environment.apiUrl}/settings/accounts`);
  });

  it('calls markAccountFavoriteStatus with correct url', () => {
    const body = { accountId: '1', isFavorite: true } as any;
    http.put.mockReturnValue(of({}));
    service.markAccountFavoriteStatus(body).subscribe();
    expect(http.put).toHaveBeenCalledWith(`${environment.apiUrl}/settings/favorite`, body);
  });

  it('calls updateAccountVisibility with correct url', () => {
    const body = { accountId: '1', isHidden: false } as any;
    http.put.mockReturnValue(of({}));
    service.updateAccountVisibility(body).subscribe();
    expect(http.put).toHaveBeenCalledWith(`${environment.apiUrl}/settings/account-visibility`, body);
  });

  it('calls updateAccountFriendlyName with correct url', () => {
    const body = { accountId: '1', friendlyName: 'New' } as any;
    http.put.mockReturnValue(of({}));
    service.updateAccountFriendlyName(body).subscribe();
    expect(http.put).toHaveBeenCalledWith(`${environment.apiUrl}/settings/change-friendly-name`, body);
  });
});
