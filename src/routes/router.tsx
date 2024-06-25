import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/Layout.tsx';
import Home from './home.tsx';
import Profile from './profile.tsx';
import Login from './login.tsx';
import CreateAccount from './create-account.tsx';
import ProtectedRoute from '../components/protected-route.tsx';

const router = createBrowserRouter([
	{
		path: '/',
		element: (
			<ProtectedRoute>
				<Layout />
			</ProtectedRoute>
		),
		children: [
			{
				path: '',
				element: <Home />,
			},
			{
				path: 'profile',
				element: <Profile />,
			},
		],
	},
	{
		path: '/login',
		element: <Login />,
	},
	{
		path: '/create-account',
		element: <CreateAccount />,
	},
]);
export default router;
