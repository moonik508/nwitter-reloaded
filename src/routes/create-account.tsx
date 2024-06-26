import { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { auth } from '../firebase.ts';
import { Link, useNavigate } from 'react-router-dom';
import {
	Form,
	Input,
	Switcher,
	Title,
	Wrapper,
	Error,
} from '../components/auth-component';
import GithubBtn from '../components/github-btn';
import { CreateUserData } from '../definition/user';

export default function CreateAccount() {
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [userData, setUserData] = useState<CreateUserData>({
		name: '',
		email: '',
		password: '',
	});
	const [error, setError] = useState<string>('');
	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const {
			target: { name, value },
		} = e;
		setUserData((prev) => {
			return { ...prev, [name]: value };
		});
	};
	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError('');
		if (
			isLoading ||
			userData.name === '' ||
			userData.email === '' ||
			userData.password === ''
		)
			return;
		try {
			setIsLoading(true);
			const credentials = await createUserWithEmailAndPassword(
				auth,
				userData.email,
				userData.password,
			);
			await updateProfile(credentials.user, {
				displayName: userData.name,
			});
			navigate('/');
		} catch (e) {
			if (e instanceof FirebaseError) {
				setError(e.message);
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Wrapper>
			<Title>Join 𝕏</Title>
			<Form onSubmit={onSubmit}>
				<Input
					onChange={onChange}
					name="name"
					value={userData.name}
					placeholder="Name"
					type="text"
					required
				/>
				<Input
					onChange={onChange}
					name="email"
					value={userData.email}
					placeholder="Email"
					type="email"
					required
				/>
				<Input
					onChange={onChange}
					name="password"
					value={userData.password}
					placeholder="Password"
					type="password"
					required
				/>
				<Input
					type="submit"
					value={isLoading ? 'Loading...' : 'Create Account'}
				/>
			</Form>
			{error !== '' ? <Error>{error}</Error> : null}
			<Switcher>
				Already have an account? <Link to={'/login'}>Login &rarr;</Link>
			</Switcher>
			<GithubBtn />
		</Wrapper>
	);
}
