import { Injectable } from '@angular/core';

@Injectable()
export class WindowService {

  get windowRef() {
    return window
  }

  get documentRef() {
    return document
  }
}
