export interface Post {
  id?: string;
  title: string;
  text: string;
  imageUrl: string;
  tag?: string;
  author: string;
  date: Date;
}
