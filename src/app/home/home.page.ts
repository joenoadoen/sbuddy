import { AfterViewInit, Component, ElementRef, NgZone, QueryList, ViewChildren } from '@angular/core';
import { GestureController, IonCard, Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { SServiceService } from '../s-service.service';
import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit {

  //Speicherort der Profilkarten
  persons :any = [];

  //Kategorisierung der Fächer für die Icon-Zuweisung
  languages = ["German", "Chinese", "English", "French", "Spanish"];
  sciences = ["Math", "Physics", "Chemistry", "Informatics"];
  appliences = ["History", "Philosophy"];

  //Icon-Zuweisung
  giveIcon(s: string) {
    if (this.languages.includes(s)) {
      return "language";
    }
    if (this.sciences.includes(s)) {
      return "calculator";
    }
    if (this.appliences.includes(s)) {
      return "book";
    }
    else return "";
  }

  
  @ViewChildren(IonCard, { read: ElementRef })
  cards!: QueryList<ElementRef>;

  constructor(private gestureCtrl: GestureController, private zone: NgZone, private plt: Platform, private http: HttpClient, private s_service: SServiceService, private alertController: AlertController) {
  }
  ngAfterViewInit(): void {
   
  }

  
  ngAfterViewChecked(){
    const cardArray = this.cards.toArray();
    this.useTinderSwipe(cardArray);
  }

  //Erstellen bzw. updaten der Profilkarten
  updateCards() {
    this.http.put('http://joenoadoen.de/show_profiles.php', this.s_service.getSettings()).subscribe((response: any) => {
      if (response!=null) 
      {
        //Resetten der ggf. vorherigen Menge
        this.persons = [];  
        for (const element of response)
        { 
          //Auslassen des eigenen Profils und bereits "geliketer" Profile
          if(!this.idCheck(element["id"]))
          {
            //Berechnen des Alters        
            const dob = new Date(element["date_of_birth"]);
            const today = new Date();
            element["age"] = Math.abs(today.getFullYear() - dob.getFullYear());
            //Erstellen des Fächer Arrays aus entsprechendem String
            element["subject_list"] = element["subjects"].split(",");
            delete element["subjects"];
            //Umwandlung der Zahl(MySQL) in boolean(Ionic) für Tutorenstatus
            element["teacher"] = !!+element["teacher"];
            //Hinten anhängen
            this.persons.unshift(element);
          }       
        }
        //Mischen
        this.persons = this.shuffle(this.persons);
      }
      else 
      {
        //Fehler
        console.log("Etwas ist schiefgelaufen");
      }
    });
  }

  //Aktualisieren wenn Seite (neu) aufgerufen wird
  ionViewWillEnter() {
    //Ausnahme, wenn User von der "Matches" Seite kommt
    if (window.localStorage.getItem("page")!=="matches")
    {
      this.updateCards();
      const cardArray = this.cards.toArray();
      this.useTinderSwipe(cardArray);
    }
    else 
    {
      window.localStorage.setItem("page", "home");
    }
  }

  //Page-Refreshing durch Nach-unten-ziehen
  handleRefresh(ev: any) {
    document.location.reload();
  }

  //Swipe-Geste der Profilkarten im Tinder-Stil
  useTinderSwipe(cardArray: string | any[]) {
    for (let i = 0; i<cardArray.length; i++)
    {
      const card = cardArray[i];
      const gesture = this.gestureCtrl.create({
        el: card.nativeElement,
        gestureName: 'tinder-swipe',
        onStart: ev => {
          card.nativeElement.style.transition = '';
        },
        onMove: ev =>
        {
          //Bewegung und Rotation
          card.nativeElement.style.transform = `translateX(${ev.deltaX}px) rotate(${ev.deltaX / 10}deg)`;
          //Rechts
          if (ev.deltaX > 0)
          {
            //Sichtbar bzw. unsichtbar machen des roten oder grauen Herzes, falls man nach links bzw. rechts wischt
            card.nativeElement.childNodes[1].style.opacity = ev.deltaX / 125;
            card.nativeElement.childNodes[0].style.opacity = 0;

          }
          //Links
          if (ev.deltaX < 0)
          {
            card.nativeElement.childNodes[0].style.opacity = -ev.deltaX / 125;
            card.nativeElement.childNodes[1].style.opacity = 0;
          }
        },
        onEnd: ev => {
          //Easing
          card.nativeElement.style.transition = '.5s ease-out';
          //Wischen über Threshold rechts -> Like
          if (ev.deltaX > 150) 
          {
            //"Rausrotieren"
            card.nativeElement.style.transform = `translateX(${+this.plt.width() * 2}px) rotate(${ev.deltaX / 2}deg)`;
            //Senden des Likes
            this.sendLike(Number(this.s_service.id), Number(card.nativeElement.attributes["id"].value));  
          }
          //Wischen über Threshold links -> Dislike 
          else if (ev.deltaX < -150) 
          {
            //"Rausrotieren, keine sonstige "Rausschmeiß-Aktion" -> User kann sich später erneut entscheiden ob er nicht doch "liken" will
            card.nativeElement.style.transform = `translateX(-${+this.plt.width() * 2}px) rotate(${ev.deltaX / 2}deg)`;
          } 
          else 
          {
            //Zurücksnappen der Karte
            card.nativeElement.style.transform = '';
            card.nativeElement.childNodes[1].style.opacity = 0;
            card.nativeElement.childNodes[0].style.opacity = 0;
          }
        }
      });
      gesture.enable(true);
    }
  }

  //Senden eines Likes
  sendLike(userId: number, likedId: number) 
  {
  let data = {
    "userId": userId,
    "likedId": likedId
  };
  this.http.post('http://joenoadoen.de/like.php', data).subscribe(res => {
    //"Gelikete" Person hat User auch bereits geliked -> Match
    if(res) 
    {
      //Aufnehmen in matches Array
      this.s_service.matches.unshift(String(likedId));
      this.s_service.updateStorageVar("matches");
      let likedname = "";
      //Suchen des Namens in "persons[]" anhand der id -> für Benachrichtigung
      for (let p of this.persons) 
      {
        if (String(p.id) === String(likedId))
        {
          likedname = p.name;
        }
      }
      //Benachrichtigung
      this.presentMatchAlert(String(likedname));

    }
    //"Gelikete" Person hat User noch nicht geliked -> lediglich Aufnehmen in likes[]
    else {
      this.s_service.likes.unshift(String(likedId));
      this.s_service.updateStorageVar("likes");
    }
  },
  error => {
    //Fehler
    console.error(error);
  });
  }

  //Mischen der Profilkarten für mehr Variation nach Fisher-Yates Algorithmus, s. "https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array"
  shuffle(a: any[]) {
    let j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
  }

  //Match Benachrichtigung
  async presentMatchAlert(matchid: String) {
    const alert = await this.alertController.create
    ({
      header: "It's a match!",
      subHeader: 'Congratulations, you matched with ' + matchid + '!',
      cssClass: 'match-alert',
      buttons: [
                {
                  text: 'OK',
                  cssClass: 'matchbtnok'
                }
              ],
    });
    await alert.present();
  }

  //Überprüfung, ob Profil das eigene oder ein bereits "geliketes" ist
  idCheck(id: String)
  {
    return (this.s_service.likes.includes(id) || String(this.s_service.id)===id);
  }

}
