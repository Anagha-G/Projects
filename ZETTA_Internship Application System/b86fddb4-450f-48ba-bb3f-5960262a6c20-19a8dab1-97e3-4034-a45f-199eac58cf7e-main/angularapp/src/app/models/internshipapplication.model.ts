import { Internship } from "./internship.model";
import { User } from "./user.model";

export interface InternshipApplication
{
    InternshipApplicationId?:number;
    User?: User;
    UserId:number;
    InternshipId:number;
    UniversityName:string;
    DegreeProgram:string;
    Internship?: Internship;
    Resume:string;
    LinkedInProfile?:string;
    ApplicationStatus:string;
    ApplicationDate:Date;

}