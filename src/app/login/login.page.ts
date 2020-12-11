import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from "@angular/router";
import firebase from 'firebase'
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  recaptchaVerifier:firebase.auth.RecaptchaVerifier;
  constructor( private alertCtrl: AlertController,  public router: Router) {}

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user'));
    if(user != null){
      this.router.navigate(['home']);
    }
    this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
  }
  signIn(phoneNumber: number){
    const appVerifier = this.recaptchaVerifier;
    const phoneNumberString = "+" + phoneNumber;
    let self = this;
    firebase.auth().signInWithPhoneNumber(phoneNumberString, appVerifier)
      .then( async (confirmationResult) => {

        let prompt = await this.alertCtrl.create({
          inputs: [{ name: 'confirmationCode', placeholder: 'Confirmation Code' }],
          buttons: [
            { text: 'Cancel',
              handler: data => { console.log('Cancel clicked'); }
            },
            { text: 'Send',
              handler: data => {
                confirmationResult.confirm(data.confirmationCode)
                .then(function (result) {
                  localStorage.setItem('user', JSON.stringify(result.user))
                  self.router.navigate(['home'])
               
                }).catch(function (error) {
                  console.log(error)
                  localStorage.setItem('user', null);
                  window.alert('Error');
                });
              }
            }
          ]
      });
      await prompt.present();
    })
    .catch(function (error) {

      window.alert('Sms not sent');
      localStorage.setItem('user', null);
    });
   
  }
}
