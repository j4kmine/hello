import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import firebase from 'firebase/app';
require('firebase/auth')
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  recaptchaVerifier:firebase.auth.RecaptchaVerifier;
  constructor( private alertCtrl: AlertController) {}

  ngOnInit() {
    this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
  }
  signIn(phoneNumber: number){
    const appVerifier = this.recaptchaVerifier;
    const phoneNumberString = "+" + phoneNumber;
    firebase.auth().signInWithPhoneNumber(phoneNumberString, appVerifier)
      .then( async (confirmationResult) => {
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
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
          
                  console.log(result.user);
                  
                }).catch(function (error) {
                  console.log(error);
                });
              }
            }
          ]
      });
      await prompt.present();
    })
    .catch(function (error) {
      console.error("SMS not sent", error);
    });
  
  }
}
