import { Component } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FotoserviceService } from '../fotoservice.service'; 


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  public urlImageStorage : Photo[] = [];
  public nama:string;

  constructor(public fotoService:FotoserviceService, public firestorage: AngularFireStorage) {}

  async ionViewDidEnter(){
    // await this.fotoService.loadFoto();
    this.loadfoto();

  }


  public async loadfoto() {

    this.urlImageStorage=[];
    var refImage = this.firestorage.storage.ref('imgStorage'); 
    alert("ref "+refImage);
    refImage.listAll()
    .then((res)=>{
      res.items.forEach((itemRef)=>{
        alert("item "+itemRef);
        itemRef.getDownloadURL().then(url=>{
          var arrnama = itemRef.fullPath.split("/");
          this.nama=url;
          var nodebaru = {
            filePath: url,          
            webviewPath : "",
            dataImage : null
          }    
          this.urlImageStorage.unshift(nodebaru);
          // daf.unshift(url);
        })

      });

  });
}

}

export interface Photo{
  filePath:string; //filename
  webviewPath:string; //tmpt folder alamat menyimpan
  dataImage : File
}


