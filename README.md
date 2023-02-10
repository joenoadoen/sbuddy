
# Studybuddy

## Projektbeschreibung:

Studybuddy ist Rahmen des Moduls "Entwicklung mobiler Applikationen (WS22/23)" entstanden. Es handelt sich um eine voll funktionstüchtige Ionic/Angular App, inklusive serverseitigem Backend (-> PHP-API und MySQL-Datenbank).

Bei Studybuddy kommt jeder Nutzer auf seine Kosten, der entweder gerne Nachhilfe gibt, in Anspruch nimmt oder
sich einfach gerne über diverse Fächer mit anderen austauscht.

Dafür kann dieser, unter Angabe seiner relevanten Daten (-> Name, Alter, Profilbild usw.), ein Profil anlegen und anschließend nach dem Login loslegen.
Basierend auf seinen beliebigen Sucheinstellungen werden dem User nun andere Profile vorgeschlagen.
Ob er sich mit der jeweiligen Person in Verbindung setzen möchte, kann er dabei im Tinder-Stil entscheiden, wobei ein Wisch nach rechts ein "Like" bedeutet und ein Wisch nach links ein "Dislike".
Sollten sich dabei zwei User gegenseitig liken, entsteht für beide ein "Match".
Durch wechseln auf die Match-Seite werden dem User jeweils Profilbild, Name und Telefonnummer all seiner Matches aufgelistet, sodass er diese nun kontaktieren kann.


## Features

### Pages 

#### Login

Hier startet der User und bekommt zunächst einen ersten Eindruck der App via Logo und Farbgebung.
Nun kann er sich entweder Einloggen, falls er bereits einen entsprechenden Account besitzt oder Registrieren, falls nicht.
Versucht der User sich darüber hinweg Zutritt zu anderen Pages zu schaffen, wird er durch "Auth Guard" wieder zu dieser Seite zurückgeführt.
Zugang entsteht erst durch den Login und bleibt solange bestehen, bis der User sich explizit ausloggt, auch über mehrere Sitzungen hinweg via Local Storage. 
(Ausnahme: Der Local Storage wird manuell gelöscht)



#### Register

Hier kann der User ein Formular ausfüllen um ein neues Profil zu erstellen. Anschließend wird dieses an die API geschickt und in der Datenbank angelegt. 

Dabei muss der User folgende Daten hinterlegen: Usernamen, Passwort, Name, Geburtsdatum, Geschlecht, Status (ob Tutor oder Student), Aufenthaltsort, Fächer, Vorstellungstext, Handynummer und ein Profilbild (Erstellung entweder direkt per Kamera oder Auswahl aus Galerie)


#### Home

Auf der Home-Page spielt sich die eigentliche App-Funktion ab. Dem User werden, basierend auf seinen Sucheinstellungen, Profilkarten gezeigt. Diese kann er entweder liken (-> Rechtswisch) oder disliken (-> Linkswisch). Sobald er eine Person "liked" wird überprüft, ob diese ihn bereits ebenfalls "geliked" hat, wodurch ein "Match" entsteht. 
Andernfalls wird sie lediglich mit in das "likes[]" Array gepackt und taucht fortan nicht erneut als Profilkarte auf.
Sollte der User eine Person disliken, verschwinde sie für den Moment, kann aber bei "Refreshing" (-> Herunterziehen und loslassen) oder Anpassung der Sucheinstellungen erneut auftauchen, sollte der User es sich anders überlegen.

#### Header

Komponente der Home-Page, die der Navigierung dient. Sie zeigt ein Profil-Icon (-> Settings), das Studybuddy-Logo und ein Herz-Icon (-> Matches).


#### Settings

Erreichbar über das Person-Icon der Homepage ist die Settings-Page. Hier kann der User Geschlecht, Alter, Status und Fächer für die Suche anpassen. Sollten die Studybuddy-Profile (-> Datenbank) den Kriterien entsprechen, wobei es bei den Fächern genügt, wenn eines übereinstimmt, werden ihm diese anschließend auf der Home-Page vorgeschlagen.


#### Matches

Erreichbar über das Herz-Icon der Homepage ist die Matches-Page. Hier bekommt der User all seine Matches, inklusive deren Profilbild, Namen und Telefonnummer, aufgelistet, sodass er diese kontaktieren kann. Auf Seiten der Matchpartner sieht dies natürlich genauso aus.


#### S-Service

Ein Service im Hintergrund, der den Variablenaustausch jeder Seite ermöglicht. Dazu zählen Sucheinstellungen, Likes, Matches und id des Users. Er managed zugleich auch den Local Storage.


### API-Calls und Datenbank

Die App kommuniziert mit der Datenbank über eine eigene PHP-API, welche genau wie die Datenbank auf einem Hetzner-Server liegt.
Diese untergliedert sich in 7 verschiedene PHP-Skripte, mit unterschiedlichen Funktionen.

#### check_username.php

| Aufrufzeitpunkt | Parameter | Funktion |
|:--------------|:-------------|:--------------|
| Registrierung | Username | Überprüft, ob Username noch zu haben ist|



#### get_matchbox.php

| Aufrufzeitpunkt | Parameter | Funktion |
|:--------------|:-------------|:--------------|
| Besuch Matches-Page | User id | Liefert String mit Auflistung der Matches|


#### get_matches.php

| Aufrufzeitpunkt | Parameter | Funktion |
|:--------------|:-------------|:--------------|
| Besuch Matches-Page | Auflistung der Matches | Liefert Profildaten der Matches|


#### like.php

| Aufrufzeitpunkt | Parameter | Funktion |
|:--------------|:-------------|:--------------|
| Rechtswisch eines Profils | User id & Person id | Prüft ob Match oder nicht|


#### login.php

| Aufrufzeitpunkt | Parameter | Funktion |
|:--------------|:-------------|:--------------|
| Login | Username & Passwort | Prüft ob Profil besteht|


#### new_profile.php

| Aufrufzeitpunkt | Parameter | Funktion |
|:--------------|:-------------|:--------------|
| Registrierung | Daten des Registrierungs Forms | Legt neues Profil an|



#### show_profiles.php

| Aufrufzeitpunkt | Parameter | Funktion |
|:--------------|:-------------|:--------------|
| Besuch Home-Page | Suchkriterien (-> Settings-Page) | Liefert entsprechend Profile|


## Installation

Laden Sie das Projekt in eine Umgebung ihrer Wahl, z.B. Visual Studio Code, navigieren Sie in das richtige Verzeichnis per Terminal und starten dort anschließend die Applikation

```bash
  cd .\studybuddy
  ionic serve
```
    
## Infos & Zugangsdaten

### FTP Zugang 

Hiermit teile ich den Zugang zum FTP. Die API-Files liegen in public_html.

| Bezeichnung | Zugangs-Wert | 
|:--------------|:-------------
| Server | www148.your-server.de |
| Passwort | qPDSK5yd3uUUxwEd |
| Port | 21/22(SFTP) |


### MySQL-Datenbank 

Hiermit teile ich den Zugang zur Datenbank (-> phpMyAdmin).

| Bezeichnung | Zugangs-Wert | 
|:--------------|:-------------
| Datenbank | joenoa_db1 |
| Login | joenoa_1 |
| Passwort | ydcWAvgw9RrTh6P8 |
| Server | sql266.your-server.de |


### Sonstiges

Sollten weitere Daten benötigt werden oder Rückfragen entstehen, bin ich per Email erreichbar: jonsim01@t-online.de

Die letzten Systemtests erfolgten am 10.02.23 um 15:30 Uhr und es hat alles problemlos funktioniert.
## Screenshots

#### Home-Page

![Home-Page](http://wordpress.joenoadoen.de/wp-content/uploads/2023/02/Screenshot-102.png)


#### Matches-Page

![Matches-Page](http://wordpress.joenoadoen.de/wp-content/uploads/2023/02/Screenshot-103.png)


#### Settings-Page

![Settings-Page](http://wordpress.joenoadoen.de/wp-content/uploads/2023/02/Screenshot-104.png)


#### Login-Page

![Login-Page](http://wordpress.joenoadoen.de/wp-content/uploads/2023/02/Screenshot-105.png)


#### Register-Page

![Register-Page](http://wordpress.joenoadoen.de/wp-content/uploads/2023/02/Screenshot-107.png)

