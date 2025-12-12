import { DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { HttpService } from '../../service/http.service';

@Component({
  selector: 'app-dialog',
  imports: [],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
})
export class DialogComponent {
  dialogRef = inject<DialogRef>(DialogRef);
  htpService = inject(HttpService);

  optionSelected = false;
  bodyText = '';

  btnResponse(result: boolean) {
    this.optionSelected = true;

    if (result)
      this.bodyText =
        'Thank you. 😁 This encourage developer to make more of this for you.';
    else this.bodyText = '🥲';

    this.htpService.sendFeedback(result ? 'yes' : 'no').subscribe({
      next: (reason) => {
        this.dialogRef.close();
      },
    });
  }
}
