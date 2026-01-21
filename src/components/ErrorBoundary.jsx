import React from 'react';
import { withTranslation } from 'react-i18next';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
        this.setState({
            error,
            errorInfo
        });
    }

    render() {
        const { t } = this.props;

        if (this.state.hasError) {
            return (
                <div className="container mt-5">
                    <div className="card border-danger">
                        <div className="card-header bg-danger text-white">
                            <h4><i className="fas fa-exclamation-triangle me-2"></i>{t('error.title')}</h4>
                        </div>
                        <div className="card-body">
                            <p className="text-danger">
                                {t('error.message')}
                            </p>
                            <details className="mt-3" style={{ whiteSpace: 'pre-wrap' }}>
                                <summary className="btn btn-sm btn-outline-danger">{t('error.showDetails')}</summary>
                                <div className="mt-2 p-3 bg-light border rounded">
                                    <strong>{t('error.errorLabel')}</strong> {this.state.error && this.state.error.toString()}
                                    <br />
                                    <strong>{t('error.stackLabel')}</strong>
                                    <pre className="mt-2 mb-0">{this.state.errorInfo && this.state.errorInfo.componentStack}</pre>
                                </div>
                            </details>
                            <button 
                                className="btn btn-primary mt-3"
                                onClick={() => window.location.reload()}
                            >
                                <i className="fas fa-refresh me-2"></i>{t('actions.reload')}
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default withTranslation()(ErrorBoundary);