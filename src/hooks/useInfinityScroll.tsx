import Loading from '@components/common/atom/Loading';
import { useEffect, useState, useRef, useCallback } from 'react';

type InfinityScrollProps = {
  setState: React.Dispatch<React.SetStateAction<Record<string, any>[]>>;
  data: Record<string, any>[];
};

export default function useInfinityScroll({ setState, data }: InfinityScrollProps) {
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const pageEnd = useRef<HTMLDivElement>(null);

  const loadingComponent = <Loading ref={pageEnd} isLoading={loading} />;

  const fetchPosts = useCallback(
    async (pageNum: number) => {
      if (!hasMore) return;

      setLoading(true);
      try {
        const newPosts = data;
        if (newPosts.length > 0) {
          setState((prev) => [...prev, ...data]);
          setPage(pageNum + 1);
        } else {
          setHasMore(false);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    [hasMore],
  );

  useEffect(() => {
    fetchPosts(page);
  }, [fetchPosts]);

  useEffect(() => {
    if (!loading && hasMore) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            fetchPosts(page);
          }
        },
        { threshold: 0.7 },
      );

      if (pageEnd.current) {
        observer.observe(pageEnd.current);
      }

      return () => {
        if (pageEnd.current) {
          observer.unobserve(pageEnd.current);
        }
      };
    }
  }, [loading]);
  return { loadingComponent };
}
