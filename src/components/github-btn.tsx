import styled from 'styled-components';
import { GithubAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase.ts';
import { useNavigate } from 'react-router-dom';

const Button = styled.button`
	display: flex;
	gap: 5px;
	justify-content: center;
	align-items: center;
	margin-top: 50px;
	width: 100%;
	padding: 10px 20px;
	color: #000;
	font-weight: 500;
	border-radius: 50px;
	border: 0;
	background-color: white;
	cursor: pointer;
`;

const Logo = styled.img`
	height: 25px;
`;

export default function GithubBtn() {
	const navigate = useNavigate();
	const onClick = async () => {
		try {
			const provider = new GithubAuthProvider();
			await signInWithPopup(auth, provider);
			navigate('/');
		} catch (error) {
			console.error(error);
		}
	};
	return (
		<Button onClick={onClick}>
			<Logo src="/github-logo.svg" />
			continue with Github
		</Button>
	);
}
