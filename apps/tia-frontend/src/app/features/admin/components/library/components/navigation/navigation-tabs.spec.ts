import { Navigation } from './navigation-tabs';
import { BREADCRUMBS, BREADCRUMBS2, TABS, TABS2 } from './config/tabs-data';

describe('Navigation', () => {
  let component: Navigation;

  beforeEach(() => {
    component = new Navigation();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize tabs signal with TABS', () => {
    expect(component.tabs()).toEqual(TABS);
  });

  it('should initialize tabs2 signal with TABS2', () => {
    expect(component.tabs2()).toEqual(TABS2);
  });

  it('should initialize breadcrumbs signal with BREADCRUMBS', () => {
    expect(component.breadcrumbs()).toEqual(BREADCRUMBS);
  });

  it('should initialize breadcrumbs2 signal with BREADCRUMBS2', () => {
    expect(component.breadcrumbs2()).toEqual(BREADCRUMBS2);
  });

});
