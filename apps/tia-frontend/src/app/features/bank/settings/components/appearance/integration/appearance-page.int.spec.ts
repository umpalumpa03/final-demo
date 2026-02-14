import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { environment } from '../../../../../../../environments/environment';
import {
  cleanupAppearanceTest,
  mockThemesResponse,
  setupAppearanceTest,
} from './appearance.test-helpers';

describe('Appearance Page Integration', () => {
  const apiUrl = environment.apiUrl;

  let ctx: Awaited<ReturnType<typeof setupAppearanceTest>>;

  beforeEach(async () => {
    ctx = await setupAppearanceTest();
  });

  afterEach(() => {
    cleanupAppearanceTest(ctx.httpMock);
  });

  it('should load available themes on init', async () => {
    ctx.fixture.detectChanges();

    const req = ctx.httpMock.expectOne(
      `${apiUrl}/settings/get-available-themes`,
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockThemesResponse);

    await vi.waitFor(() => {
      const cards =
        ctx.fixture.nativeElement.querySelectorAll('.container__card');
      expect(cards.length).toBe(2);
    });
  });

  it('should select theme and save changes', async () => {
    ctx.fixture.detectChanges();

    const req = ctx.httpMock.expectOne(
      `${apiUrl}/settings/get-available-themes`,
    );
    req.flush(mockThemesResponse);

    await vi.waitFor(() => {
      const cards =
        ctx.fixture.nativeElement.querySelectorAll('.container__card');
      expect(cards.length).toBe(2);
    });

    const cards =
      ctx.fixture.nativeElement.querySelectorAll('.container__card');
    cards[1].dispatchEvent(new MouseEvent('click', { bubbles: true }));

    ctx.activeThemeSignal.set('royalBlue');
    ctx.fixture.detectChanges();

    const saveButton = ctx.fixture.nativeElement.querySelector(
      '.container__submit app-button',
    );
    expect(saveButton).toBeTruthy();
    saveButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    const updateReq = ctx.httpMock.expectOne(
      `${apiUrl}/settings/update-user-theme`,
    );
    expect(updateReq.request.method).toBe('PUT');
    expect(updateReq.request.body).toEqual({ theme: 'royalBlue' });
    updateReq.flush({});

    await vi.waitFor(() => {
      expect(ctx.mockAlert.success).toHaveBeenCalled();
    });
  });
});
