import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { EnvService } from './env.service';
import { User } from '../models/user';

import { Storage } from '@ionic/storage';
import { Fiche } from '../models/Fiche';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isLoggedIn = false;
  token:any; //Token envoyé de La Backend (Laravel) lors du login
  us: User; //L'utilisateur connecté
  nbreFiche: any; //Nbre de fiches remplies par l'utilisateur connecté
  reponsesFiche = new Array(); //Les réponses des fiches remplies par l'utilisateur connecté
  // fiche: Fiche;

  constructor(
    private http: HttpClient,
    // private storage: NativeStorage,
    private storage: Storage,
    private env: EnvService,
  ) { }

  addFiche(test, isolement, situation, symptome, tempsTousse, user_id, reponseTest_id) {
    return this.http.post(this.env.API_URL + 'addFiche',
      {test: test, isolement: isolement, situation: situation, symptome: symptome, tempsTousse: tempsTousse, user_id: user_id, reponseTest_id: reponseTest_id}
      )
  }

  addInfos(nom, prenom, age, sexe, adresse, telephone, ville, user_id) {
    return this.http.post(this.env.API_URL + 'addInfos',
    {nom: nom, prenom: prenom, age: age, sexe: sexe, adresse: adresse, telephone: telephone, ville: ville, user_id: user_id}
    )
  }

  userReponse(user_id) {
    return this.http.post(this.env.API_URL + 'userReponse',
      {user_id: user_id}
    ).pipe(
      tap(data => {
        delete this.nbreFiche;
        this.reponsesFiche.length = 0;

        this.nbreFiche = data['count'][0]['nbre'];
        // for(let index of Object.keys(data['count']))
        // {
        //   this.nbreFiche.push(data['count'][index]);
        // }
        for(let index of Object.keys(data['result']))
        {
          this.reponsesFiche.push(data['result'][index]);
        }
        // alert(data['result'][1]['reponseTest_id']);
      },
      error => {
        console.log(error);
      })
    )
  }

  getNbreFiche() {
    return this.nbreFiche;
  }

  getReponsesUser() {
    return this.reponsesFiche;
  }

  login(email: String, password: String, type: number) {
    return this.http.post(this.env.API_URL + 'loginMobile',
      {email: email, password: password, type: type}
    ).pipe(
      tap(data => {
        // this.storage.setItem('token', token)
        this.storage.set('token', data['token'])
        .then(
          data => {
            console.log('Token Stored');
          },
          error => console.error('Error storing item', error)
        );
        this.token = data['token'];
        this.us = data['user'];
        this.isLoggedIn = true;
        return data;
      })
    );
  }

  getUser() {
    return this.us;
  }

  register(name: String, email: String, password: String, type: number) {
    return this.http.post(this.env.API_URL + 'register',
      {name: name, email: email, password: password, type: type}
    )
  }

  logout() {
    const headers = new HttpHeaders({
      'Authorization': this.token["token_type"]+" "+this.token["access_token"]
    });
    return this.http.get(this.env.API_URL + 'logout', { headers: headers })
    .pipe(
      tap(data => {
        this.storage.remove("token");
        this.isLoggedIn = false;
        delete this.token;
        delete this.us;
        delete this.nbreFiche;
        this.reponsesFiche.length = 0;
        return data;
      })
    )
  }

  // user() {
  //   const headers = new HttpHeaders({
  //     'Authorization': this.token["token_type"]+" "+this.token["access_token"]
  //   });
  //   return this.http.get<User>(this.env.API_URL + 'profile', { headers: headers })
  //   .pipe(
  //     tap(user => {
  //       return user;
  //     })
  //   )
  // }

  getToken() {
    return this.storage.get('token').then(
      data => {
        this.token = data;
        if(this.token != null) {
          this.isLoggedIn=true;
        } else {
          this.isLoggedIn=false;
        }
      },
      error => {
        this.token = null;
        this.isLoggedIn=false;
      }
    );
  }
}
