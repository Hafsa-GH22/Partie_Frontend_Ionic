import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { Fiche } from 'src/app/models/Fiche';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-fiche',
  templateUrl: './fiche.page.html',
  styleUrls: ['./fiche.page.scss'],
})
export class FichePage implements OnInit {

  tousse: any;
  fiche = new Fiche();

  constructor(
    // private modalController: ModalController,
    private authService: AuthService,
    private navCtrl: NavController,
    private alertService: AlertService
  ) { 
      this.fiche.test = "";
      this.fiche.isolement = "";
      this.fiche.situation = "";
      this.fiche.symptome = "";
      this.fiche.reponseTest_id = 1;
      this.fiche.tempsTousse = 0;
      this.fiche.user_id = this.authService.getUser().id;
  }

  ngOnInit() {
  }

  test(value) {
    this.fiche.test = value.detail.value.toString();
    // alert(value.detail.value);
  }
  isolement(value) {
    this.fiche.isolement = value.detail.value.toString();
    // alert(value.detail.value);
  }
  situation(value) {
    this.fiche.situation = this.fiche.situation.concat(value.detail.value.toString());
    this.fiche.situation = this.fiche.situation.concat(" - ".toString());
    // alert(this.fiche.situation);
  }
  symptome(value) {
    this.fiche.symptome = this.fiche.symptome.concat(value.detail.value.toString());
    this.fiche.symptome = this.fiche.symptome.concat(" - ".toString());
    // alert(this.fiche.symptome);
  }

  addFiche() {
    // fiche = this.fiche;
    this.fiche.tempsTousse = this.tousse;
    this.authService.addFiche(this.fiche.test, this.fiche.isolement, this.fiche.situation, this.fiche.symptome, this.fiche.tempsTousse, this.fiche.user_id, this.fiche.reponseTest_id).subscribe(
      data => {
        this.alertService.presentToast("Vos reponses sont bien envoyées !");
      },
      error => {
        console.log(error);
      },
      () => {
        this.navCtrl.navigateRoot('/dashboard');
      }
    )
  }

}
