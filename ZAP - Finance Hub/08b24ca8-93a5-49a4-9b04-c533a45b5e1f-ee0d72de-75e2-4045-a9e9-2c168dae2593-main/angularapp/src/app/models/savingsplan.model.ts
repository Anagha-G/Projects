export interface SavingsPlan{
    SavingsPlanId?:number;
    Name:string;
    GoalAmount:number;
    TimeFrame:number;
    RiskLevel?:'';
    Description:string;
    Status:string;
}