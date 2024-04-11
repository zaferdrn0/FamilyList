
export interface DataTypes {
    _id:string,
    name:string
}

export interface DataPriorities {
    _id:string,
    name:string
}


export interface Data{
    _id:string,
    name:string,
    dataType:DataTypes,
    dataPriority:DataPriorities,
    assignedUsers:string[]
}