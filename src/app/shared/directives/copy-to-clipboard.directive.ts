import {Directive, ElementRef, Input, NgZone, Renderer2} from '@angular/core';
import {fromEvent, Subscription, switchMap, throttleTime} from "rxjs";
import {HotToastService} from "@ngneat/hot-toast";

@Directive({
  selector: '[copy]'
})
export class CopyToClipboardDirective {
  private eventSub: Subscription
  private duration = 2000

  @Input()
  copy: string

  constructor(
    private host: ElementRef<HTMLElement>,
    private renderer: Renderer2,
    private zone: NgZone
  ) { }

  ngOnInit() {

    this.zone.runOutsideAngular(() => {
      this.eventSub = fromEvent(this.host.nativeElement, 'click')
        .pipe(

          switchMap(() => navigator.clipboard.writeText(this.copy)),
          throttleTime(this.duration * 2)
          )
        .subscribe(() => {
          const smallTag = this.renderer.createElement('small')
          const text = this.renderer.createText('Copied!');
          this.renderer.setStyle(smallTag, 'font-size', '0.75rem')
          this.renderer.setStyle(smallTag, 'color', 'green')
          this.renderer.setStyle(smallTag, 'padding', '0.5rem')
          this.renderer.setStyle(smallTag, 'user-select', 'none')
          this.renderer.setStyle(smallTag, '-webkit-user-select', 'none')
          this.renderer.setStyle(smallTag, '-ms-user-select', 'none')
          this.renderer.appendChild(smallTag, text);
          this.renderer.appendChild(this.host.nativeElement, smallTag)

          const timer = setTimeout(() => {
            this.renderer.removeChild(this.host.nativeElement, smallTag)
            clearInterval(timer)
            console.log('remove', this.host.nativeElement)
          }, this.duration)
        })
    })
  }

  ngOnDestroy(){
    this.eventSub.unsubscribe()
  }
}
