import { FiAlertTriangle } from 'react-icons/fi';

const ErrorState = ({ message = 'Something went wrong.', onRetry }) => (
  <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-ink-200 py-16 text-center dark:border-ink-700">
    <FiAlertTriangle className="text-red-400" size={28} />
    <p className="max-w-sm text-sm text-ink-500 dark:text-ink-400">{message}</p>
    {onRetry && (
      <button onClick={onRetry} className="btn-secondary mt-1">
        Try again
      </button>
    )}
  </div>
);

export default ErrorState;
