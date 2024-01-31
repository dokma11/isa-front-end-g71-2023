import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { 
  faHSquare,
  faHome,
  faBuilding,
  faUser,
  faSignOut,
  faSignIn,
  faStethoscope,
  faAmbulance,
  faMedkit,
  faHeartbeat,
  faFileText,
 } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'xp-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  user: User | undefined;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
  }

  onLogout(): void {
    this.authService.logout();
  }

  faHSquare = faHSquare;
  faHome = faHome;
  faBuilding = faBuilding;
  faUser = faUser;
  faSignOut = faSignOut;
  faSignIn = faSignIn;
  faStethoscope = faStethoscope;
  faAmbulance = faAmbulance;
  faMedKit = faMedkit;
  faHeartbeat = faHeartbeat;
  faFileText = faFileText;
}
