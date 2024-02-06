import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CanDeactivate } from '@angular/router';

import { ConfirmDialogComponent } from '../app-dialog/confirm-dialog/confirm-dialog.component';
import { UpdateUserComponent } from './update-user/update-user.component';

@Injectable({
  providedIn: 'root',
})
export class UserGuard implements CanDeactivate<UpdateUserComponent> {

  constructor(
    public dialog: MatDialog,
  ) { }

  public async canDeactivate(component: UpdateUserComponent) {
    if (component.form.touched && component.form.dirty) {
      const dialogRef = this.getConfirmationDialog();
      let input = false;

      await dialogRef.afterClosed().toPromise()
        .then((result) => {
          if (result) {
            input = true;
          }
        });
      return input;
    } else {
      return true;
    }
  }

  public getConfirmationDialog() {
    return this.dialog.open(ConfirmDialogComponent, {
      data: {
        input: true,
        message: `There are unsaved changes. Are you sure you want to proceed?`,
      },
      width: '450px',
    });
  }

}
