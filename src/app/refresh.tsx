'use client';
import { useEffect } from 'react';
import PullToRefresh from 'pulltorefreshjs';

export default function PullRefresh() {
  useEffect(() => {
    PullToRefresh.init({
      mainElement: '#nav-s', // element to watch
      onRefresh() {
        // e.g., reload the page or refetch data
        window.location.reload();
      }
    });

    return () => {
      PullToRefresh.destroyAll();
    };
  }, []);

  return null;
}
