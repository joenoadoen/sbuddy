// @ts-nocheck
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SServiceService } from '../s-service.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-match',
  templateUrl: './match.page.html',
  styleUrls: ['./match.page.scss'],
})
export class MatchPage implements OnInit {

  constructor(private http: HttpClient, private s_service: SServiceService, private sanitizer: DomSanitizer) { }

  ionViewWillEnter() {
    //Seite im Storage auf "Matches" stellen, sodass nach Rückkehr auf Hauptseite diese nicht neugeladen wird
    window.localStorage.setItem("page", "matches");
    //Updaten der Usermatches
    this.updateMatches();
  }

  //Aufbewahrungsort der Matches
  thematches:any = [];

  //Base64 String für Profilbilder
  image: SafeResourceUrl;


  //Abholen der Matches mit ihren Daten (Nummer, Name, Bild)
  async updateMatches() {
    await this.updateMatchbox(this.s_service.id);
    if(this.s_service.matches.length>0)
    {
      let ids = this.s_service.matches.map(Number);
      this.http.put('http://joenoadoen.de/get_matches.php', ids).subscribe((response: any) => {
        if (response!=null) 
        {
          for (const element of response){
            //Prüfen ob Match schon existiert
            if (this.phoneCheck(element["id"]))
            {
              this.image = this.s_service.photo;
              this.thematches.unshift(element);
            }
          }
        }
      });
    }
  }

  //Updaten der id-Liste, welche aufzählt, mit wem der User gematched hat (nicht zu verwechseln mit den eigentlichen Matches und deren Profildaten s. this.updateMatches())
  async updateMatchbox (id: Number) {
    let data = {
      "id": id
    };
    this.http.put('http://joenoadoen.de/get_matchbox.php', data).subscribe((res: any) => {
      if(res!=null)
      {
        if(res.matches != null)
        {
          this.s_service.matches = res.matches.split(',');
        }
        else
        {
          this.s_service.matches = [];
        }
        this.s_service.updateStorageVar('matches');
      }
    },
    error => {
      console.error(error);
    });
  }


  //Überprüfen ob Match schon im Array existiert
  phoneCheck(number: String) 
  { 
    for (const match of this.thematches) 
    {
      if ("phonenumber" in match && match["phonenumber"]===number)
      {
        return false;
      }
    }
    return true;
  }

}
