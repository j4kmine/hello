import { Component } from '@angular/core';
//Import AngularFirestore to make Queries.
import { AngularFirestore } from '@angular/fire/firestore';
//Import Component for the update function and the Modal controller to handle the component.
import { ModalController } from '@ionic/angular';
import { Router } from "@angular/router";
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { UpdaterecordComponent } from '../components/updaterecord/updaterecord.component';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  doc: any;
  task: AngularFireUploadTask;
  records: { id: string; name: string; age: number; address: string; gender: string;location: string;}[];
  addrecord: { name: string; age: number; address: string; gender: string;location: string}; 
  constructor(
    private firestore: AngularFirestore,
    private modalController: ModalController,
    public router: Router,
    private storage: AngularFireStorage, 
    private database: AngularFirestore
  ) {}

  ngOnInit(){
    const user = JSON.parse(localStorage.getItem('user'));
    if(user == null){
      this.router.navigate(['login']);
    }
    this.addrecord = {name :'', age :0, address: '',gender :'',location :''}    
    this.firestore.collection('/Records/').snapshotChanges().subscribe(res=>{
      if(res){
        this.records = res.map(e=>{
          return{
            id: e.payload.doc.id,
            name: e.payload.doc.data()['name'],
            age: e.payload.doc.data()['age'],
            address: e.payload.doc.data()['address'],
            gender: e.payload.doc.data()['gender'],
            location: e.payload.doc.data()['location']
          }
        })   
      }  
    })
  }
  AddRecord(name, age, address,gender,location){
    let addrecord = {}
    addrecord['name'] = name
    addrecord['age'] = age
    addrecord['address'] = address
    addrecord['gender'] = gender
    addrecord['location'] = location
    this.firestore.collection('/Records/').add(addrecord).then(()=>{
      this.addrecord = {name :'', age :0, address: '',gender :'',location :''} 
    })
  }
  async UpdateRecord(id, name, age, address,gender,location) {
    const modal = await this.modalController.create({
      component:  UpdaterecordComponent,
      cssClass: 'my-custom-class',
      componentProps: {          
          'id': id,
          'name': name,
          'age': age,
          'address': address,
          'gender': gender,
          'location': location,
      }
    });
    return await modal.present();
  }
  DeleteRecord(id){
    this.firestore.doc('/Records/'+id).delete()
  }
  uploadFile(event: FileList) {
    const file = event.item(0)
    if (file.type.split('/')[0] !== 'image') {
      window.alert('Unsupported file');
      return;
    }


  }
}
