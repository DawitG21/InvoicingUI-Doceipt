import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../../core/authentication/auth.service';

declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  fromQueryParam: string = '';

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private spinner: NgxSpinnerService
  ) { }


  ngOnInit() {
    this.fromQueryParam = this.route.snapshot.queryParamMap.get('from') ?? '';
    $('#modalLogin').modal('show');
  }

  login() {
    this.spinner.show();

    if (this.fromQueryParam) {
      const args = {
        data: {
          from: this.fromQueryParam,
        },
      };

      this.authService.login(args);
    } else {
      this.authService.login();
    }
  }
}


