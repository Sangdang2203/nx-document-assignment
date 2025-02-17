export interface Folder {
  id: string;
  name: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Document {
  id: string;
  folderId: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  status: string;
}
