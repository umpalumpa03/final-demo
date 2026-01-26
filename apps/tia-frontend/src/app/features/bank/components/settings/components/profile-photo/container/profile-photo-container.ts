import { Component } from '@angular/core';
import { ProfilePhotoComponent } from '../components/profile-photo.component';

@Component({
  selector: 'app-profile-photo-container',
  imports: [ProfilePhotoComponent],
  templateUrl: './profile-photo-container.html',
  styleUrl: './profile-photo-container.scss',
})
export class ProfilePhotoContainer {
}

