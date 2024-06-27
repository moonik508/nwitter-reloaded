import { ITweet } from './timeline.tsx';
import styled from 'styled-components';
import { auth, db, storage } from '../firebase.ts';
import { deleteDoc, doc } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';

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

const DeleteButton = styled.button`
	padding: 5px 10px;
	color: #fff;
	font-size: 12px;
	font-weight: 600;
	border: 0;
	border-radius: 5px;
	text-transform: uppercase;
	background-color: tomato;
	cursor: pointer;
`;

export default function Tweet({ userName, photo, tweet, userId, id }: ITweet) {
	const user = auth.currentUser;
	const onDelete = async () => {
		const ok = confirm('Are you sure you want to delete this tweet?');
		if (!ok || user?.uid !== userId) return;
		try {
			await deleteDoc(doc(db, 'tweets', id));
			if (photo) {
				const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
				await deleteObject(photoRef);
			}
		} catch (e) {
			console.log(e);
		} finally {
		}
	};
	return (
		<Wrapper>
			<Column>
				<Username>{userName ? userName : 'anonymous'}</Username>
				<Payload>{tweet}</Payload>
				{user?.uid === userId ? (
					<DeleteButton onClick={onDelete}>Delete</DeleteButton>
				) : null}
			</Column>
			<Column>{photo ? <Photo src={photo}></Photo> : null}</Column>
		</Wrapper>
	);
}
