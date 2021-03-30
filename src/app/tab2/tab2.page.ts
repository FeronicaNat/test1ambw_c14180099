import { Component } from '@angular/core';
import { FotoserviceService } from '../fotoservice.service'; 

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  constructor(public fotoService:FotoserviceService ) {

  }
  ngOnInit(){
    this.fotoService.loadFoto();
  }

  tambahFoto() {
    this.fotoService.tambahFoto();
  }

  klikCheckbox(idx) {
    // alert(idx); 
    this.fotoService.klikCheckbox(idx); 
  }

  uploadFoto(){
    this.fotoService.uploadFoto();
  }



}
