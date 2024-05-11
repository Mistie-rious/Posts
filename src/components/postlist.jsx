import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addPost, fetchPosts, fetchTags } from "../api/api";
import { useState } from "react";
const Postlist = () => {

    const [page, setPage] = useState(1);
  const {
    data: postData,
    isError,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["posts", {page}],
    queryFn: () => fetchPosts(page),
    staleTime: 1000 * 60 * 5,

  });

  const { data: tagsData } = useQuery({
    queryKey: ["tags"],
    queryFn: fetchTags,
  });

  const queryClient = useQueryClient();

  const {
    mutate,
    isPending,
    error: postError,
    isError: isPostError,
    reset,
  } = useMutation({
    mutationFn: addPost,
    onMutate: () => {
        return {id:1}
    },
    onSuccess: (data,variables,context) => {
        queryClient.invalidateQueries({
            queryKey: ['posts'],
            exact: true,
            // predicate: (query) => {
            //     return query.queryKey[0] === 'posts'
            // }
        })
 
    },
//     onError: (error, variables, context) => {
  
//   }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const title = formData.get("title");
    const tags = Array.from(formData.keys()).filter(
      (key) => formData.get(key) === "on"
    );
    if (!title || !tags)return 
    
    mutate({ id: postData?.data?.length + 1, title, tags });
    e.target.reset();
  };
  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your post..."
          className="postbox"
          name="title"
        />
        <div className="tags">
          {tagsData?.map((tag) => {
            return (
              <div key={tag}>
                <input type="checkbox" name={tag} id={tag} />
                <label htmlFor={tag}>{tag}</label>
              </div>
            );
          })}
        </div>
        <button>Post</button>
      </form>

      {isLoading && isPending && <h1>Loading...</h1>}
      {isError && <h1>{error?.message}</h1>}
      {isPostError && <h1 onClick={() => reset} >Unable to post</h1>}

          <div className="pages" >
            <button
            onClick={() => setPage((prev) => prev - 1)}
            disabled={page === 1}
            >Previous Page</button>
            <span>Current Page: {page}</span>
            <button
            onClick={() => setPage((prev) => prev + 1)}
           disabled={postData?.length < 5}
           >Next Page</button>
          </div>


      {postData?.map((post) => {
        return (
          <div key={post.id} className="post">
            <h1>{post.title}</h1>
            {post.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default Postlist;
