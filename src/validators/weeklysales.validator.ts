import * as yup from 'yup';

export const createWeeklySalesSchema = yup.object().shape({
    targetSales: yup
        .number()
        .typeError("Target sales must be a number.")
        .integer("Target sales must be an integer.")
        .min(0, "Target sales must be zero or greater."),
    
    plannedContacts: yup
        .number()
        .typeError("Planned contacts must be a number.")
        .integer("Planned contacts must be an integer.")
        .min(0, "Planned contacts must be zero or greater."),
    
    plannedVisits: yup
        .number()
        .typeError("Planned visits must be a number.")
        .integer("Planned visits must be an integer.")
        .min(0, "Planned visits must be zero or greater."),
    
    plannedNewCustomers: yup
        .number()
        .typeError("Planned new customers must be a number.")
        .integer("Planned new customers must be an integer.")
        .min(0, "Planned new customers must be zero or greater."),
    
    plannedTransactions: yup
        .number()
        .typeError("Planned transactions must be a number.")
        .integer("Planned transactions must be an integer.")
        .min(0, "Planned transactions must be zero or greater."),
    
});