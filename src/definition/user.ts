export default interface LoginUserData {
	email: string;
	password: string;
}

export interface CreateUserData extends LoginUserData {
	name: string;
}
