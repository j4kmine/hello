import { Component, OnInit,Input  } from '@angular/core';
//Import AngularFirestore to make Queries.
import { AngularFirestore } from '@angular/fire/firestore';
import { ModalController } from '@ionic/angular';
@Component({
  selector: 'app-updaterecord',
  templateUrl: './updaterecord.component.html',
  styleUrls: ['./updaterecord.component.scss'],
})
export class UpdaterecordComponent implements OnInit {
  @Input() id: string;
  @Input() name: string;
  @Input() address: string;
  @Input() age: number; 
  @Input() gender: string;
  @Input() location: string;
  constructor(
    private firestore: AngularFirestore,
    private modalController: ModalController,
  ) { }

  ngOnInit() {
    
  }

  UpdateRecord(name, address, age, gender,location){
    let updaterecord = {}
    updaterecord['name'] = name,
    updaterecord['address'] = address,
    updaterecord['age'] = age,
    updaterecord['gender'] = gender,
    updaterecord['location'] = location,
    this.firestore.doc('/Records/'+this.id).update(updaterecord).then(()=>{
      this.modalController.dismiss()
    })
  }
  
  CloseModal(){
    this.modalController.dismiss()
  }
}
