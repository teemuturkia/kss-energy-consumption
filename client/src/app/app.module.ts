import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthHttpInterceptor, AuthModule } from '@auth0/auth0-angular';
import { NgChartsModule } from 'ng2-charts';
import { auth0 } from '../environments/auth0';

import { AppComponent } from './app.component';
import { AuthButtonComponent } from './auth-button/auth-button.component';
import { ButtonToolbarComponent } from './button-toolbar/button-toolbar.component';
import { ChartComponent } from './chart/chart.component';
import { TextBoxComponent } from './text-box/text-box.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthButtonComponent,
    TextBoxComponent,
    ChartComponent,
    ButtonToolbarComponent
  ],
  imports: [
    AuthModule.forRoot({
      audience: auth0.audience,
      clientId: auth0.clientId,
      domain: auth0.domain,
      httpInterceptor: {
        allowedList: ['/api', '/api/upload', '/api/consumption']
      }
    }),
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatButtonModule,
    MatIconModule,
    NgChartsModule,
    FormsModule,
    MatProgressSpinnerModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthHttpInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule {
}
