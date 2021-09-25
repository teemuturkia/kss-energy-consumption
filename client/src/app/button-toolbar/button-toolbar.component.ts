import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-button-toolbar',
  templateUrl: './button-toolbar.component.html',
  styleUrls: ['./button-toolbar.component.sass']
})
export class ButtonToolbarComponent {

  constructor(public auth: AuthService, private http: HttpClient) {
  }

  uploadFile(e: Event) {
    const target = e?.currentTarget as HTMLInputElement;
    if (target?.files?.length) {
      console.log('file', target.files[0]);
      const formData = new FormData();
      formData.append('file', target.files[0]);
      this.http.post('/api/upload', formData).subscribe(() => {
        console.log('success :)');
        window.location.reload();
      }, () => {
        console.log('error :(');
      })
    }
  }

}
