import { PostId } from '../value-objects/post-id.vo';

export interface PostGroomingProps {
  postId: PostId;
  salonName: string;
  salonUrl: string | null;
  salonInstagram: string | null;
  cutStyle: string | null;
  note: string | null;
}

// TODO(phase-c): salonId: SalonId | null を追加し GroomingSalon マスタへの参照を持たせる
//  - GroomingSalon モデルを別集約として設計する（salonName, instagramHandle, address?）
//  - salonId が null の場合は salonName フリーテキストにフォールバック
//  - 既存データは salonName をキーにして正規化マイグレーションを実施する
export class PostGrooming {
  readonly postId: PostId;
  readonly salonName: string;
  readonly salonUrl: string | null;
  readonly salonInstagram: string | null;
  readonly cutStyle: string | null;
  readonly note: string | null;

  private constructor(props: PostGroomingProps) {
    this.postId = props.postId;
    this.salonName = props.salonName;
    this.salonUrl = props.salonUrl;
    this.salonInstagram = props.salonInstagram;
    this.cutStyle = props.cutStyle;
    this.note = props.note;
  }

  static create(props: PostGroomingProps): PostGrooming {
    return new PostGrooming(props);
  }

  static reconstruct(props: PostGroomingProps): PostGrooming {
    return new PostGrooming(props);
  }
}
