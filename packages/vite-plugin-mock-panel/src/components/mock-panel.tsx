import React, { useState, useEffect } from 'react';

type Props = {}

const MockPanel: React.FC<Props> = ({ }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [fileContent, setFileContent] = useState('');

  useEffect(() => {
    // fetch('/file-content')
    //   .then(response => response.text())
    //   .then(text => setFileContent(text))
    //   .catch(err => console.error('Error fetching file content:', err));
  }, []);

  const togglePanel = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div>
      <div
        id="ajax-intercept-float-btn"
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 9998,
          cursor: 'pointer',
          background: '#0078d7',
          color: 'white',
          padding: '10px',
          borderRadius: '50%'
        }}
        onClick={togglePanel}
      >
        Intercept
      </div>
      {isVisible && (
        <div
          id="ajax-intercept-panel"
          style={{
            position: 'fixed',
            bottom: '0',
            left: '0',
            width: '100%',
            height: '80%',
            zIndex: 9999,
            background: 'white',
            padding: '20px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            borderTopLeftRadius: '10px',
            borderTopRightRadius: '10px',
            overflowY: 'auto'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div>
            <h3>File Content:</h3>
            <pre>{fileContent}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default MockPanel;
