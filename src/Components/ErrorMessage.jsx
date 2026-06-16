const TYPE_STYLES = {
    error: {
        container: 'bg-red-900/80 border border-red-700 text-red-100',
        icon: '✕',
        retryBtn: 'bg-red-700 hover:bg-red-600 text-white',
    },
    warning: {
        container: 'bg-yellow-900/80 border border-yellow-700 text-yellow-100',
        icon: '⚠',
        retryBtn: 'bg-yellow-700 hover:bg-yellow-600 text-white',
    },
    info: {
        container: 'bg-blue-900/80 border border-blue-700 text-blue-100',
        icon: 'ℹ',
        retryBtn: 'bg-blue-700 hover:bg-blue-600 text-white',
    },
};

const ErrorMessage = ({ message, onDismiss, onRetry, type = 'error' }) => {
    if (!message) return null;

    const styles = TYPE_STYLES[type] ?? TYPE_STYLES.error;

    return (
        <div
            role="alert"
            className={`flex items-start gap-3 rounded-md px-4 py-3 text-sm ${styles.container}`}
        >
            <span className="mt-0.5 shrink-0 text-base leading-none" aria-hidden="true">
                {styles.icon}
            </span>

            <span className="flex-1">{message}</span>

            <div className="flex shrink-0 items-center gap-2">
                {onRetry && (
                    <button
                        onClick={onRetry}
                        className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${styles.retryBtn}`}
                    >
                        Retry
                    </button>
                )}
                {onDismiss && (
                    <button
                        onClick={onDismiss}
                        aria-label="Dismiss"
                        className="text-current opacity-70 hover:opacity-100 transition-opacity text-base leading-none"
                    >
                        ×
                    </button>
                )}
            </div>
        </div>
    );
};

export default ErrorMessage;
