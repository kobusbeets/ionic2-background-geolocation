import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { BackgroundMode } from '@ionic-native/background-mode';

import { TrackingService } from '../providers/tracking-service';

import { HomePage } from '../pages/home/home';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = HomePage;

  // variable to keep the previous timestamp
  old_time: number = null;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public trackingService: TrackingService, backgroundMode: BackgroundMode) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      // enable background mode for iOS.
      backgroundMode.enable();

      // start a custom background service defined in this component
      this.startBackgroundService();

      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  // a background service to start and stop user location tracking in intervals
  startBackgroundService() {
    // execute a function every second for location tracking
    setInterval(() => {
      let new_time = new Date().getTime();

      // start the tracking service every 24 seconds
      if((this.old_time === null) || ((new_time - this.old_time) > 24000)) {
        this.old_time = new_time;
        this.trackingService.startService();
      }

      // stop the tracking service after 6 seconds since it was started
      if((new_time - this.old_time) > 6000) {
        this.trackingService.stopService();
      }

      this.trackingService.est = Math.round(24 - ((new_time - this.old_time) / 1000));
    }, 1000);
  }
}

