import React, { useEffect } from 'react';
import reset from 'styled-reset';
import router from './routes/router';
import { RouterProvider } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import LoadingScreen from './components/loading-screen.tsx';
import { auth } from './firebase.ts';

const GlobalStyle = createGlobalStyle`
  ${reset};
  body {
    background-color: black;
    color: white;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, Oxygen, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
  }
`;

function App() {
  const [isLoading, setIsLoading] = React.useState(true);
  const init = async () => {
    await auth.authStateReady();
    setIsLoading(false);
  };
  useEffect(() => {
    init();
  }, []);
  return (
    <>
      <GlobalStyle />
      {isLoading ? <LoadingScreen /> : <RouterProvider router={router} />}
    </>
  );
}

export default App;
