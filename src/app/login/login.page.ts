// @ts-nocheck
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { RegisterComponent } from '../register/register.component';
import { HttpClient } from '@angular/common/http';
import { NavController } from '@ionic/angular';
import { SServiceService } from '../s-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private modalCtrl: ModalController, private http: HttpClient, public navController: NavController, private s_service: SServiceService) { }

  ngOnInit() {
  }

  username = "";
  password = "";


  //Öffnen des Registrierungsmodals
  async openModal() {
    const modal = await this.modalCtrl.create({
      component: RegisterComponent
    });
    await modal.present();
  }

  //Überprüfen ob User-Passwort-Combi existiert
  login (username: String, password: String) {
  let data = {
    "username": username,
    "password": password
  };
  this.http.put('http://joenoadoen.de/login.php', data).subscribe(res => {
    //Existiert nicht -> Fehlermeldung beim Ion-Input
    if(Object.values(res).length<1)
    {
      let element = document.getElementById("password");
      element.classList.add("ion-invalid");
    }
    //Existiert -> Einloggen und abholen der user likes, matches und id
    else
    {
      this.s_service.id = Object.values(res)[0]["id"];
      if(Object.values(res)[0]["likes"]!=null) 
      {
        this.s_service.likes = Object.values(res)[0]["likes"].split(',');
      }
      else
      {
        this.s_service.likes = [];
      }
      if(Object.values(res)[0]["matches"]!=null) 
      {
        this.s_service.matches = Object.values(res)[0]["matches"].split(',');
      }
      else 
      {
        this.s_service.matches = [];
      }
      
      this.s_service.updateStorageVar('likes');
      this.s_service.updateStorageVar('matches');
      this.s_service.updateStorageVar('id');
      //User kann somit eingeloggt bleiben und darf zwischen Seiten wechseln -> AuthGuard
      window.localStorage.setItem('isLoggedIn', true);
      //Aufrufen Hauptseite
      this.navController.navigateForward('/home');
    }
  },
  error => {
    //Fehler
    console.error(error);
  });
}

}
