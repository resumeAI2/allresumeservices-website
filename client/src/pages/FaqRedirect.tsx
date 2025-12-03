import { useEffect } from 'react';
import { useLocation } from 'wouter';

export default function FaqRedirect() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    setLocation('/process');
  }, [setLocation]);

  return null;
}
