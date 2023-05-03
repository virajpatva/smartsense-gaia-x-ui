import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { QRCodeModule } from 'angularx-qrcode';
import { APIStatus, UserType } from 'src/app/shared/enums';
import { SharedService } from 'src/app/shared/services';
import {
  EnterpriseLoginPollResponseModel,
  EnterpriseQRLoginResponseModel,
} from '../../models';
import { LoginService } from '../../services';
import {
  MAX_POLL_COUNT,
  POLL_INTERVAL,
  PollStatus,
} from './enterprise-login.constants';
import { RouteConstants } from 'src/app/shared/constants';

@Component({
  selector: 'app-enterprise-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
    QRCodeModule,
  ],
  templateUrl: './enterprise-login.component.html',
  styleUrls: ['./enterprise-login.component.scss'],
})
export class EnterpriseLoginComponent implements OnInit {
  // Constant variables
  readonly UserType = UserType;
  readonly APIStatus = APIStatus;
  readonly MAX_POLL_COUNT = MAX_POLL_COUNT;
  readonly POLL_INTERVAL = POLL_INTERVAL;

  enterpriseQRLoginResponse: EnterpriseQRLoginResponseModel |  null;
  enterpriseLoginPollResponse: EnterpriseLoginPollResponseModel;
  loginQrApiStatus: APIStatus = APIStatus.Pending;

  pollCount: number = 0;
  pollStatus: PollStatus;

  checkStatusTimeOut: ReturnType<typeof setTimeout>;

  constructor(
    private router: Router,
    private loginService: LoginService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.getLoginQR();
  }

  onReloadQRClick = () => {
    this.getLoginQR();
  }

  pollLoginStatus = () => {
    if (this.checkStatusTimeOut) {
      clearTimeout(this.checkStatusTimeOut);
    }
    this.checkStatusTimeOut = setTimeout(() => {
      const request = {
        presentationId: this.enterpriseQRLoginResponse!.data.presentationId,
      };
      this.loginService.pollLoginStatus(request).subscribe({
        next: (response) => {
          this.pollStatus = response.payload.status;
          this.pollCount++;
          if (
            this.pollCount === MAX_POLL_COUNT ||
            this.pollStatus === PollStatus.Done
          ) {
            clearTimeout(this.checkStatusTimeOut);
            this.router.navigate([
              `${RouteConstants.SmartX}/${RouteConstants.DashBoard}`,
            ]);
          } else {
            this.pollLoginStatus();
          }
        },
        error: (error) => {
          this.pollCount++;
          this.pollLoginStatus();
        },
        complete: () => {
        },
      });
    }, POLL_INTERVAL);
  };

  // Helper methods
  getLoginQR = () => {
    this.pollCount = 0;
    this.enterpriseQRLoginResponse = null;
    this.loginQrApiStatus = APIStatus.InProgress;
    this.loginService.getLoginQR().subscribe({
      next: (response) => {
        this.enterpriseQRLoginResponse = response;
        this.loginQrApiStatus = APIStatus.Success;
        this.pollLoginStatus();
      },
      error: (error) => {
        this.loginQrApiStatus = APIStatus.Failure;
      },
      complete: () => {},
    });
  };
}
