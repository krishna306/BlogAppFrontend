import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const appApi = createApi({
  reducerPath: "appApi",
  baseQuery: fetchBaseQuery({
    // baseUrl: "http://localhost:8080",
    baseUrl: "https://blog-app-ruby-sigma.vercel.app/",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().user.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Post", "User"],
  endpoints: (builder) => ({
    loginUser: builder.mutation({
      query: (user) => ({
        url: "/users/login",
        method: "POST",
        body: user,
      }),
    }),
    signupUser: builder.mutation({
      query: (user) => ({
        url: "/users",
        method: "POST",
        body: user,
      }),
    }),
    logoutUser: builder.mutation({
      query: () => ({
        url: "/users/logout",
        method: "DELETE",
      }),
    }),
    // post routes
    createPost: builder.mutation({
      query: (details) => ({
        url: "/posts",
        method: "POST",
        body: details,
      }),
      invalidatesTags: ["Post"],
    }),

    getAllPost: builder.query({
      query: ({ page = 1, limit = 9, category = "all" } = {}) => ({
        url: "/posts",
        params: { page, limit, category },
      }),
      providesTags: ["Post"],
    }),
    getOnePost: builder.query({
      query: (id) => ({
        url: `/posts/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: "Post", id }],
    }),
    getAllUserPost: builder.query({
      query: ({ page = 1, limit = 9 } = {}) => ({
        url: "/posts/me",
        params: { page, limit },
      }),
      providesTags: ["Post"],
    }),
    deletePost: builder.mutation({
      query: (id) => ({
        url: `/posts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => ["Post", { type: "Post", id }],
    }),
    updatePost: builder.mutation({
      query: ({ id, ...post }) => ({
        url: `/posts/${id}`,
        method: "PATCH",
        body: post,
      }),
      invalidatesTags: (result, error, { id }) => [
        "Post",
        { type: "Post", id },
      ],
    }),

  }),
});

export default appApi;
export const {
  useLoginUserMutation,
  useSignupUserMutation,
  useLogoutUserMutation,
  useCreatePostMutation,
  useGetAllPostQuery,
  useGetOnePostQuery,
  useGetAllUserPostQuery,
  useDeletePostMutation,
  useUpdatePostMutation
} = appApi;
