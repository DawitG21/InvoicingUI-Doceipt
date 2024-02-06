import { Component, OnInit, Inject } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';

import { DialogConfirmData } from 'src/app/interfaces/dialog-confirm-data';

import { AuthService } from 'src/app/core/authentication/auth.service';

import { ContactSearchComponent } from '../../contact/contact-search/contact-search.component';

@Component({
  selector: 'app-assign-contact-dialog',
  templateUrl: './assign-contact-dialog.component.html',
  styleUrls: ['./assign-contact-dialog.component.scss']
})
export class AssignContactDialogComponent implements OnInit {

  claims: any;

  constructor(
    public dialogRef: MatDialogRef<AssignContactDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogConfirmData,
    public dialog: MatDialog,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.claims = this.authService.userClaims;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  openSearchDialog(): void {
    const dialogRef = this.dialog.open(ContactSearchComponent, {
      width: '550px',
      data: { show: true, },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      // batch invoice dialog closed
    });

    dialogRef.backdropClick().subscribe(() => {
      dialogRef.close();
    });
  }

}
