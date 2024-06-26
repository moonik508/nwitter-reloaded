import { useState } from 'react';
import { FirebaseError } from 'firebase/app';
import { auth } from '../firebase.ts';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import {
	Form,
	Input,
	Switcher,
	Title,
	Wrapper,
	Error,
} from '../components/auth-component.ts';
import GithubBtn from '../components/github-btn';
import LoginUserData from '../definition/user';

export default function CreateAccount() {
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [userData, setUserData] = useState<LoginUserData>({
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
		if (isLoading || userData.email === '' || userData.password === '') return;
		try {
			setIsLoading(true);
			await signInWithEmailAndPassword(auth, userData.email, userData.password);
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
			<Title>Login 𝕏</Title>
			<Form onSubmit={onSubmit}>
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
				<Input type="submit" value={isLoading ? 'Loading...' : 'Log in'} />
			</Form>
			{error !== '' ? <Error>{error}</Error> : null}
			<Switcher>
				Don't have an account yet?{' '}
				<Link to={'/create-account'}>Create one &rarr;</Link>
			</Switcher>
			<GithubBtn />
		</Wrapper>
	);
}
