import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import router from '@/router';
<% if (platform === 'mobile') { %>
import { loadScript, hideLoading, getPlatform } from '@/utils/tools';
<% } else { %>
import { hideLoading } from '@/utils/tools';
<% } %>

  function App() {

    useEffect(() => {
      <% if (platform === 'mobile') { %>
        const platform = getPlatform();
        if (platform === 'iting') {
          loadScript('//s1.xmcdn.com/yx/jssdk/1.1.1/build/ly.js', () => {
            console.log('jssdk加载完成');
          });
        }
      <% } %>
        setTimeout(() => {
          hideLoading();
        }, 500);
    }, []);

    return <RouterProvider router={router} />;
  }

export default App;
