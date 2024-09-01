import { useState, useEffect, useRef, Dispatch, SetStateAction } from 'react';

interface IntersectionObserverArgs extends IntersectionObserverInit {
  freezeOnceVisible?: boolean;
}

export function useIntersectionObserver({
  root = null,
  rootMargin = '0px',
  threshold = 0.1,
  freezeOnceVisible = false,
}: IntersectionObserverArgs): [
  Dispatch<SetStateAction<HTMLElement | null>>,
  IntersectionObserverEntry | null
] {
  const [element, setElement] = useState<HTMLElement | null>(null);
  const [observerEntry, setObserverEntry] = useState<IntersectionObserverEntry | null>(null);

  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!element) return;
    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0]) {
          setObserverEntry(entries[0]);
          if (entries[0].isIntersecting && freezeOnceVisible && observer.current) {
            observer.current.disconnect();
          }
        }
      },
      {
        root,
        rootMargin,
        threshold,
      }
    );

    observer.current.observe(element);

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [element, root, rootMargin, threshold, freezeOnceVisible]);

  return [setElement, observerEntry];
}
