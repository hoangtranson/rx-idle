# RxIdle
Service for Angular 7 to detect and control of user's idle.

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.2.0.

## Important
This library was written based on my boilerplate angular 7.2.0 So all samples was included some unneed stuff from my project.
Thank for your understanding.

## Service logic:

`RxIdleModule.forRoot({idle: 15, timeout: 5, ping: 2})` means that:

if user offline for 15 seconds then `onTimerStart()` for 5 seconds
if user did not stop timer by `stopTimer()` then `onTimeout()` is fired.

## Installation

`npm install rx-idle`

In app.module.ts:
```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { NgxsStoreModule } from '@app/store/store.module';
import { CoreModule } from 'core';
import { ReportModule } from './report/report.module';
import { RxIdleModule } from 'rx-idle';

import { AuthGuardService } from './auth/auth-guard.service';

import { UserResolver } from '@app/store/user/user.resolver';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    RxIdleModule.forRoot({idle: 15, timeout: 5, ping: 2}),

    CoreModule,
    ReportModule,
    
    AppRoutingModule,
    NgxsStoreModule
  ],
  providers: [AuthGuardService, UserResolver],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

## Usage

You should init user idle service in one of core component or service of your app,
for example login.component.ts:

```typescript
import { Component, OnInit } from '@angular/core';
import { TranslateService, ApiService } from 'core';
import { Store, Select } from '@ngxs/store';
import { RxIdleService } from 'rx-idle';

import { UserState } from '@app/store/user/user.state';
import { LoadData } from '@app/store/user/user.action';

import { environment } from '../environments/environment';
import { Navigate } from '@ngxs/router-plugin';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'angular7-blp';

  @Select(UserState.user) user$;

  constructor(
    private store: Store, 
    private translate: TranslateService, 
    private api: ApiService, 
    private idleService: RxIdleService) {
    this.api.setEnv(environment.api_url);
  }

  ngOnInit() {
    this.idleService.startWatching();
    this.idleService.onTimerStart().subscribe(count => console.log('should reset timer if mousemove event happen here'));
    this.idleService.onTimeout().subscribe(() => console.log('Do some actions here such as clear session and logout'));

    this.idleService.getPing().subscribe(() => console.log('ping alive'));
  }

  setLang(lang: string) {
    this.translate.use(lang);
  }

  getUserRole() {
    this.store.dispatch(new LoadData());
  }

  gotoTesting() {
    this.store.dispatch(new Navigate(['/testing'], {data: "test"}))
  }
}
```
## Build

Run `ng build rx-idle` to build the project. The build artifacts will be stored in the `dist/` directory.

## Publishing

After building your library with `ng build rx-idle`, go to the dist folder `cd dist/rx-idle` and run `npm publish`.

## Running unit tests

Run `ng test rx-idle` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
