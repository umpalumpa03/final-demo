import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { PendingCard } from '../shared/model/approve-cards.model';
import { ApproveCardsStore } from '../store/approve-cards.store';
import { CardsApproveElement } from '../approve-card-element/cards-approve-element';
import { buttonEmit } from '../shared/model/approve-card-element.model';
import { Skeleton } from '@tia/shared/lib/feedback/skeleton/skeleton';
import { Spinner } from '@tia/shared/lib/feedback/spinner/spinner';
import { ErrorStates } from '@tia/shared/lib/feedback/error-states/error-states';
import { UiModal } from '@tia/shared/lib/overlay/ui-modal/ui-modal';
import { PermissionsModal } from '../../approve-accounts/components/permissions-modal/permissions-modal';
import { FormBuilder, FormControl, FormRecord } from '@angular/forms';
import { IAccountsPermissions } from '../../approve-accounts/models/account-permissions.models';

@Component({
  selector: 'app-approve-cards',
  imports: [
    CardsApproveElement,
    Skeleton,
    Spinner,
    ErrorStates,
    PermissionsModal,
    UiModal,
  ],
  templateUrl: './approve-cards.html',
  providers: [ApproveCardsStore],
  styleUrl: './approve-cards.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApproveCards implements OnInit {
  public readonly store = inject(ApproveCardsStore);
  public readonly fb = inject(FormBuilder);

  public cardInfo = signal<PendingCard[]>([]);
  public permissionsOverlay = signal<boolean>(false);
  public activeCardId = signal<string | null>(null);
  public permissionsSavedCard = signal<string | null>(null);

  public readonly activeCard = computed(() =>
    this.store.cards().find((card) => card.id === this.activeCardId()),
  );

  public readonly cardName = computed(
    () => this.activeCard()?.nickname ?? 'Unknown Card',
  );

  public readonly fullName = computed(() => {
    const user = this.activeCard()?.user;
    return user ? `${user.firstName} ${user.lastName}` : 'Unknown User';
  });

  public readonly cardPermissionsForm: FormRecord<FormControl<boolean>> =
    this.fb.record<FormControl<boolean>>({});

  public readonly mappedPermissions = computed<IAccountsPermissions[]>(() => {
    return this.store.permissions().map((p) => ({
      value: p.value,
      label: p.displayName,
    }));
  });

  constructor() {
    effect(() => {
      const perms = this.store.permissions();

      Object.keys(this.cardPermissionsForm.controls).forEach((key) => {
        this.cardPermissionsForm.removeControl(key);
      });

      perms.forEach((p) => {
        this.cardPermissionsForm.addControl(
          p.value.toString(),
          new FormControl(false, { nonNullable: true }),
        );
      });
    });
  }

  ngOnInit(): void {
    this.store.load();
    this.store.loadPerrmisions();
  }

  public handleAction(event: buttonEmit): void {
    const { action, id } = event;
    switch (action) {
      case 'permissions':
        this.handlePermissions(id);
        break;

      case 'approve':
        this.handleApprove(id);
        break;

      case 'decline':
        this.handleDecline(id);
        break;
    }
  }

  private handlePermissions(id: string): void {
    this.activeCardId.set(id);
    this.permissionsOverlay.set(true);
    console.log(this.cardPermissionsForm.getRawValue(), '__Form');
  }

  public onSavePermissions() {
    const values = this.cardPermissionsForm.getRawValue();
    this.permissionsSavedCard.set(this.activeCardId());
  }

  // Empty Cards - retry
  // Dynamic Permissions To add
  private handleApprove(id: string): void {
    this.store.updateStatus({
      cardId: id,
      status: 'ACTIVE',
      permissions: [],
    });
  }

  private handleDecline(id: string): void {
    this.store.updateStatus({
      cardId: id,
      status: 'CANCELLED',
      permissions: [],
    });
  }

  public closeModal(): void {
    this.permissionsOverlay.set(false);
  }
}
