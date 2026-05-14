import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const appApi = createApi({
  reducerPath: "appApi",
  baseQuery: fetchBaseQuery({
    // baseUrl: "http://localhost:8080",
    baseUrl:"https://blog-app-ruby-sigma.vercel.app/",
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
      query: () => ({
        url: "/posts",
      }),
      providesTags: ["Post"],
    }),
    getOnePost: builder.query({
      query: (id) => ({
        url: `/posts/${id}`,
      }),
    }),
    getAllUserPost: builder.query({
      query: (id) => ({
        url: `/posts/me`,
      }),
      providesTags: ["Post"],
    }),
    deletePost: builder.mutation({
      query: (id) => ({
        url: `/posts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Post"],
    }),
    updatePost: builder.mutation({
      query: ({id,...post}) => ({
        url: `/posts/${id}`,
        method: "PATCH",
        body:post
      }),
      invalidatesTags: ["Post"],
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
