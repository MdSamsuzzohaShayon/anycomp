/**
 * Utility functions for the Specialists application
 */

import { PublishStatus } from "../types";

/**
 * Format currency with RM prefix
 */
export function formatCurrency(amount: number | string): string {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return `RM ${numAmount.toFixed(2)}`;
  }
  
  /**
   * Generate slug from title
   */
  export function generateSlug(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  
  /**
   * Validate email format
   */
  export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  /**
   * Format date to readable string
   */
  export function formatDate(date: string | Date): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-MY', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
  
  /**
   * Format date and time to readable string
   */
  export function formatDateTime(date: string | Date): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleString('en-MY', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  
  /**
   * Calculate percentage
   */
  export function calculatePercentage(value: number, total: number): number {
    if (total === 0) return 0;
    return (value / total) * 100;
  }
  
  /**
   * Debounce function for search inputs
   */
  export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null;
  
    return function executedFunction(...args: Parameters<T>) {
      const later = () => {
        timeout = null;
        func(...args);
      };
  
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(later, wait);
    };
  }
  
  /**
   * Truncate text with ellipsis
   */
  export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }
  
  /**
   * Check if value is empty (null, undefined, empty string, empty array)
   */
  export function isEmpty(value: any): boolean {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string') return value.trim().length === 0;
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === 'object') return Object.keys(value).length === 0;
    return false;
  }
  
  /**
   * Format file size to human readable format
   */
  export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
  
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
  
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }
  
  /**
   * Copy text to clipboard
   */
  export async function copyToClipboard(text: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.error('Failed to copy text:', err);
      return false;
    }
  }
  
  /**
   * Download data as file
   */
  export function downloadFile(data: string, filename: string, type = 'text/plain') {
    const blob = new Blob([data], { type });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
  
  /**
   * Export specialists to CSV
   */
  export function exportSpecialistsToCSV(specialists: any[]): void {
    const headers = ['ID', 'Title', 'Slug', 'Base Price', 'Platform Fee', 'Final Price', 'Duration (Days)', 'Status', 'Published'];
    
    const rows = specialists.map((s) => [
      s.id,
      s.title,
      s.slug,
      s.base_price,
      s.platform_fee,
      s.final_price,
      s.duration_days,
      s.verification_status,
      s.is_draft ? 'No' : 'Yes',
    ]);
  
    const csv = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');
  
    downloadFile(csv, `specialists-${Date.now()}.csv`, 'text/csv');
  }
  
  /**
   * Get initials from name
   */
  export function getInitials(name: string): string {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }
  
  /**
   * Check if user is authenticated
   */
  export function isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }
  
  /**
   * Clear authentication
   */
  export function clearAuth(): void {
    localStorage.removeItem('token');
  }
  
  /**
   * Set authentication token
   */
  export function setAuthToken(token: string): void {
    localStorage.setItem('token', token);
  }
  
  /**
   * Get authentication token
   */
  export function getAuthToken(): string | null {
    return localStorage.getItem('token');
  }

  // ==================== Helper Functions ====================
export const mapDraftToPublish = (s3_key: string | null | undefined): PublishStatus => {
  return s3_key ? 'published' : 'not_published';
};




  