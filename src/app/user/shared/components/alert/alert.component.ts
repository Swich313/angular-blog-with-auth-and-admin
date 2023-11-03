import {Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, RendererStyleFlags2} from '@angular/core';
import {Subscription} from "rxjs";
import {AlertService} from "../../services/alert.service";
import {faCheck, faClose, faExclamation} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit, OnDestroy{
  @Input()
  delay = 5000
  @Input()
  animation_duration = 500

  public text: string
  public type = 'success'
  checkIcon = faCheck
  exclamationIcon = faExclamation
  crossIcon = faClose


  alertSub: Subscription

  constructor(
    private alertService: AlertService,
    private renderer: Renderer2,
    private elementRef: ElementRef) {
  }

  ngOnInit(): void {
    this.renderer.setStyle(this.elementRef.nativeElement, '--duration', `${this.delay}`, RendererStyleFlags2.DashCase)
    this.renderer.setStyle(this.elementRef.nativeElement, '--animation-duration', `${this.animation_duration}`, RendererStyleFlags2.DashCase)
    this.alertSub = this.alertService.alert$.subscribe(alert => {
      // this.renderer.addClass(this.elementRef.nativeElement.querySelector('.alert-wrap'), 'active')
      this.text = alert.text
      this.type = alert.type
      const timer = setTimeout(() => {
        clearTimeout(timer)
        if(this.text){
          this.close()
        }
      }, this.delay)
    })
  }

  ngOnDestroy(): void {
    if(this.alertSub) {
      this.alertSub.unsubscribe()
    }
  }

  close() {
    this.renderer.removeClass(this.elementRef.nativeElement.querySelector('.alert-wrap'), 'active')
    const timer = setTimeout(() => {
      clearTimeout(timer)
      this.text = ''
    }, this.animation_duration)
  }

}
