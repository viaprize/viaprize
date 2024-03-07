import { Divider } from '@mantine/core';
import CommentForm from './comment-form';
import CommentList from './comment-list';

const data = [
  {
    id: '1',
    message: 'This is a comment',
    user: 'John Doe',
    createdAt: '2021-09-01',
    likeCount: 0,
    likedByMe: false,
    dislikeCount: 0,
    dislikeByMe: false,
    children: [
      {
        id: '3',
        message: 'This is a reply',
        user: 'Jane Doe',
        createdAt: '2021-09-03',
        likeCount: 0,
        likedByMe: false,
        dislikeCount: 0,
        dislikeByMe: false,
        children: [
          {
            id: '5',
            message: 'This is a nested reply',
            user: 'John Doe',
            createdAt: '2021-09-05',
            likeCount: 0,
            likedByMe: false,
            dislikeCount: 0,
            dislikeByMe: false,
          },
        ],
      },
    ],
  },
  {
    id: '2',
    message: 'This is another comment',
    user: 'Jane Doe',
    createdAt: '2021-09-02',
    likeCount: 0,
    likedByMe: false,
    dislikeCount: 0,
    dislikeByMe: false,
  },
];

export default function CommentSection() {
  return (
    <>
      <h2>Comments ({data.length})</h2>
      <Divider my="md" />
      <section>
        <CommentForm />
        {data != null && data.length > 0 && (
          <div className="mt-4">
            <CommentList comments={data} />
          </div>
        )}
      </section>
    </>
  );
}
