interface IUser {
  id: string;
  email: string;
  fullName: string | null;
  createdAt: Date;
}

interface IForum {
  id: string;
  title: string;
  description: string;
  tags: string | null;
  createdAt: Date;
  creatorId: string;
}

interface IComment {
  id: string;
  content: string;
  createdAt: Date;
  userId: string;
  forumId: string;
}

export interface IUserWithRelations extends IUser {
  forums?: IForum[];
  comments?: IComment[];
}

export interface IForumWithRelations extends IForum {
  creator: IUser;
  comments: ICommentWithRelations[];
}

export interface ICommentWithRelations extends IComment {
  user: IUser;
  forum: IForum;
}
