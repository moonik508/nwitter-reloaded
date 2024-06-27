import { ITweet } from './timeline.tsx';
import styled from 'styled-components';

const Wrapper = styled.div`
	display: grid;
	grid-template-columns: 3fr 1fr;
	padding: 20px;
	border: 1px solid rgba(255, 255, 255, 0.8);
	border-radius: 15px;
	background-color: transparent;
`;

const Column = styled.div``;

const Username = styled.span`
	font-size: 15px;
	font-weight: 600;
`;

const Payload = styled.p`
	margin: 10px 0;
	font-size: 18px;
`;

const Photo = styled.img`
	width: 100px;
	height: 100px;
	border-radius: 15px;
`;

export default function Tweet({ userName, photo, tweet }: ITweet) {
	return (
		<Wrapper>
			<Column>
				<Username>{userName ? userName : 'anonymous'}</Username>
				<Payload>{tweet}</Payload>
			</Column>
			{photo ? (
				<Column>
					<Photo src={photo}></Photo>
				</Column>
			) : null}
		</Wrapper>
	);
}
