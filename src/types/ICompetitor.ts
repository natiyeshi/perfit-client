export interface ICompetitor {
    name?: string; // Optional as it might be partially updated
    email?: string; // Email must follow the regex if provided
    phoneNumber?: string; // Phone number must follow the regex if provided
    competitorId? : string;
    tin? : string;
    licenseNumber? : string;
}
  
export interface IDBCompetitor extends ICompetitor {
id: string; 
}  