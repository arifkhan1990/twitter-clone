import usePosts from '../../hooks/usePosts';

import PostItem from './PostItem';

const PostFeed = ({ userId }) => {
  const { data: posts } = usePosts(userId);
  console.log(posts);
  return (
    <>
      {posts?.map((post) => (
        <PostItem userId={userId} key={post.id} data={post} />
      ))}
    </>
  );
};

export default PostFeed;
