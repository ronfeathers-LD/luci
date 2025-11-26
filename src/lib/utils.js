// Utility functions
const { useState, useCallback, useEffect, useRef } = React;

// Production check
const isProduction = window.location.hostname !== 'localhost' && !window.location.hostname.includes('127.0.0.1');

const categorizeContactLevel = (title) => {
  if (!title) return 'Other';
  
  const titleLower = title.toLowerCase();
  
  // C-Level executives
  const cLevelPatterns = [
    /^chief/i, /^c\s*[-.]?\s*level/i, /^c\s*[-.]?\s*suite/i,
    /president/i, /^ceo/i, /^cto/i, /^cfo/i, /^coo/i, /^cmo/i, /^chro/i,
    /^chief\s+executive/i, /^chief\s+technology/i, /^chief\s+financial/i,
    /^chief\s+operating/i, /^chief\s+marketing/i, /^chief\s+human/i
  ];
  
  // Senior Level (VP, SVP, Director, etc.)
  const srLevelPatterns = [
    /^vice\s+president/i, /^vp/i, /^svp/i, /^evp/i,
    /^senior\s+vice\s+president/i, /^executive\s+vice\s+president/i,
    /^director/i, /^senior\s+director/i, /^executive\s+director/i,
    /^head\s+of/i, /^general\s+manager/i, /^gm\b/i
  ];
  
  // Check C-Level first
  if (cLevelPatterns.some(pattern => pattern.test(titleLower))) {
    return 'C-Level';
  }
  
  // Check Senior Level
  if (srLevelPatterns.some(pattern => pattern.test(titleLower))) {
    return 'Sr. Level';
  }
  
  return 'Other';
};

const formatCurrency = (value) => {
  if (!value || value === 'N/A' || value === null || value === undefined) {
    return 'N/A';
  }
  
  // If it's already a formatted string with $, return as is
  if (typeof value === 'string' && value.includes('$')) {
    return value;
  }
  
  // Convert to number if it's a string
  const numValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]/g, '')) : value;
  
  // Check if it's a valid number
  if (isNaN(numValue)) {
    return value; // Return original if not a number
  }
  
  // Format as US currency
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numValue);
};

const log = (...args) => {
  if (!isProduction) {
    console.log(...args);
  }
};

const logError = (...args) => {
  console.error(...args);
};

const getBuildVersion = () => {
  const htmlTag = document.documentElement;
  return htmlTag.getAttribute('data-build-version') || 
         document.querySelector('meta[name="build-version"]')?.content || 
         'unknown';
};

// Export to window
window.categorizeContactLevel = categorizeContactLevel;
window.formatCurrency = formatCurrency;
window.log = log;
window.logError = logError;
window.isProduction = isProduction;
window.getBuildVersion = getBuildVersion;


