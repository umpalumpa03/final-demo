import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { environment } from '../../../../../../../environments/environment';
import {
  cleanupLanguageTest,
  mockLanguagesInput,
  mockLanguagesResponse,
  setupLanguageSelectionTest,
  setupLanguageStoreTest,
} from './language.test-helpers';

describe('Language Page Integration', () => {
  const apiUrl = environment.apiUrl;

  describe('page load', () => {
    let ctx: Awaited<ReturnType<typeof setupLanguageStoreTest>>;

    beforeEach(async () => {
      ctx = await setupLanguageStoreTest();
    });

    afterEach(() => {
      cleanupLanguageTest(ctx.httpMock);
    });

    it('should load available languages on init', async () => {
      ctx.store.fetchLanguages({});

      const req = ctx.httpMock.expectOne(
        `${apiUrl}/settings/get-available-languages`,
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockLanguagesResponse);

      await vi.waitFor(() => {
        expect(ctx.store.hasLoaded()).toBe(true);
        expect(ctx.store.languages().length).toBe(2);
      });
    });
  });

  describe('save language', () => {
    let ctx: Awaited<ReturnType<typeof setupLanguageSelectionTest>>;

    beforeEach(async () => {
      ctx = await setupLanguageSelectionTest();
    });

    afterEach(() => {
      cleanupLanguageTest(ctx.httpMock);
    });

    it('should update language and change application language', async () => {
      ctx.component.selectedLanguage.set(mockLanguagesInput[1]);
      ctx.component.onSave();

      const req = ctx.httpMock.expectOne(
        `${apiUrl}/settings/update-user-language`,
      );
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual({ language: 'georgian' });

      req.flush({ successs: true });

      await vi.waitFor(() => {
        expect(ctx.mockTranslate.use).toHaveBeenCalledWith('ka');
        expect(ctx.mockTranslationLoader.loadTranslations).toHaveBeenCalledWith(
          ['settings', 'storybook'],
        );
        expect(ctx.mockAlert.success).toHaveBeenCalled();
      });
    });
  });
});
