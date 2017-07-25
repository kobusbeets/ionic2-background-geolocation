import { Injectable, NgZone } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';

@Injectable()
export class TrackingService {

  public isRunning: boolean = false;

  //foreground tracking watcher
  public watch: any;

  //geocoordinates
  public lat: number = 0;
  public lng: number = 0;
  public alt: number = 0;

  //time before service restarts
  public est: number = 0;

  constructor(public http: Http, public zone: NgZone, public backgroundGeolocation: BackgroundGeolocation, public geolocation: Geolocation) {}

  //a function to start the tracking service
  startService() {
    //if the service is already running, do not start it again
    if(!this.isRunning) {

      //set some configuration for the background location service
      let backgroundGeoLocationServiceConfig = {
        desiredAccuracy: 0,
        stationaryRadius: 20,
        distanceFilter: 10, 
        debug: false,
        interval: 2000 
      };
    
      // subscribe to the background geo location services
      this.backgroundGeolocation.configure(backgroundGeoLocationServiceConfig).subscribe((location) => {
        // run update inside of Angular's zone
        this.zone.run(() => {
          this.lat = location.latitude;
          this.lng = location.longitude;
          this.alt = location.altitude;
        });
      }, (err) => {
        console.log(err);
      });
    
      // turn on the background-geolocation system.
      this.backgroundGeolocation.start();

      // config data for foreground tracking
      let foregroundGeoLocationServiceConfig = {
        frequency: 3000, 
        enableHighAccuracy: true
      };
      
      // subscribe to the foreground geo location service
      this.watch = this.geolocation.watchPosition(foregroundGeoLocationServiceConfig).subscribe((position: Geoposition) => {
        // run update inside of Angular's zone
        this.zone.run(() => {
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;
          this.alt = position.coords.altitude;
        });
      });

      this.isRunning = true;
    } 
  }

  // stops the background and foreground geo location services
  stopService() {
    // stop it only if it's already running
    if(this.isRunning) {

      // stop the background geo location service
      this.backgroundGeolocation.finish(); // required for iOS
      this.backgroundGeolocation.stop();

      // stop the foreground geo location tracking
      this.watch.unsubscribe();

      // send post request with the geo location data
      this.http.get('http://example.com/location-service.php?lat='+this.lat+'&lng='+this.lng+'&alt='+this.alt).subscribe((data) => {});

      this.isRunning = false;
    }
  }
}
