import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { PaybillTemplatesContainer } from './paybill-templates-container';
import { PaybillTemplatesService } from '../services/paybill-templates-service';
import { provideMockStore } from '@ngrx/store/testing';
import {
  selectTemplatesGroupWithConfigs,
  selectTemplatesAsTreeItems,
} from '../../../store/paybill.selectors';
import { HeaderCtaAction, ModalType } from '../models/paybill-templates.model';

const mockTemplatesGroup = [
  {
    id: 1,
    name: 'Test Group',
    icon: 'images/svg/paybill/group.svg',
    expanded: true,
  },
];

const mockTemplates: any[] = [];

const mockModalConfig = {
  [ModalType.Template]: { title: 'Template Modal' },
  [ModalType.Group]: { title: 'Group Modal' },
};

describe('PaybillTemplatesContainer', () => {
  let component: PaybillTemplatesContainer;
  let fixture: ComponentFixture<PaybillTemplatesContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaybillTemplatesContainer],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: selectTemplatesGroupWithConfigs,
              value: mockTemplatesGroup,
            },
            { selector: selectTemplatesAsTreeItems, value: mockTemplates },
          ],
        }),
        { provide: PaybillTemplatesService, useValue: {} },
      ],
    })
      .overrideComponent(PaybillTemplatesContainer, {
        set: {
          template: '',
          imports: [],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(PaybillTemplatesContainer);
    component = fixture.componentInstance;
    (component as any).modalConfig = mockModalConfig;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should select template groups from store', () => {
    expect(component.templateGroups()).toEqual(mockTemplatesGroup);
  });

  it('should set modalType to Template and open modal for createTemplate action', () => {
    component.handleHeaderAction('createTemplate' as HeaderCtaAction);

    expect(component.modalType()).toBe(ModalType.Template);
    expect(component.isModalOpen()).toBe(true);
  });

  it('should set modalType to Group and open modal for createGroup action', () => {
    component.handleHeaderAction('createGroup' as HeaderCtaAction);

    expect(component.modalType()).toBe(ModalType.Group);
    expect(component.isModalOpen()).toBe(true);
  });

  it('should toggle modal from closed to open', () => {
    expect(component.isModalOpen()).toBe(false);

    component.handleModalToggle();

    expect(component.isModalOpen()).toBe(true);
  });

  it('should toggle modal from open to closed', () => {
    component.isModalOpen.set(true);

    component.handleModalToggle();

    expect(component.isModalOpen()).toBe(false);
  });

  it('should return Template config when modalType is Template', () => {
    component.modalType.set(ModalType.Template);

    expect(component['currentModalConfig']()).toEqual(
      mockModalConfig[ModalType.Template],
    );
  });

  it('should return Group config when modalType is Group', () => {
    component.modalType.set(ModalType.Group);

    expect(component['currentModalConfig']()).toEqual(
      mockModalConfig[ModalType.Group],
    );
  });

  it('should return null when modalType is null', () => {
    component.modalType.set(null);

    expect(component['currentModalConfig']()).toBeNull();
  });
});
