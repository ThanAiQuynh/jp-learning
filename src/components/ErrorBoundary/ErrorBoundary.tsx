import { Component, ErrorInfo, ReactNode } from 'react';
import { Button, Title3, Body1 } from '@fluentui/react-components';
import { ErrorCircle24Regular } from '@fluentui/react-icons';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '300px',
          padding: '48px 24px',
          textAlign: 'center',
          backgroundColor: 'var(--colorNeutralBackground1)',
          borderRadius: '12px',
          margin: '24px',
          border: '1px solid var(--colorNeutralStroke1)',
        }}>
          <ErrorCircle24Regular style={{ fontSize: '48px', color: 'var(--colorPaletteRedForeground1)', marginBottom: '16px' }} />
          <Title3 style={{ marginBottom: '8px' }}>Đã xảy ra lỗi ứng dụng</Title3>
          <Body1 style={{ color: 'var(--colorNeutralForeground2)', marginBottom: '24px', maxWidth: '400px' }}>
            Ứng dụng gặp sự cố không mong muốn. Bạn có thể thử tải lại trang hoặc quay lại sau.
          </Body1>
          <Button appearance="primary" onClick={this.handleReset}>
            Tải lại trang
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
