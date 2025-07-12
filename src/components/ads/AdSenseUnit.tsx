
"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Extend the Window interface to include adsbygoogle
declare global {
  interface Window {
    adsbygoogle?: { [key: string]: unknown }[];
  }
}

const AdSenseUnit = () => {
  const pathname = usePathname();

  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error("AdSense error:", err);
    }
  }, [pathname]); // Re-run effect when path changes

  return (
    <div style={{ textAlign: 'center' }} key={pathname}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-8517722132136281" // Your publisher ID
        data-ad-slot="YOUR_AD_SLOT_ID" // Replace with your actual Ad Slot ID
        data-ad-format="auto"
        data-full-width-responsive="true"
        data-ad-status="unfilled"
      ></ins>
    </div>
  );
};

export default AdSenseUnit;
