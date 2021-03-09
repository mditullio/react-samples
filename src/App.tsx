import React, { useState, Suspense } from 'react';


const Welcome = React.lazy(() => import( /* webpackChunkName: "welcome" */ "./Welcome"));

const App: React.FC = () => {
  let [loading, setLoading] = useState<boolean>(true);

  let interval = 1000;

  let timerId = setTimeout(() => {
    setLoading(false);
  }, interval);

  return (
    <>
      {
        loading ? (<div>Loading ...</div >) : (
          <Suspense fallback={<div>Loading ...</div>}>
            <Welcome />
          </Suspense>
        )
      }
    </>
  );
}

export default App;
