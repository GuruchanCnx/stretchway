import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ShieldAlert, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): State {
    let msg = error.message || 'An unexpected error occurred.';
    try {
      const parsed = JSON.parse(msg);
      if (parsed?.error) {
        msg = `Data sync error (${parsed.operationType || 'operation'}): ${parsed.error}`;
      }
    } catch {
      // Plain error message
    }
    return { hasError: true, message: msg };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('StretchWay ErrorBoundary caught error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
          <div className="max-w-md w-full rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-extrabold text-white">StretchWay Recovery View Interrupted</h2>
            <p className="text-xs text-slate-400 leading-relaxed">{this.state.message}</p>
            <button
              type="button"
              onClick={() => {
                this.setState({ hasError: false, message: '' });
                window.location.reload();
              }}
              className="w-full py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reload StretchWay</span>
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
