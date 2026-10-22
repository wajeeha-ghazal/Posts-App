
import { useApp } from "../context/AppContext";
import { useEffect, useState } from "react";
import { MessageCircle, Pencil, Trash2 } from "lucide-react";
import CommentList from "../components/CommentList";

function Posts() {
  const {
    posts,
    loadingPosts,
    postsError,
    fetchPosts,
    currentUser,
    createPost,
    updatePost,
    deletePost,
    fetchComments,
  } = useApp();

  const [showForm, setShowForm] = useState(false);
  const [editingPostId, setEditingPostId] = useState(null);
  const [activeCommentsPostId, setActiveCommentsPostId] = useState(null);
  const [form, setForm] = useState({ title: "", body: "" });

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  function handleSubmit(e) {
    e.preventDefault();

    if (!form.title.trim() || !form.body.trim()) return;

    if (editingPostId !== null) {
      updatePost(editingPostId, form.title, form.body);
    } else {
      createPost(form.title, form.body);
    }

    setForm({ title: "", body: "" });
    setEditingPostId(null);
    setShowForm(false);
  }

  if (loadingPosts && posts.length === 0) return <p>Loading posts...</p>;

  if (postsError && posts.length === 0) {
    return <p role="alert">Failed to fetch posts.</p>;
  }

  return (
    <main className="posts-page">
      <h1 className="posts-heading">Posts</h1>

      {postsError && <p role="alert">Could not refresh posts: {postsError}</p>}

      <div className="posts-toolbar">
        <button
          type="button"
          className="create-post-btn"
          onClick={() => {
            setForm({ title: "", body: "" });
            setEditingPostId(null);
            setShowForm(true);
          }}
        >
          + Create Post
        </button>
      </div>

      {showForm && (
        <form className="post-form" onSubmit={handleSubmit}>
          <input
            placeholder="Post title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />

          <textarea
            placeholder="Write your post..."
            value={form.body}
            onChange={(e) => setForm({ ...form, body: e.target.value })}
            required
          />

          <button type="submit">
            {editingPostId !== null ? "Save Changes" : "Publish Post"}
          </button>

          <button
            type="button"
            onClick={() => {
              setShowForm(false);
              setEditingPostId(null);
              setForm({ title: "", body: "" });
            }}
          >
            Cancel
          </button>
        </form>
      )}

      {posts.length === 0 ? (
        <p className="empty-posts">No posts to show yet.</p>
      ) : (
        <div className="posts-container">
          {posts.map((post) => (
            <article className="post-card" key={post.id}>
  <h2 className="post-title">{post.title}</h2>
  <p className="post-body">{post.body}</p>

  <div className="post-footer">
    <button
      type="button"
      className="icon-btn"
      aria-label="Toggle comments"
      onClick={() => {
        const opening = activeCommentsPostId !== post.id;
        setActiveCommentsPostId(opening ? post.id : null);
        if (opening) fetchComments(post.id);
      }}
    >
      <MessageCircle size={18} />
    </button>

    {currentUser && post.userId === currentUser.id && (
      <div className="post-actions">
        <button
          type="button"
          className="icon-btn"
          aria-label="Edit post"
          onClick={() => {
            setForm({ title: post.title, body: post.body });
            setEditingPostId(post.id);
            setShowForm(true);
          }}
        >
          <Pencil size={18} />
        </button>

        <button
          type="button"
          className="icon-btn"
          aria-label="Delete post"
          onClick={() => {
            if (window.confirm("Delete this post?")) {
              deletePost(post.id);
            }
          }}
        >
          <Trash2 size={18} />
        </button>
      </div>
    )}
  </div>

  {activeCommentsPostId === post.id && <CommentList postId={post.id} />}
</article>
          ))}
        </div>
      )}
    </main>
  );
}

export default Posts;
