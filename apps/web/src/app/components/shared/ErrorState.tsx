import { AlertTriangle, RefreshCw } from "lucide-react";
import { Btn } from "./Btn";

export function ErrorState({
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again.",
  onRetry,
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
        <AlertTriangle size={28} className="text-red-400" />
      </div>
      <h3 className="text-base font-semibold text-white mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-xs mb-5">{message}</p>
      {onRetry && (
        <Btn variant="secondary" size="sm" icon={RefreshCw} onClick={onRetry}>
          Try Again
        </Btn>
      )}
    </div>
  );
}
