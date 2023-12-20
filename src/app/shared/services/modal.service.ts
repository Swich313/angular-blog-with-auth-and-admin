import { Injectable } from '@angular/core';
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {map, Observable, switchMap} from "rxjs";
import {ModalComponent} from "../components/modal/modal.component";
import {QrCodeComponent} from "../components/qr-code/qr-code.component";

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modals: any[] = []

  constructor(private dialog: MatDialog) { }

  showDialog(dynamicComponent$: Observable<any>, title: string): MatDialogRef<any>  {
    dynamicComponent$.subscribe(x => console.log(x))
    return this.dialog.open(ModalComponent, {data: {template: dynamicComponent$, title}})
  }
}
