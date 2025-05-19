import type { IForumWithRelations } from "@/interfaces";
import { AuthenticatedAxios } from "./config";
import type { CommentSchema, IForumSchema } from "@/schema";

export const ForumAPI = {
  getAllForums: async (token: string): Promise<IForumWithRelations[]> => {
    const axios = AuthenticatedAxios(token);
    const response = (await axios.get("/forums")).data as IForumWithRelations[];
    return response;
  },

  createForum: async (token: string, forumData: IForumSchema) => {
    const axios = AuthenticatedAxios(token);
    const response = await axios.post("/forums", {
      ...forumData,
      description: forumData.content,
    });
    return response;
  },

  updateForum: async (
    token: string,
    forumId: string,
    forumData: IForumSchema
  ) => {
    const axios = AuthenticatedAxios(token);
    const response = await axios.put(`/forums/${forumId}`, {
      ...forumData,
      description: forumData.content,
    });
    return response;
  },

  getForumById: async (
    token: string,
    id: string
  ): Promise<IForumWithRelations> => {
    const axios = AuthenticatedAxios(token);
    const response = await axios.get(`/forums/${id}`);
    return response.data;
  },

  createComment: async (
    token: string,
    forumId: string,
    payload: CommentSchema
  ) => {
    const axios = AuthenticatedAxios(token);
    const response = await axios.post(`/forums/${forumId}/comment`, payload);
    return response.data;
  },

  deleteComment: async (token: string, commentId: string) => {
    const axios = AuthenticatedAxios(token);
    const response = await axios.delete(`/forums/comment/${commentId}`);
    return response.data;
  },

  editComment: async (token: string, commentId: string, content: string) => {
    const axios = AuthenticatedAxios(token);
    const response = await axios.put(`/forums/comment/${commentId}`, {
      content,
    });
    return response.data;
  },

  deleteForum: async (token: string, forumId: string) => {
    const axios = AuthenticatedAxios(token);
    const response = await axios.delete(`/forums/${forumId}`);
    return response.data;
  },
};
