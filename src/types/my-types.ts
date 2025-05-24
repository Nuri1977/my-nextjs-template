import { Program, Schedule, Stream, news } from "@prisma/client";

export type FileUploadThing = {
  name: string;
  size: number;
  key: string;
  lastModified: number;
  serverData: {
    uploadedBy: string;
  };
  url: string;
  appUrl: string;
  ufsUrl: string;
  customId: string | null;
  type: string;
  fileHash: string;
};

export type FileDeleteResponse = {
  success: boolean;
  deletedCount: number;
};

export interface ProgramExt extends Omit<Program, "coverImage"> {
  coverImage: FileUploadThing | null;
}

export interface NewsExt extends Omit<news, "coverImage"> {
  coverImage: FileUploadThing | null;
}

export interface ScheduleExt extends Schedule {
  program: ProgramExt;
}

export interface StreamExt extends Omit<Stream, "thumbnail"> {
  thumbnail: FileUploadThing | null;
  program?: ProgramExt | null;
}

// Form data type for creating/editing streams without required fields like id, createdAt, updatedAt
export type StreamFormData = Omit<StreamExt, "id" | "createdAt" | "updatedAt">;
