import { useState } from "react";
import { useApp } from "../context/AppContext";
import { Pencil, Trash2, Check, X } from "lucide-react";

function CommentList({ postId }) {
  const { comments, currentUser, createComment, users,updateComment, deleteComment } =
    useApp();

  const [commentText, setCommentText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedBody, setEditedBody] = useState("");

  const postComments = comments[postId] || [];

  function handleSubmit(e) {
    e.preventDefault();

    if (!commentText.trim()) return;

    createComment(postId, commentText);
    setCommentText("");
  }

  function handleEdit(comment) {
    setEditingCommentId(comment.id);
    setEditedBody(comment.body);
  }

  function handleUpdate(commentId) {
    if (!editedBody.trim()) return;

    updateComment(postId, commentId, editedBody);

    setEditingCommentId(null);
    setEditedBody("");
  }

  function handleCancel() {
    setEditingCommentId(null);
    setEditedBody("");
  }

  function handleDelete(commentId) {
    if (window.confirm("Delete this comment?")) {
      deleteComment(postId, commentId);
    }
  }

  function getAuthor(comment) {
  const user = users.find((u) => u.id === comment.userId);
  return user ? user.name : comment.email || "Unknown";
}

  return (
    <div className="comments-list mt-4 border-t pt-3">
      <div className="max-h-64 space-y-3 overflow-y-auto pr-1">
        {postComments.length === 0 ? (
          <p className="text-sm opacity-70">No comments yet.</p>
        ) : (
          postComments.map((comment) => {
            const isOwner = currentUser && comment.userId === currentUser.id;

            return (
              <div key={comment.id} className="comment-item rounded-lg border p-3">
                <p className="mb-1 text-xs opacity-70">
                 {getAuthor(comment)}
                 {currentUser && comment.userId === currentUser.id && " (you)"}
                </p>

                {editingCommentId === comment.id ? (
                  <div className="space-y-2">
                    <textarea
                      value={editedBody}
                      onChange={(e) => setEditedBody(e.target.value)}
                      className="w-full rounded-md border bg-transparent p-2"
                    />

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => handleUpdate(comment.id)}
                        aria-label="Save comment"
                      >
                        <Check size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={handleCancel}
                        aria-label="Cancel editing"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-3">
                    <p className="whitespace-pre-wrap break-words text-sm">
                      {comment.body}
                    </p>

                    {isOwner && (
                      <div className="flex shrink-0 gap-3">
                        <button
                          type="button"
                          onClick={() => handleEdit(comment)}
                          aria-label="Edit comment"
                        >
                          <Pencil size={14} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(comment.id)}
                          aria-label="Delete comment"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {currentUser ? (
        <form onSubmit={handleSubmit} className="mt-3 flex items-center gap-2">
          <input
            type="text"
            placeholder="Write a comment.."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="flex-1 rounded-md border bg-transparent px-3 py-2 text-sm"
          />

          <button type="submit">+</button>
        </form>
      ) : (
        <p className="mt-3 text-sm opacity-70">
          Please log in to add a comment.
        </p>
      )}
    </div>
  );
}

export default CommentList;