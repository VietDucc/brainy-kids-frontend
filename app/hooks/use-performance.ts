import { useEffect } from 'react';
import { event } from '../utils/analytics';

export const usePerformance = (pageName: string) => {
  useEffect(() => {
    // Đo thời gian tải trang
    const measurePageLoad = () => {
      if (performance && performance.timing) {
        const timing = performance.timing;
        const pageLoadTime = timing.loadEventEnd - timing.navigationStart;
        
        event({
          action: 'page_load_time',
          category: 'Performance',
          label: pageName,
          value: Math.round(pageLoadTime)
        });
      }
    };

    // Đo First Contentful Paint (FCP)
    const measureFCP = () => {
      const paintEntries = performance.getEntriesByType('paint');
      const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
      
      if (fcpEntry) {
        event({
          action: 'first_contentful_paint',
          category: 'Performance',
          label: pageName,
          value: Math.round(fcpEntry.startTime)
        });
      }
    };

    // Đo Largest Contentful Paint (LCP)
    const measureLCP = () => {
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        
        event({
          action: 'largest_contentful_paint',
          category: 'Performance',
          label: pageName,
          value: Math.round(lastEntry.startTime)
        });
      }).observe({ type: 'largest-contentful-paint', buffered: true });
    };

    // Đo First Input Delay (FID)
    const measureFID = () => {
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach(entry => {
          event({
            action: 'first_input_delay',
            category: 'Performance',
            label: pageName,
            value: Math.round(entry.processingStart - entry.startTime)
          });
        });
      }).observe({ type: 'first-input', buffered: true });
    };

    // Đo Cumulative Layout Shift (CLS)
    const measureCLS = () => {
      let clsValue = 0;
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach(entry => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        
        event({
          action: 'cumulative_layout_shift',
          category: 'Performance',
          label: pageName,
          value: Math.round(clsValue * 1000) / 1000
        });
      }).observe({ type: 'layout-shift', buffered: true });
    };

    // Thực hiện đo lường khi component mount
    window.addEventListener('load', measurePageLoad);
    measureFCP();
    measureLCP();
    measureFID();
    measureCLS();

    // Cleanup
    return () => {
      window.removeEventListener('load', measurePageLoad);
    };
  }, [pageName]);
}; 