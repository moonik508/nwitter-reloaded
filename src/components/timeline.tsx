import {
	collection,
	limit,
	onSnapshot,
	orderBy,
	query,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { db } from '../firebase.ts';
import Tweet from './tweet.tsx';
import { Unsubscribe } from 'firebase/auth';

export interface ITweet {
	id: string;
	photo?: string;
	tweet: string;
	userId: string;
	userName: string;
	createdAt: number;
}

const Wrapper = styled.div`
	display: flex;
	gap: 10px;
	flex-direction: column;
`;
export default function TimeLine() {
	const [tweet, setTweet] = useState<ITweet[]>([]);

	useEffect(() => {
		let unsubscribe: Unsubscribe | null = null;
		const fetchTweets = async () => {
			const tweetsQuery = query(
				collection(db, 'tweets'),
				orderBy('createdAt', 'desc'),
				limit(25),
			);
			// const snapshot = await getDocs(tweetsQuery);
			// const tweets = snapshot.docs.map((doc) => {
			// 	const { tweet, createdAt, userId, userName, photo } = doc.data();
			// 	return {
			// 		tweet,
			// 		createdAt,
			// 		userId,
			// 		userName,
			// 		photo,
			// 		id: doc.id,
			// 	};
			// });
			unsubscribe = await onSnapshot(tweetsQuery, (snapshot) => {
				const tweets = snapshot.docs.map((doc) => {
					const { tweet, createdAt, userId, userName, photo } = doc.data();
					return {
						tweet,
						createdAt,
						userId,
						userName,
						photo,
						id: doc.id,
					};
				});
				setTweet(tweets);
			});
		};
		fetchTweets();
		return () => {
			unsubscribe && unsubscribe();
		};
	}, []);
	return (
		<Wrapper>
			{tweet.map((tweet) => (
				<Tweet key={tweet.id} {...tweet} />
			))}
		</Wrapper>
	);
}