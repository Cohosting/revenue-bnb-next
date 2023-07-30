import { useEffect } from 'react';

const SavvyCal = () => {
  useEffect(() => {
    // Load SavvyCal script
    window.SavvyCal = window.SavvyCal || function () { (SavvyCal.q = SavvyCal.q || []).push(arguments); };

    const script = document.createElement('script');
    script.src = 'https://embed.savvycal.com/v1/embed.js';
    script.async = true;

    document.body.appendChild(script);

    // Initialize and open SavvyCal
    window.SavvyCal('init');




    // Cleanup
    return () => {
      // Remove SavvyCal script when the component unmounts
      document.body.removeChild(script);
    };
  }, []);

  return null;
};

export default SavvyCal;