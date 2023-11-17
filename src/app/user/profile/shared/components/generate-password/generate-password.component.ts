import {Component, ElementRef, Renderer2} from '@angular/core';
import {faCopy} from "@fortawesome/free-solid-svg-icons";
import {CommonModule} from "@angular/common";
import {SharedModule} from "../../../../../shared/shared.module";

@Component({
  standalone: true,
  selector: 'app-generate-password',
  templateUrl: './generate-password.component.html',
  styleUrls: ['./generate-password.component.scss'],
  imports: [CommonModule, SharedModule]
})
export class GeneratePasswordComponent {
  checkboxes = [
    {
      "id": "lowercase",
      "label": "Include lowercase",
      "library": "abcdefghijklmnopqrstuvwxyz",
      "checked": true
    }, {
      "id": "uppercase",
      "label": "Include uppercase",
      "library": "ABCDEFGHIJKLMNOPWRSTUVWXYZ",
      "checked": true
    }, {
      "id": "numbers",
      "label": "Include numbers",
      "library": "0123456789",
      "checked": true
    }, {
      "id": "symbols",
      "label": "Include symbols",
      "library": "!@#$%^&*-_=+|:;',.<>/?~\\",
      "checked": false
    }
  ]
  generatorOptions: {[key: string]: boolean} = {
    lowercase: this.checkboxes[0].checked,
    uppercase: this.checkboxes[1].checked,
    numbers: this.checkboxes[2].checked,
    symbols: this.checkboxes[3].checked,
  }
  dictionary: string[]

  passwordLength: number = 4;
  clipboardIcon = faCopy
  newPassword: string = 'asdasd'

  constructor(private elRef: ElementRef, private renderer: Renderer2) {
  }

  generatePassword() {
    this.dictionary = [].concat(
      this.generatorOptions['lowercase'] ? this.checkboxes[0].library.split('') : [],
      this.generatorOptions['uppercase'] ? this.checkboxes[1].library.split('') : [],
      this.generatorOptions['numbers'] ? this.checkboxes[2].library.split('') : [],
      this.generatorOptions['symbols'] ? this.checkboxes[3].library.split('') : [],

    )
    let newPassword = ''
    for(let i = 0; i < this.passwordLength; i++){
      newPassword += this.dictionary[Math.floor(Math.random() * this.dictionary.length)]
    }
    this.newPassword = newPassword
  }

  changePasswordLength(event: Event) {
    this.passwordLength = +(event.target as HTMLInputElement).value
  }

  changeCheckboxValue(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked
    const checkBoxId = (event.target as HTMLInputElement).id
    const amountOfChecked = Object.values(this.generatorOptions).filter(item => item).length

    if(!isChecked && amountOfChecked === 1){
      this.renderer.setProperty(this.elRef.nativeElement.querySelector(`#${checkBoxId}`), 'checked', 'true')
      return
    }

    this.generatorOptions[checkBoxId] = isChecked
  }
}
