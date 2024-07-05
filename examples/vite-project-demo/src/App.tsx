import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import router from '@/router';

import { hideLoading } from '@/utils/tools';


  function App() {

    useEffect(() => {
      
        setTimeout(() => {
          hideLoading();
        }, 500);
    }, []);

    return <RouterProvider router={router} />;
  }

export default App;
