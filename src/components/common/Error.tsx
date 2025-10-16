import React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

interface ErrorProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  onGoHome?: () => void;
  fullPage?: boolean;
}

const Error: React.FC<ErrorProps> = ({ 
  title = 'Something went wrong',
  message = 'An error occurred while loading this page.',
  onRetry,
  onGoHome,
  fullPage = false
}) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: fullPage ? '100vh' : '400px',
      width: '100%',
      padding: '32px',
      textAlign: 'center',
      backgroundColor: fullPage ? '#fafafa' : 'transparent'
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        maxWidth: '500px'
      }}>
        {/* Error Icon */}
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          backgroundColor: '#fee2e2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '24px'
        }}>
          <AlertCircle size={40} color="#dc2626" />
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: '28px',
          fontWeight: '600',
          color: '#1f2937',
          marginBottom: '16px',
          marginTop: 0
        }}>
          {title}
        </h1>

        {/* Message */}
        <p style={{
          fontSize: '16px',
          color: '#6b7280',
          marginBottom: '32px',
          lineHeight: '1.5',
          marginTop: 0
        }}>
          {message}
        </p>

        {/* Action Buttons */}
        {(onRetry || onGoHome) && (
          <div style={{
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            {onRetry && (
              <button
                onClick={onRetry}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 24px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  minWidth: '120px',
                  justifyContent: 'center'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
              >
                <RefreshCw size={18} />
                Try Again
              </button>
            )}
            
            {onGoHome && (
              <button
                onClick={onGoHome}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 24px',
                  backgroundColor: 'white',
                  color: '#3b82f6',
                  border: '2px solid #3b82f6',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  minWidth: '120px',
                  justifyContent: 'center'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#eff6ff'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
              >
                <Home size={18} />
                Go Home
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Error;