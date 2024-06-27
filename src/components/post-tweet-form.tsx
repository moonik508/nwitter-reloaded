import styled from 'styled-components';
import { useState } from 'react';
import { addDoc, collection, updateDoc } from 'firebase/firestore';
import { auth, db, storage } from '../firebase.ts';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

const Form = styled.form`
	display: flex;
	flex-direction: column;
	gap: 10px;
`;

const TextArea = styled.textarea`
	width: 100%;
	padding: 20px;
	border: 2px solid #fff;
	border-radius: 20px;
	color: #fff;
	font-size: 16px;
	background-color: #000;
	resize: none;

	&::placeholder {
		font-size: 16px;
		font-family:
			system-ui,
			-apple-system,
			BlinkMacSystemFont,
			'Segoe UI';
	}

	&:focus {
		outline: none;
		border-color: #1d9bf0;
	}
`;

const AttachFileButton = styled.label`
	padding: 10px 0;
	color: #1d9bf0;
	font-size: 16px;
	font-weight: 600;
	text-align: center;
	border: 1px solid #1d9bf0;
	border-radius: 20px;
	cursor: pointer;
`;

const AttachFileInput = styled.input`
	display: none;
`;

const SubmitBtn = styled.input`
	color: #fff;
	padding: 10px 0;
	font-size: 16px;
	border: 0;
	border-radius: 20px;
	background-color: #1d9bf0;
	cursor: pointer;

	&:hover,
	&:active {
		opacity: 0.8;
	}
`;

export default function PostTweetForm() {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [tweet, setTweet] = useState<string>('');
	const [file, setFile] = useState<File | null>(null);
	const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setTweet(e.target.value);
	};
	const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { files } = e.target;
		const maxSize = 1024 * 1024;
		if (files && files.length === 1) {
			if (files[0].size > maxSize) {
				alert('파일의 용량은 1MB를 초과할 수 없습니다.');
				return;
			}
			setFile(files[0]);
		}
	};
	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const user = auth.currentUser;
		if (!user || isLoading || tweet === '' || tweet.length > 180) return;

		try {
			setIsLoading(true);
			const doc = await addDoc(collection(db, 'tweets'), {
				tweet,
				createdAt: Date.now(),
				username: user.displayName || 'Anonymous',
				userId: user.uid,
			});
			if (file) {
				const locationRef = ref(
					storage,
					`tweets/${user.uid}-${user.displayName}/${doc.id}`,
				);
				const result = await uploadBytes(locationRef, file);
				const url = await getDownloadURL(result.ref);
				await updateDoc(doc, {
					photo: url,
				});
			}
			setTweet('');
			setFile(null);
		} catch (e) {
			console.log(e);
		} finally {
			setIsLoading(false);
		}
	};
	return (
		<Form onSubmit={onSubmit}>
			<TextArea
				required
				rows={5}
				maxLength={180}
				value={tweet}
				placeholder="what is happening"
				onChange={onChange}
			/>
			<AttachFileButton htmlFor="file">
				{file ? 'Photo Added ✅' : 'Add Photo'}
			</AttachFileButton>
			<AttachFileInput
				id="file"
				type="file"
				accept="image/*"
				onChange={onFileChange}
			/>
			<SubmitBtn
				type="submit"
				value={isLoading ? 'posting...' : 'post tweet'}
			/>
		</Form>
	);
}
