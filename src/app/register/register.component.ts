// @ts-nocheck
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { SServiceService } from '../s-service.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})

export class RegisterComponent implements OnInit {

  constructor(private modalCtrl: ModalController, private sanitizer: DomSanitizer, private alertController: AlertController, private http: HttpClient, private s_service: SServiceService) { }

  //Ausrechnen des minimalen und maximalen Datums für das Geburtstagsmodal
  today = new Date();
  maxyear = this.today.getFullYear() - 18;
  maxdate = String(this.maxyear) + String(this.today.toISOString().slice(4, 10));
  minyear = this.today.getFullYear() - 100;
  mindate = String(this.minyear) + String(this.today.toISOString().slice(4, 10));
  
  //Speichern der Usereingaben in Variablen
  username: String = "";
  password: String = "";
  name: String = "";
  date = this.maxdate;
  gender: String = "";
  grade: String = "";
  location: String = "";
  subjects: String[] = [];
  introduction: String = "";
  phonenumber: String = "";
  photo: SafeResourceUrl;
  theimage: String = "";

  ngOnInit() {}

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  //Klicken des "Confirm"-Buttons
  async confirm() {
    //Regular Expressions um die Eingaben zu überprüfen, z.B. "regex" für Passwort mit mind. 8 Zeichen, Sonderzeichen und Groß-/Kleinschreibung
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const regex2 = /^[a-zA-Z\s]+$/;
    const regex3 = /^\d+$/;
    //Warten auf Prüfung, ob gewünschter Username noch zu haben ist
    const taken_username = await this.checkUsername(this.username);
    
    //Überprüfen jeder Eingabe auf Sinnhaftigkeit und Vollständigkeit, sonst Fehlermeldung bei entsprechendem Ion-Input-Element
    if (this.username.length>0 && taken_username){
      if (regex.test(this.password)) 
      {
        if (this.name.length>0 && regex2.test(this.name)) {
          if (this.gender.length>0) {
            if (this.grade.length>0) {
              if (this.subjects.length>0) {
                if (this.location.length>0 && regex2.test(this.location)) {
                  if (this.introduction.length>0) {
                    if (this.phonenumber.length>6 && regex3.test(this.phonenumber))
                      if (this.photo!=null) {
                        //Alle Angaben sind in Ordnung -> Schicken an API und Benachrichtigung
                        this.registerUser(this.name, this.date, this.gender, this.grade, this.location, this.subjects.toString(), this.introduction, this.phonenumber, String(this.theimage), this.username, this.password);
                        this.presentAlert();
                        return this.modalCtrl.dismiss('s', 'confirm');
                      }
                      else {
                        let element = document.getElementById("photo");
                        element.classList.add("ion-invalid");
                      }
                    else {
                      let element = document.getElementById("phonenumber");
                      element.classList.add("ion-invalid");
                    }
                  }
                  else {
                    let element = document.getElementById("introduction");
                    element.classList.add("ion-invalid");
                  }
                }
                else {
                  let element = document.getElementById("location");
                  element.classList.add("ion-invalid");
                }
              }
              else {
                let element = document.getElementById("subjects");
                element.classList.add("ion-invalid");
              }
            }
            else {
              let element = document.getElementById("grade");
              element.classList.add("ion-invalid");
            }
          }
          else {
            let element = document.getElementById("gender");
            element.classList.add("ion-invalid");
          }
        }
        else {
          let element = document.getElementById("name");
          element.classList.add("ion-invalid");
        }
      }
      else {
        let element = document.getElementById("rpassword");
        element.classList.add("ion-invalid");
      }
    }
    else {
      let element = document.getElementById("rusername");
      element.classList.add("ion-invalid");
    
    }
  }

  //Bildaufnahme im Base64 Format
  async takePicture() {
    const image = await Camera.getPhoto({
      quality: 1,
      allowEditing: true,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera
    });
    this.photo = "data:image/png;base64, " + image.base64String;
    this.theimage = image.base64String;
  }


  //Erfolgreiche Benachrichtung
  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Success!',
      subHeader: 'Created new Account',
      cssClass: 'regi-alert',
      message: 'Login with username and password',
      buttons: [
        {
          text: 'OK',
          cssClass: 'matchbtnok'
        }
      ],
    });
    await alert.present();
  }
  

  //Schicken der Daten an API zum Insert
  registerUser(name: String, date: String, gender: String, grade: String, location: String, subjects: String, introduction: String, phonenumber: String, photo: String, username: String, password: String) {
    let data = {
      "name": name,
      "date": date,
      "gender": gender,
      "grade": grade,
      "location": location,
      "subjects": subjects,
      "introduction": introduction,
      "phonenumber": phonenumber,
      "photo": photo,
      "username": username,
      "password": password
    };
    this.http.put('http://joenoadoen.de/new_profile.php', JSON.stringify(data)).subscribe(res => {
      console.log(res);
    },
    error => {
      console.error(error);
    });
  }

  //Verfügbarkeit des Usernames prüfen
  async checkUsername(p_username: string) {
    return new Promise((resolve, reject) => {
      const data = { p_username };
      this.http.put('http://joenoadoen.de/check_username.php', JSON.stringify(data)).subscribe(
        (res) => {
          resolve(res);
        },
        (error) => {
          console.error(error);
          reject(error);
        }
      );
    });
  }

}
