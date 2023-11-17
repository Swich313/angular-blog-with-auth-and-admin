import {Directive, ElementRef, Input, Renderer2, ViewContainerRef} from '@angular/core';

@Directive({
  selector: '[appShowClosePassword]'
})
export class ShowClosePasswordDirective {

  @Input()
  showPassword: boolean


  constructor(private renderer: Renderer2,
              private elRef: ElementRef) { }

  ngOnInit() {
    if(this.showPassword){
      console.log('     show mode',       this.elRef.nativeElement)
      this.renderer.setAttribute(this.elRef.nativeElement, 'type', 'text')

    } else if(!this.showPassword) {
      console.log('      hide mode',       this.elRef.nativeElement)

    }
  }
}
