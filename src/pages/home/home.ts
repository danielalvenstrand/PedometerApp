import { Component, NgZone } from '@angular/core';
import { Storage } from '@ionic/storage';

import { NavController, ToastController } from 'ionic-angular';
import { BackgroundMode } from 'ionic-native';

declare let pedometer: any;

@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})
export class HomePage {

	steps: number = 0;
	pedStatus: string = '';
	

	constructor(
		public navCtrl: NavController,
		public toastCtrl: ToastController,
		public zone: NgZone,
		public storage: Storage
		)
	{
		BackgroundMode.enable();
	}

	ionViewWillEnter(): void {
		pedometer.isStepCountingAvailable(
			()=>{ this.pedStatus = "Pedometer step counting available!"},
			()=>{ this.pedStatus = "Pedometer step counting not available!"}
			);

		this.storage.get('steps').then((val) => {
			if (val) this.steps = val;
			else this.storage.set('steps', 0);

			pedometer.startPedometerUpdates(
				()=>{ this.zone.run(() => {
					this.steps += 1;
					this.storage.set('steps', this.steps);
				}) },
				()=>{ }
				);
		});
	}

	showStorage(): void {
		this.storage.get('steps').then((val) => {
			let toast = this.toastCtrl.create({
				message: 'Steps stored: '+val,
				duration: 2000
			});
			toast.present();
		});
	}

}
