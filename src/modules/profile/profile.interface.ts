export interface IProfile { 
    user_id: string;
    name: string;
    email: string;
    password: string;
    age: number;
    gender: string;
    phone: string;
    bio?: string;
    location?: string;
}