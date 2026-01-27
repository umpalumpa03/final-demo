import { ChangeDetectionStrategy, Component, OnInit, OnDestroy, signal, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProfilePhotoComponent } from '../components/profile-photo.component';
import { ProfilePhotoService } from '../shared/services/profile-photo.service';
import { DefaultAvatar } from '../shared/models/profile-photo.model';
import { environment } from '../../../../../../../environments/environment';

@Component({
  selector: 'app-profile-photo-container',
  imports: [ProfilePhotoComponent],
  templateUrl: './profile-photo-container.html',
  styleUrl: './profile-photo-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePhotoContainer implements OnInit, OnDestroy {
  private readonly profilePhotoService = inject(ProfilePhotoService);
  private readonly destroyRef = inject(DestroyRef);
  public readonly defaultAvatars = signal<DefaultAvatar[]>([]);
  public readonly selectedAvatarId = signal<string | null>(null);
  public readonly uploadedFile = signal<File | null>(null);
  public readonly currentAvatarUrl = signal<string | null>(null);
  private objectUrl: string | null = null;

  ngOnInit(): void {
    this.profilePhotoService
      .getAvailableDefaultAvatars()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (avatars) => {
          this.defaultAvatars.set(avatars);
        },
        error: (error) => {
          console.error('Failed to load default avatars', error);
        },
      });

    const storedAvatarId = localStorage.getItem('avatarId');
    const storedAvatarType = localStorage.getItem('avatarType'); 
    
    if (storedAvatarId) {
      if (storedAvatarType === 'custom') {
      
        this.currentAvatarUrl.set(
          `${environment.apiUrl}/settings/current-user-avatar/${storedAvatarId}`,
        );
      } else {
     
        this.selectedAvatarId.set(storedAvatarId);
        this.currentAvatarUrl.set(
          `${environment.apiUrl}/settings/current-user-avatar/${storedAvatarId}`,
        );
      }
    }
  }

  ngOnDestroy(): void {
   
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = null;
    }
  }

  public onFileSelected(file: File): void {
    this.uploadedFile.set(file);
    this.selectedAvatarId.set(null);

   
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
    }

    this.objectUrl = URL.createObjectURL(file);
    this.currentAvatarUrl.set(this.objectUrl);
  }

  public onSelectDefaultAvatar(avatarId: string): void {
    this.selectedAvatarId.set(avatarId);
    
    this.uploadedFile.set(null);

    const avatar =
      this.defaultAvatars().find((defaultAvatar) => defaultAvatar.id === avatarId) ??
      null;
    this.currentAvatarUrl.set(avatar ? avatar.imageUrl : null);
  }

  public onRemovePhoto(): void {
    this.profilePhotoService
      .removeUserAvatar()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
       
          if (this.objectUrl) {
            URL.revokeObjectURL(this.objectUrl);
            this.objectUrl = null;
          }

          this.uploadedFile.set(null);
          this.selectedAvatarId.set(null);
          this.currentAvatarUrl.set(null);

          localStorage.removeItem('avatarId');
          localStorage.removeItem('avatarType');
        },
        error: (error) => {
          console.error('Failed to remove avatar', error);
        },
      });
  }

  public onSaveChanges(): void {
    const file = this.uploadedFile();
    const avatarId = this.selectedAvatarId();

    if (file) {
      this.profilePhotoService
        .uploadUserAvatar(file)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (result) => {
            console.log('Uploaded custom avatar', result);

            if (result.success && result.avatarId) {
          
              if (this.objectUrl) {
                URL.revokeObjectURL(this.objectUrl);
                this.objectUrl = null;
              }

              localStorage.setItem('avatarId', result.avatarId);
              localStorage.setItem('avatarType', 'custom');

              this.currentAvatarUrl.set(
                `${environment.apiUrl}/settings/current-user-avatar/${result.avatarId}`,
              );
              this.uploadedFile.set(null);
            }
          },
          error: (error) => {
            console.error('Failed to upload avatar', error);
          },
        });
      return;
    }

    if (avatarId) {
      this.profilePhotoService
        .selectFromDefaultAvatar(avatarId)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            console.log('Selected default avatar', avatarId);

            localStorage.setItem('avatarId', avatarId);
            localStorage.setItem('avatarType', 'default');
          },
          error: (error) => {
            console.error('Failed to select default avatar', error);
          },
        });
    }
  }
}

