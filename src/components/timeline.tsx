import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { db } from '../firebase.ts';
import Tweet from './tweet.tsx';

export interface ITweet {
	id: string;
	photo?: string;
	tweet: string;
	userId: string;
	userName: string;
	createdAt: number;
}

const Wrapper = styled.div``;
export default function TimeLine() {
	const [tweet, setTweet] = useState<ITweet[]>([]);
	const fetchTweets = async () => {
		const tweetsQuery = query(
			collection(db, 'tweets'),
			orderBy('createdAt', 'desc'),
		);
		const snapshot = await getDocs(tweetsQuery);
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
	};
	useEffect(() => {
		fetchTweets();
	}, []);
	return (
		<Wrapper>
			{tweet.map((tweet) => (
				<Tweet key={tweet.id} {...tweet} />
			))}
		</Wrapper>
	);
}
