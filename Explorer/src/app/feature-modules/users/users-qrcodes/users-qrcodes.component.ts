import { Component } from '@angular/core';
import { UsersServiceService } from '../users.service.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { QRCodes } from '../model/qrcode.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'xp-users-qrcodes',
  templateUrl: './users-qrcodes.component.html',
  styleUrls: ['./users-qrcodes.component.css']
})
export class UsersQrcodesComponent {

  loggedInUser: User | undefined;
  qrCodes: QRCodes[] = [];
  constructor(private service: UsersServiceService, private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      this.loggedInUser = user;
    });
    this.getQRCodes();
  }


  filterFrom = new FormGroup({
    filterStatus: new FormControl('', [Validators.required]),
  });

  getQRCodes(): void {
    this.service.getAllQRCodeByUser(this.loggedInUser?.id || 0).subscribe({
      next: (result: QRCodes | QRCodes[]) => {
        if (Array.isArray(result)) {
          this.qrCodes = result;
        } else {
          this.qrCodes = [result];
        }
      },
      error: () => {
        console.log('Nije ucitao');
      },
    });
  }
  filter(): void {
    const formValue = this.filterFrom.value;
    const filterStatus = formValue.filterStatus;
    
    if(filterStatus != undefined && filterStatus != 'ALL'){
      this.service.getFilteredQRCodeByUserAndStatus(this.loggedInUser?.id || 0, filterStatus).subscribe({
        next: (result: QRCodes | QRCodes[]) => {
          if (Array.isArray(result)) {
            this.qrCodes = result;
          } else {
            this.qrCodes = [result];
          }
        },
        error: () => {
          console.log('Nije ucitao');
        },
      });
    }else if(filterStatus == 'ALL'){
      this.service.getAllQRCodeByUser(this.loggedInUser?.id || 0).subscribe({
        next: (result: QRCodes | QRCodes[]) => {
          if (Array.isArray(result)) {
            this.qrCodes = result;
          } else {
            this.qrCodes = [result];
          }
        },
        error: () => {
          console.log('Nije ucitao');
        },
      });
    }
    
  }
  


}
