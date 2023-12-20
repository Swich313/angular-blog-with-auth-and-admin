import {Component, OnInit} from '@angular/core';
import {faArrowRightFromBracket, faArrowRightFromFile, faCheck} from "@fortawesome/free-solid-svg-icons";
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-social-media-page',
  templateUrl: './social-media-page.component.html',
  styleUrls: ['./social-media-page.component.scss']
})
export class SocialMediaPageComponent implements OnInit{
  form: FormGroup
  checkIcon = faCheck
  arrowIcon = faArrowRightFromBracket
  isSubmitted = false



  ngOnInit(): void {
    this.form = new FormGroup({
      facebook: new FormControl(null, ),
      instagram: new FormControl(null, ),
      twitter: new FormControl(null, ),
      youtube: new FormControl(null, ),
      github: new FormControl(null, ),
    })
  }

  submit() {

  }

  addAnotherSocial() {

  }
}
