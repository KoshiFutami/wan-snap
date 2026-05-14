import { PostItemId } from '../value-objects/post-item-id.vo';
import { PostId } from '../value-objects/post-id.vo';

export interface PostItemProps {
  id: PostItemId;
  postId: PostId;
  category: string;
  brand: string | null;
  productName: string | null;
  size: string | null;
  purchaseUrl: string | null;
  priceJpy: number | null;
  fitNote: string | null;
}

export class PostItem {
  readonly id: PostItemId;
  readonly postId: PostId;
  readonly category: string;
  readonly brand: string | null;
  readonly productName: string | null;
  readonly size: string | null;
  readonly purchaseUrl: string | null;
  readonly priceJpy: number | null;
  readonly fitNote: string | null;

  private constructor(props: PostItemProps) {
    this.id = props.id;
    this.postId = props.postId;
    this.category = props.category;
    this.brand = props.brand;
    this.productName = props.productName;
    this.size = props.size;
    this.purchaseUrl = props.purchaseUrl;
    this.priceJpy = props.priceJpy;
    this.fitNote = props.fitNote;
  }

  static create(props: Omit<PostItemProps, 'id'>): PostItem {
    return new PostItem({ ...props, id: PostItemId.generate() });
  }

  static reconstruct(props: PostItemProps): PostItem {
    return new PostItem(props);
  }
}
