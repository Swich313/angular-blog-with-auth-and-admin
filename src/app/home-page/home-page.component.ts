import {Component, HostListener, OnInit} from '@angular/core';
import {Post} from "../shared/interfaces";
import {WindowService} from "../shared/services/window.service";

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit{
  posts: Post[] = [
      {
        id: 'oijea34',
        title: 'There have been big Tesla accident at New Jersey',
        text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
        tag: 'news',
        author: 'Sardorbek Usmonov',
        date: new Date('6/11/2018'),
        imageUrl: 'https://source.unsplash.com/Qm_n6aoYzDs'
      },
      {
        id: 'oi12ea34',
        title: 'Samsung laptops is exploding again',
        text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
        tag: 'tech',
        author: 'Tyler Platt',
        date: new Date('6/07/2018'),
        imageUrl: 'https://source.unsplash.com/C-v1p2DTakA'
      },
      {
        id: 'onhgng34',
        title: 'Apple is having big Sale for the first time',
        text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
        tag: 'deals',
        author: 'Timur Mirzoyev',
        date: new Date('5/27/2018'),
        imageUrl: 'https://source.unsplash.com/V0L1LH7qWOQ'
      },
      {
        id: '1eqweea34',
        title: 'Net-Nutrality is coming to its end',
        text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
        tag: 'politics',
        author: 'Gregoy Trem',
        date: new Date('5/20/2018'),
        imageUrl: 'https://source.unsplash.com/zAi2Is48-MA'
      },
      {
        id: 'oijea34',
        title: 'There have been big Tesla accident at New Jersey',
        text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
        tag: 'news',
        author: 'Sardorbek Usmonov',
        date: new Date('6/11/2018'),
        imageUrl: 'https://source.unsplash.com/Qm_n6aoYzDs'
      },
      {
        id: 'oi12ea34',
        title: 'Samsung laptops is exploding again',
        text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
        tag: 'tech',
        author: 'Tyler Platt',
        date: new Date('6/07/2018'),
        imageUrl: 'https://source.unsplash.com/C-v1p2DTakA'
      },
  ]
  innerWidth: number
  amountOfSkeletons: number

  constructor(private windowService: WindowService) {
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = event.target.innerWidth
    this.calculateSkeletons(this.innerWidth)
  }

  ngOnInit(): void {
    this.innerWidth = this.windowService.windowRef.innerWidth
    this.calculateSkeletons(this.innerWidth)
  }

  calculateSkeletons(width: number): void {
    if(this.innerWidth < 569){
      this.amountOfSkeletons = 2
    } else if (this.innerWidth < 784){
      this.amountOfSkeletons = 4
    } else if (this.innerWidth < 1056){
      this.amountOfSkeletons = 6
    } else {
      this.amountOfSkeletons = 8
    }
  }
}
