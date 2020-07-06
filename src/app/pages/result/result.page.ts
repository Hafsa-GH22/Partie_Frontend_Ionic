import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-result',
  templateUrl: './result.page.html',
  styleUrls: ['./result.page.scss'],
})
export class ResultPage implements OnInit {

  user: User;
  nbreFiche: any;
  reponsesFiche = new Array();

  constructor(private authService: AuthService) {
    delete this.nbreFiche;
    this.reponsesFiche.length = 0;
  }

  userReponse() {
    this.authService.userReponse(this.authService.getUser().id).subscribe(
      data => {
        console.log("Les infos passés !");
      },
      error => {
        console.log(error);
      }
    )
  }

  ngOnInit() {
    delete this.nbreFiche;
    this.reponsesFiche.length = 0;

    this.user = this.authService.getUser();
    this.userReponse();
    this.nbreFiche = this.authService.getNbreFiche();
    this.reponsesFiche = this.authService.getReponsesUser();
  }

}
