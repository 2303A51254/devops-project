import React from 'react';

class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'grid',
            placeItems: 'center',
            padding: '2rem',
            background: '#f4ede3',
            color: '#211814',
            fontFamily: 'Manrope, sans-serif',
          }}
        >
          <div
            style={{
              maxWidth: '720px',
              width: '100%',
              padding: '1.5rem',
              borderRadius: '24px',
              background: 'rgba(255,250,244,0.92)',
              border: '1px solid rgba(33,24,20,0.1)',
            }}
          >
            <h1 style={{ marginTop: 0 }}>Frontend error</h1>
            <p>The app hit a render error. Refresh after fixes, or share this message.</p>
            <pre style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>
              {String(this.state.error?.stack || this.state.error?.message || this.state.error)}
            </pre>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AppErrorBoundary;
