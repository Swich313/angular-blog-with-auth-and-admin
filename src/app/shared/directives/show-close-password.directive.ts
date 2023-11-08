import {ComponentRef, Directive, ElementRef, Renderer2, ViewContainerRef} from '@angular/core';
import {faEye, faEyeSlash} from "@fortawesome/free-solid-svg-icons";

@Directive({
  selector: '[appShowClosePassword]'
})
export class ShowClosePasswordDirective {
  openedEyeIcon = faEye
  closedEyeIcon = faEyeSlash
  // private passwordInput: ElementRef


  constructor(private renderer: Renderer2,
              private elRef: ElementRef) { }

  ngOnInit() {
    const openEyeIcon = this.renderer.createElement('fa-icon')
    this.renderer.setAttribute(openEyeIcon, 'icon', faEye.toString())

    console.log({openEyeIcon})
    console.log('passwordInput', this.elRef.nativeElement)

    this.renderer.appendChild(this.elRef.nativeElement, openEyeIcon)

  }
}
