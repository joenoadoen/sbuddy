import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { SServiceService } from '../s-service.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  
  constructor(public s_service: SServiceService, public navController: NavController) { }
  
  ngOnInit() {
    
  }

  //Ausloggen und Löschung aller gesammelten User-Settings -> Local Storage
  logout() {
    window.localStorage.clear();
    this.navController.navigateForward('/login');
  }
}
