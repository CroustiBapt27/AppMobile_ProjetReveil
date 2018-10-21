import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { Toast } from '@ionic-native/toast';
import { Storage } from '@ionic/storage';
import { FormControl, Validators, FormBuilder, FormGroup, ValidatorFn, AbstractControl } from '@angular/forms';
import { HomePage } from '../home/home';

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})

export class RegisterPage {
  login: string;
  password: string;
  confirmPassword: string;

  registerUser: FormGroup;

  constructor(public navCtrl: NavController,
    public alertCtrl: AlertController,
    public databaseUser: DatabaseProvider,
    private storage: Storage,
    private toast: Toast,
    private formBuilder: FormBuilder) {

    this.registerUser = this.formBuilder.group({
      login: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required, this.equalto('password')])
    });

  }

  equalto(password): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {

      let input = control.value;

      let isValid = control.root.value[password] == input
      if (!isValid)
        return { 'equalTo': { isValid } }
      else
        return null;
    };
  }

  register() {
    if (this.password == this.confirmPassword) {
      this.databaseUser.insertNewUserInDataBase(this.login, this.password);
      this.storage.set('current_username', this.login);
      this.navCtrl.setRoot(HomePage);
    }
    else {
      this.toast.show('Les deux mots de passe doivent être identiques', '5000', 'center').subscribe(
        toast => {
          console.log('Les deux mots de passe doivent être identiques');
        }
      );
    }
  }

  async getFromDB() {
    var dataUserInDB = [{ login: "", password: "" }];
    var lengthDB;
    await this.databaseUser.selectUserFromDataBase().then(data => {
      lengthDB = data.rows.length;
      for (var i = 0; i < lengthDB; i++) {
        dataUserInDB[i].login = data.rows.item(i).login;
        dataUserInDB[i].password = data.rows.item(i).password;
        console.log("User " + i + " : " + dataUserInDB[i].login + " and password is: " + dataUserInDB[i].password);
      }
    })
      .catch(error => {
        console.log("Error from getFromDB(): " + error.message);
      });
  }
}

