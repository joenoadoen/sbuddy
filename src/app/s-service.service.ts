// @ts-nocheck
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SServiceService {
  
  //gebündelte Settings zur Übergabe an API um dementsprechend Profile zu liefern s. home.page.ts
  private settings_v: any = {};

  //Settingsvariablen mit Default-Wert
  public settings_gender: String[] = ['male', 'female', 'diverse'];
  public settings_age: any = {lower: 0, upper: 100};
  public settings_age_l: String = "";
  public settings_age_u: String = "";
  public settings_grade: String = 'both';
  public settings_subjects: String[] = ['Physics', 'Math', 'Informatics', 'Chemistry', 'German', 'Chinese', 'French', 'Spanish', 'English', 'History', 'Philosophy'];
  
  //User-Daten
  public id: int;
  public matches: String[] = [];
  public likes: String[] = [];


  constructor() {
    //Suchen nach Sucheinstellungen des Users im Local Storage, sonst Default Werte übergeben
    if(window.localStorage.getItem("grade")!=null)
    {
      this.settings_grade = String(window.localStorage.getItem("grade"));
    }
    if(window.localStorage.getItem("gender")!=null)
    {
      this.settings_gender = window.localStorage.getItem("gender").split(',');
    }
    if(window.localStorage.getItem("agel")!=null && window.localStorage.getItem("ageu")!=null) {
      this.settings_age["lower"] = parseInt(window.localStorage.getItem("agel"));
      this.settings_age["upper"] = parseInt(window.localStorage.getItem("ageu"));
    }
    if(window.localStorage.getItem("subjects")!=null)
    {
      this.settings_subjects = window.localStorage.getItem("subjects")?.split(',');
    }
    if(window.localStorage.getItem("likes")!=null)
    {
      this.likes = window.localStorage.getItem("likes")?.split(',');
    }
    if(window.localStorage.getItem("matches")!=null)
    {
      this.matches = window.localStorage.getItem("matches")?.split(',');
    }
    if(window.localStorage.getItem("id")!=null)
    {
      this.id = window.localStorage.getItem("id");
    }
    
  }

  //Updaten des Local Storage
  updateStorageVar(type: String) {
    if (type=='gender')
    {
      window.localStorage.setItem("gender", String(this.settings_gender));
    }
    if (type=='grade')
    {
      window.localStorage.setItem("grade", String(this.settings_grade));
    }
    if (type=='age')
    {
      window.localStorage.setItem("agel", String(this.settings_age["lower"]));
      window.localStorage.setItem("ageu", String(this.settings_age["upper"]));
    }
    if (type=='subjects')
    {
      window.localStorage.setItem("subjects", this.settings_subjects.toString());
    }
    if (type=='likes')
    {
      window.localStorage.setItem("likes", this.likes.toString());
    }
    if (type=='matches')
    {
      window.localStorage.setItem("matches", this.matches.toString());
    }
    if (type=='id')
    {
      window.localStorage.setItem("id", this.id);
    }
    }
  
  
  //Bündeln der Sucheinstellungen für Sendung an API
  getSettings() {
    this.settings_v['pr_gender'] = this.settings_gender.join(', ');
    this.settings_v['pr_age_u'] = new Date().getFullYear() - this.settings_age['lower'];
    this.settings_v['pr_age_l'] = new Date().getFullYear() - this.settings_age['upper'];
    this.settings_v['pr_grade'] = this.settings_grade;
    this.settings_v['pr_subjects'] = this.settings_subjects.join(', ');
    return this.settings_v;
  }


}
