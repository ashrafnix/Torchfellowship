import React, { Component, ErrorInfo, ReactNode } from 'react';
import Button from './ui/Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen w-full flex items-center justify-center text-center bg-brand-dark p-4">
            <div>
                <h1 className="text-4xl font-serif text-brand-gold">Something went wrong.</h1>
                <p className="mt-4 text-brand-text-dark">We've logged the error and our team will look into it. Please try refreshing the page.</p>
                <pre className="mt-4 text-left text-xs bg-brand-surface p-4 rounded-md text-red-400 max-w-2xl overflow-auto">
                    {this.state.error?.message}
                </pre>
                <Button onClick={() => window.location.reload()} className="mt-6">
                    Refresh Page
                </Button>
            </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
