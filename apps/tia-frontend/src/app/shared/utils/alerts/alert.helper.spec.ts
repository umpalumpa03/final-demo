import showAlert from './alert.helper';

describe('showAlert helper', () => {
  const translate = { instant: (k: string) => `T:${k}` } as any;
  const alertService = {
    success: vi.fn(),
    warning: vi.fn(),
    error: vi.fn(),
  } as any;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls success with translated message and default title', () => {
    showAlert(alertService, translate, 'success', 'ok.key');

    expect(alertService.success).toHaveBeenCalledWith('T:ok.key', {
      variant: 'dismissible',
      title: 'Success!',
    });
  });

  it('calls error with translated message and provided title', () => {
    showAlert(alertService, translate, 'error', 'err.key', 'My title');

    expect(alertService.error).toHaveBeenCalledWith('T:err.key', {
      variant: 'dismissible',
      title: 'My title',
    });
  });

  it('calls warning and uses default Warning! title', () => {
    showAlert(alertService, translate, 'warning', 'warn.key');

    expect(alertService.warning).toHaveBeenCalledWith('T:warn.key', {
      variant: 'dismissible',
      title: 'Warning!',
    });
  });
});
