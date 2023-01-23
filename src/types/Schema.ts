export interface ISchema {
    [key: string]: {
        type: string;
        required: boolean;
        unique: boolean;
        default: string;
    } | string
}

export interface ICreate {
    [key: string]: any
}

export interface IUpdate {
    $inc?: {
        [key: string]: number
    },
    $set?: {
        [key: string]: any
    },
    $unset?: {
        [key: string]: any
    },
    $push?: {
        [key: string]: any
    },
    $pull?: {
        [key: string]: any
    },
}