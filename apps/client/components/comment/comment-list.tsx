/* eslint-disable import/no-cycle */
import Comment from './comment';

interface CommentListProps {
  comments: {
    id: string;
    message: string;
    user: string;
    createdAt: string;
    likeCount: number;
    likedByMe: boolean;
    dislikeCount: number;
    dislikeByMe: boolean;
    children?: {
      id: string;
      message: string;
      user: string;
      createdAt: string;
      likeCount: number;
      likedByMe: boolean;
      dislikeCount: number;
      dislikeByMe: boolean;
      children?: any[];
    }[];
  }[];
}

export default function CommentList({ comments }: CommentListProps) {
  return (
    <>
      {comments.map((comment) => (
        <div key={comment.id} className="my-2 mx-0">
          <Comment comment={comment} />
        </div>
      ))}
    </>
  );
}
