import {StrictMode, Component, type ReactNode} from 'react';
import {createRoot} from 'react-dom/client';
import { AuthProvider } from './contexts/AuthContext';
import Router from './Router';
import './index.css';

class ErrorBoundary extends Component<{children: ReactNode}, {error: Error | null}> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  render() {
    if (this.state.error) return <div style={{padding:40,color:'red',fontFamily:'monospace',whiteSpace:'pre-wrap'}}><h1>App Error</h1><p>{this.state.error.message}</p><pre>{this.state.error.stack}</pre></div>;
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <Router />
      </AuthProvider>
    </ErrorBoundary>
  </StrictMode>,
);
