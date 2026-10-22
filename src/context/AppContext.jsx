
import { createContext, useContext, useEffect, useState,useCallback } from "react";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  //users
const [users, setUsers] = useState(() => {
  try {
    const savedUsers = localStorage.getItem("users");
    return savedUsers ? JSON.parse(savedUsers) : [];
  } catch {
    return [];
  }
});
useEffect(() => {
  localStorage.setItem("users", JSON.stringify(users));
}, [users]);

//posts
  const [posts, setPosts] = useState(() => {
  try {
    const savedPosts = localStorage.getItem("posts");
    return savedPosts ? JSON.parse(savedPosts) : [];
  } catch {
    return [];
  }
});
useEffect(() => {
  localStorage.setItem("posts", JSON.stringify(posts));
}, [posts]);

//currentuser
const [currentUser, setCurrentUser] = useState(() => {
  try {
    const savedUserId = localStorage.getItem("currentUserId");

    if (!savedUserId) return null;

    const savedUsers = JSON.parse(
      localStorage.getItem("users") || "[]"
    );

    return savedUsers.find(
      (user) => String(user.id) === savedUserId
    ) || null;
  } catch {
    return null;
  }
});
//comments
const [comments, setComments] = useState(() => {
  try {
    const savedComments = localStorage.getItem("comments");
    return savedComments ? JSON.parse(savedComments) : {};
  } catch {
    return {};
  }
});
useEffect(() => {
  localStorage.setItem("comments", JSON.stringify(comments));
}, [comments]);

//posts loading and errors
  const[loadingPosts,setLoadingPosts]= useState(true)
  const [postsError,setPostsError]= useState("")


  
//sign up rules 
  function signup({ name, email, password, username}) {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedUsername = username.trim().toLowerCase();

    if (!name.trim() || !normalizedUsername || !normalizedEmail || !password) {
    return {
      success: false,
      message: "All fields are required.",
    };
  }
    const emailExists = users.some(
      (user) => user.email === normalizedEmail
    );

   const usernameExists = users.some(
  (user) => user.username.trim().toLowerCase() === normalizedUsername
    );

    if (emailExists) {
      return {
        success: false,
        message: "An account with this email already exists.",
      };
    } 

    if (usernameExists) {
  return { success: false, message: "Username already taken." };
}

const nextId = Math.max(10, ...users.map((user) => Number(user.id) || 0)) + 1;

    const newUser = {
      id: nextId,
      name: name.trim(),
      username:normalizedUsername,
      email: normalizedEmail,
      password,
    };

    setUsers((previousUsers) => [...previousUsers, newUser]);

    return {
      success: true,
      message: "Account created successfully!",
    };
  }

//login rules
  function login({ email, password }) {
  const normalizedEmail = email.trim().toLowerCase();
  console.log("Users count:", users.length);
console.log(
  "Registered emails:",
  users.map((user) => user.email)
);
console.log("Attempted email:", normalizedEmail);

  const user = users.find(
    (user) =>
      user.email === normalizedEmail &&
      user.password === password
  );

  if (!user) {
    return {
      success: false,
      message: "Invalid email or password.",
    };
  }

  setCurrentUser(user);
  localStorage.setItem("currentUserId", user.id);  //current user id persists

  return { success: true, message: "Login successful!" };
}

//shared fetched posts 

const fetchPosts = useCallback(async () => {
  setLoadingPosts(true);
  setPostsError("");

  try {
    const response = await fetch(
      "https://jsonplaceholder.typicode.com/posts"
    );

    if (!response.ok) {
      throw new Error("Failed to fetch posts.");
    }

    const data = await response.json();
    console.log("Fetched posts:", data);
    console.log("Number of posts:", data.length);

setPosts((previousPosts) => {
  const userCreatedPosts = previousPosts.filter((post) => Number(post.userId) > 10);

  return [...userCreatedPosts, ...data];
});

  } catch (error) {
    setPostsError(error.message);
  } finally {
    setLoadingPosts(false);
  }
}, []);


function createPost(title, body) {
  if (!currentUser){
    console.log('Cannot create post: no logged-in user')
    return;
} 
const newId= Math.max(
  100,...posts.map((post) => Number(post.id) || 0)
) + 1

  const newPost = {
    id:newId,
   userId: currentUser.id,
    title: title.trim(),
    body: body.trim(),
  };

  setPosts((previousPosts) => [newPost, ...previousPosts]);
}

function updatePost(postId, title, body) {
  if (!currentUser) return;

  setPosts((previousPosts) =>
    previousPosts.map((post) =>
      post.id === postId && post.userId === currentUser.id
        ? { ...post, title: title.trim(), body: body.trim() }
        : post
    )
  );
}

function deletePost(postId) {
  if (!currentUser) return;

  const post = posts.find((p) => p.id === postId);
  if (!post || post.userId !== currentUser.id) return; // only the owner can delete

  setPosts((prev) => prev.filter((p) => p.id !== postId));

  setComments((prev) => {
    const next = { ...prev };
    delete next[postId];
    return next;
  });
}
//comments

const fetchComments = useCallback(async (postId) => {
  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts/${postId}/comments`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch comments.");
    }

    const data = await response.json();

    setComments((previousComments) => ({
      ...previousComments,
      [postId]: [
        ...(previousComments[postId] || []),
        ...data.filter(
          (apiComment) =>
            !(previousComments[postId] || []).some(
              (existingComment) => existingComment.id === apiComment.id
            )
        ),
      ],
    }));
  } catch (error) {
    console.error("Failed to fetch comments:", error.message);
  }
}, []);

function createComment(postId, body) {
  if (!currentUser) return;

  setComments((previousComments) => {
    // 1. collect every existing comment id into one list
    const allIds = Object.values(previousComments)
      .flat()
      .map((comment) => Number(comment.id) || 0);

    // 2. next id = highest id + 1 (never below 501)
    const newId = Math.max(500, ...allIds) + 1;

    const newComment = {
      id: newId,
      postId,
      userId: currentUser.id,
      author: currentUser.name,
      body: body.trim(),
    };

    return {
      ...previousComments,
      [postId]: [...(previousComments[postId] || []), newComment],
    };
  });
}

function updateComment(postId, commentId, body) {
  if (!currentUser) return;

  setComments((previousComments) => ({
    ...previousComments,
    [postId]: (previousComments[postId] || []).map((comment) =>
      comment.id === commentId && comment.userId === currentUser.id
        ? { ...comment, body: body.trim() }
        : comment
    ),
  }));
}
function deleteComment(postId, commentId) {
  if (!currentUser) return;

  setComments((previousComments) => ({
    ...previousComments,
    [postId]: (previousComments[postId] || []).filter(
      (comment) =>
        !(
          comment.id === commentId &&
          comment.userId === currentUser.id
        )
    ),
  }));
}
//logout
function logout() {
  setCurrentUser(null);
  localStorage.removeItem("currentUserId");
}

 const value = {
    users,
    currentUser,
    setCurrentUser,
    signup, 
    login, 

    posts,
    loadingPosts,
    postsError,
    setPosts,
    fetchPosts,
    createPost,
    updatePost,
    deletePost,

    comments,
    fetchComments,
    deleteComment,
    createComment,
    updateComment,

    logout
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }

  return context;
}
