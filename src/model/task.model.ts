export interface Task {
    id?: string;
    title: string;
    description: string;
    operation?: string,
    client: firebase.firestore.DocumentReference;
    clientDescriptionName: string;
    total: number;
    pendingPaid: boolean;
    date: number;
    type: TaskType;
}

export enum TaskType {
    VENTA,
    REPARACION,
    OTROS
}
