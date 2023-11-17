import { Injectable } from '@angular/core';
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Observable} from "rxjs";
import {ModalComponent} from "../components/modal/modal.component";

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modals: any[] = []

  constructor(private dialog: MatDialog) { }

  showDialog(dynamicComponent$: Observable<any>, title: string): MatDialogRef<any>  {
    return this.dialog.open(ModalComponent, {data: {template: dynamicComponent$, title}})
  }
}
