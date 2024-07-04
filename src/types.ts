import { UserType } from "./contentModule/contentEnum/contentEnum";

export type authObject = {
  id: string;
  email: string;
  isAdmin: boolean;
  name: string;
  userType: UserType
};

export type JwtPayload = {
  id: string;
  email: string;
  isAdmin: boolean;
  name: string;
  userType: UserType;
};

export type ContentObject = {
  id: string;
  title: string;
  description: string;
  name: string;
}

export interface ContentInterface{
  id: string;

  title: string;

  description: string;

  isApproved: boolean;

  name: string;

  date: string;

  userId: string;
}