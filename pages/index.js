import PostFeed from "../components/posts/PostFeed"
import Header from "../components/Header"
import Form from "../components/Form"
import useCurrentUser from "../hooks/useCurrentUser";
export default function Home() {
  const {data} = useCurrentUser();
  return (
    <>
      <Header label="Home" />
      <Form placeholder="What's happening?" />
      <PostFeed />
    </>
  )
}
