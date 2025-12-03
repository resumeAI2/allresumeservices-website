import { useEffect } from 'react';
import { useLocation } from 'wouter';

export default function ContactRedirect() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    setLocation('/about');
  }, [setLocation]);

  return null;
}
