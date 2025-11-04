import { action, observable } from "mobx";

type Employee = {
    Id : string,
    Name : string,
    
    Country : string,
    City : string,
    Gender : string,
    Department : string,
    Ethnicity : string;
    
}

type Managemenet = {
    id : number,
    title : string,
    name : string,
    email : string,
    phone : string,
    dateOfJoining : string;
}

type StoreType = {

    employee : Employee[],
    management : Managemenet[],
    employeevisible : boolean,
    managementvisible : boolean,

    setemployee : (employee : Employee[]) => void;
    setmanagment : (management : Managemenet[]) => void;
    setemployeevisbile : () => void;
    setmanagementvisible : () => void;



}




const store : StoreType = observable({
    employee : [],
    management : [],
    employeevisible : false,
    managementvisible : false,

    setemployee : action((employee : Employee[]) =>{
        store.employee = employee
    }),

    setmanagment : action((management : Managemenet[]) =>{
        store.management = management
    }),

    setemployeevisbile : action(()=>{
        store.employeevisible = !store.employeevisible;
        // console.log("sai")
    }),

    setmanagementvisible : action(()=>{
        store.managementvisible = !store.managementvisible;
        // console.log("kiran")
    })





})


export default store