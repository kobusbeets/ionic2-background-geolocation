import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { TrackingService } from '../../providers/tracking-service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, public trackingService: TrackingService) {}

  //function to start the tracking service
  startService() {
    this.trackingService.startService();
  }

  //function to stop the tracking service
  stopService() {
    this.trackingService.stopService();
  }
}
