import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      let errorMessage = 'Something went wrong.';
      let details = '';

      try {
        // Check if it's a Firestore JSON error
        const parsed = JSON.parse(this.state.error?.message || '');
        if (parsed.error && parsed.operationType) {
          errorMessage = `Firestore ${parsed.operationType} error: ${parsed.error}`;
          details = `Path: ${parsed.path || 'unknown'}`;
        }
      } catch (e) {
        errorMessage = this.state.error?.message || errorMessage;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-red-100">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Application Error</h2>
            <div className="bg-red-50 p-4 rounded-xl border border-red-100 mb-6">
              <p className="text-red-800 font-medium">{errorMessage}</p>
              {details && <p className="text-red-600 text-sm mt-2 font-mono">{details}</p>}
            </div>
            <p className="text-slate-600 mb-6">
              This is often caused by missing Firestore security rules or incorrect configuration.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-colors"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
