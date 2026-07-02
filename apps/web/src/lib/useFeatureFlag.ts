import { useState, useEffect, useCallback } from 'react';
import { featureFlagsService } from '@/services/feature-flags';

export function useFeatureFlag(key: string, context?: { userId?: string; groups?: string[] }) {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  const check = useCallback(async () => {
    setLoading(true);
    try {
      const res = await featureFlagsService.evaluate(key, context);
      setEnabled(res.enabled);
    } catch {
      setEnabled(false);
    }
    setLoading(false);
  }, [key, context?.userId, context?.groups?.join(',')]);

  useEffect(() => { check(); }, [check]);

  return { enabled, loading, refresh: check };
}

export function useAllFeatureFlags(context?: { userId?: string; groups?: string[] }) {
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  const check = useCallback(async () => {
    setLoading(true);
    try {
      const res = await featureFlagsService.evaluateAll(context);
      setFlags(res);
    } catch {
      setFlags({});
    }
    setLoading(false);
  }, [context?.userId, context?.groups?.join(',')]);

  useEffect(() => { check(); }, [check]);

  return { flags, loading, refresh: check };
}
