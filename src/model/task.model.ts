export interface Task {
    id?: string;
    title: string;
    description: string;
    client: firebase.firestore.DocumentReference;
    clientDescriptionName: string;
    total: number;
    date: number;
    type: TaskType;
}

export enum TaskType {
    VENTA,
    REPARACION,
    OTROS
}
