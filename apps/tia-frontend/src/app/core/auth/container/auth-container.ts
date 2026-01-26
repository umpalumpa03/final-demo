import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TokenService } from '../services/token.service';
import { AuthService } from '../services/auth-service';

@Component({
  selector: 'app-auth-container',
  imports: [RouterOutlet],
  templateUrl: './auth-container.html',
  styleUrl: './auth-container.scss',
  providers: [TokenService, AuthService],
})
export class AuthContainer {}
