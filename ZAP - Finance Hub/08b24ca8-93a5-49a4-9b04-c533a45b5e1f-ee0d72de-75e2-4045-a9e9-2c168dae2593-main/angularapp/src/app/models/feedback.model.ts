import { User } from "./user.model";

export class Feedback{
    FeedbackId?:number;
    UserId:number;
    Comments:string;
    DateProvided:Date;
    User?: User
}