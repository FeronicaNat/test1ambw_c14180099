import { Injectable } from '@angular/core';
import { CameraPhoto, CameraResultType, CameraSource, Capacitor, FilesystemDirectory, Plugins } from '@capacitor/core';
import { Platform } from '@ionic/angular';
import { AngularFireStorage } from '@angular/fire/storage';


const { Camera, Filesystem, Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class FotoserviceService {

  public dataFoto: Photo[] = [];
  public dataUpload: number[] = []; 
  public urlImageStorage : string[] = [];
  

  public platform : Platform 
  public keyFoto : string = "foto";

  constructor(platform : Platform, public firestorage: AngularFireStorage) 
  {
    this.platform=platform;
  }


  public async tambahFoto(){
    const Foto = await Camera.getPhoto({
      resultType:CameraResultType.Uri,
      source:CameraSource.Camera,
      quality:100
    });
    console.log("ini foto "+Foto);

    const fileFoto=await this.simpanFoto(Foto);
    this.dataFoto.unshift(fileFoto);
    // {
    //   filePath:"Load",
    //   webviewPath:Foto.webPath,
    //   dataImage:
    // } --> ini isi dalem e unshift
    Storage.set({
      key: this.keyFoto,
      value:JSON.stringify(this.dataFoto)
    });
  }

  public async simpanFoto(foto:CameraPhoto){
    const base64Data = await this.readAsBase64(foto);
    const namaFile =new Date().getTime()+'.jpeg';

    const simpanFile=await Filesystem.writeFile({
      path:namaFile,
      data:base64Data,
      directory:FilesystemDirectory.Data
    });

    const response = await fetch(foto.webPath);
    const blob = await response.blob();
    const dataFoto = new File ([blob],foto.path,{
      type:"image/jpeg" //ini file yg ga diconvert ke base 64 tpi bntuk file
    })

    if(this.platform.is('hybrid')){
      return{
        filePath:simpanFile.uri,
        webviewPath:Capacitor.convertFileSrc(simpanFile.uri),
        dataImage:dataFoto
      }

    }
    else{
    return{
      filePath:namaFile,
      webviewPath:foto.webPath,
      dataImage:dataFoto
    }
    }
  }

  private async readAsBase64(foto:CameraPhoto){
    if(this.platform.is('hybrid')){
      const file=await Filesystem.readFile({
        path:foto.path
      });
      return file.data;

    }
    else{
    const response = await fetch(foto.webPath);
    const blob = await response.blob();

    return await this.convertBlobToBase64(blob) as string;
    }
  }

  convertBlobToBase64=(blob:Blob) => new Promise((resolve,reject)=>{
    const reader = new FileReader;
    reader.onerror=reject;
    reader.onload=() => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });

  public async loadFoto(){

    const listFoto=await Storage.get({key:this.keyFoto});
    this.dataFoto=JSON.parse(listFoto.value)||[];

    if(!this.platform.is('hybrid')){
    for (let foto of this.dataFoto){
      alert("filepath "+foto.filePath);
      const readFile= await Filesystem.readFile({
        path:foto.filePath,
        directory:FilesystemDirectory.Data
      });
      foto.webviewPath=`data:image/jpeg;base64,${readFile.data}`;

      const response = await fetch(foto.webviewPath);
      const blob = await response.blob();
      foto.dataImage = new File([blob], foto.filePath,{
        type:"image/jpeg"
      })

      }
    }
    console.log(this.dataFoto);
    alert(this.dataFoto);
  }


  public async klikCheckbox(idx){
    alert("KLIK CHECKBOX");
    var sdhklik = 0; 
    for(var i = 0; i < this.dataUpload.length && sdhklik == 0; i++) {
      if(this.dataUpload[i] == idx) { 
        sdhklik = 1; 
        this.dataUpload.splice(i,1); 
      }
    }
    if(sdhklik == 0) {
      this.dataUpload.push(idx); 
    }

  }


  public async uploadFoto() {

    const listFoto = await Storage.get({key : this.keyFoto});
    this.dataFoto  = JSON.parse(listFoto.value) || [];

    for(var i = 0; i < this.dataFoto.length; i++) {
      for(var j=0; j<this.dataUpload.length;j++){
        alert("UPLOAD FOTO idx ke "+this.dataUpload[j]);
        if(i==this.dataUpload[j]){


          if(!this.platform.is('hybrid')){
            for (let foto of this.dataFoto){
              const readFile= await Filesystem.readFile({
                path:foto.filePath,
                directory:FilesystemDirectory.Data
              });
              foto.webviewPath=`data:image/jpeg;base64,${readFile.data}`;
        
              const response = await fetch(foto.webviewPath);
              const blob = await response.blob();
              foto.dataImage = new File([blob], foto.filePath,{
                type:"image/jpeg"
              })
              }
            }
           
          
          const randomId   = Math.random().toString(36).substring(2, 8);
          // const namaFile   = `files/${new Date().getTime()}_${randomId}.jpeg`;

            const imgFilepath =`imgStorage/${this.dataFoto[j].filePath}_${randomId}.jpeg` 
            
            this.firestorage.upload(imgFilepath,this.dataFoto[j].dataImage).then(() => { 
              this.firestorage.storage.ref().child(imgFilepath).getDownloadURL().then((url)=> { 
                this.urlImageStorage.unshift(url);
                console.log(url);
              });
            });

        }

        
      }
    }

  }


}

export interface Photo{
  filePath:string; 
  webviewPath:string; 
  dataImage : File
}





