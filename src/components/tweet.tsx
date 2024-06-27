import { ITweet } from './timeline.tsx';
import styled from 'styled-components';
import { auth, db, storage } from '../firebase.ts';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import {
	deleteObject,
	getDownloadURL,
	ref,
	uploadBytes,
} from 'firebase/storage';
import { useState } from 'react';
import { AttachFileInput } from './post-tweet-form.tsx';

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

const ModifyPayload = styled.textarea`
	display: block;
	margin: 10px 0;
	font-size: 18px;
	background-color: #f0c;
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

const ModifyButton = styled.button`
	padding: 5px 10px;
	color: #000;
	border-radius: 5px;
	background-color: #ddd;
	cursor: pointer;
`;

const AttachNewFileBtn = styled.label`
	padding: 5px 10px;
	color: #000;
	font-size: 12px;
	border-radius: 5px;
	background-color: #ddd;
`;

export default function Tweet({ userName, photo, tweet, userId, id }: ITweet) {
	const [updateState, setUpdateState] = useState<boolean>(false);
	const [newTweet, setNewTweet] = useState<string>(tweet);
	const [newFile, setNewFile] = useState<File | null>(null);
	const user = auth.currentUser;

	const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { files } = e.target;
		const maxSize = 1024 * 1024;
		if (files && files.length === 1) {
			if (files[0].size > maxSize) {
				alert('파일의 용량은 1MB를 초과할 수 없습니다.');
				return;
			}
			setNewFile(files[0]);
		}
	};
	const onEdit = () => {
		if (!updateState) setUpdateState(true);
	};
	const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setNewTweet(e.target.value);
	};
	const onUpdate = async () => {
		const user = auth.currentUser;
		if (!user || newTweet === '' || newTweet.length > 180 || !updateState)
			return;
		const tweetRef = doc(db, 'tweets', id);
		await updateDoc(tweetRef, {
			tweet: newTweet,
		});
		if (newFile) {
			if (photo) {
				const originRef = ref(storage, `tweets/${user.uid}/${id}`);
				await deleteObject(originRef);
			}
			const locationRef = ref(storage, `tweets/${user.uid}/${id}`);
			const result = await uploadBytes(locationRef, newFile);
			const url = await getDownloadURL(result.ref);
			await updateDoc(tweetRef, {
				photo: url,
			});
		}
		setUpdateState(false);
	};
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
		}
	};
	return (
		<Wrapper>
			<Column>
				<Username>{userName ? userName : 'anonymous'}</Username>
				{!updateState ? (
					<Payload>{tweet}</Payload>
				) : (
					<ModifyPayload value={newTweet} onChange={onChange} />
				)}
				{user?.uid === userId ? (
					<DeleteButton onClick={onDelete}>Delete</DeleteButton>
				) : null}
				{!updateState ? (
					<ModifyButton onClick={onEdit}>Edit</ModifyButton>
				) : (
					<>
						<AttachNewFileBtn htmlFor="newFile">
							upload New Image
						</AttachNewFileBtn>
						<AttachFileInput
							id="newFile"
							type="file"
							accept="image/*"
							onChange={onFileChange}
						/>
						<ModifyButton onClick={onUpdate}>Update</ModifyButton>
					</>
				)}
			</Column>
			<Column>{photo ? <Photo src={photo}></Photo> : null}</Column>
		</Wrapper>
	);
}
