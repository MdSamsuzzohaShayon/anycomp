/**
 * Converts a string into a URL-friendly slug.
 *
 * Example:
 *  "Hello World!" → "hello-world"
 *  "React & TypeScript Guide" → "react-typescript-guide"
 */
export function slugify(text: string): string {
    return text
        .toLowerCase()
        .normalize("NFD")                     // Normalize accented chars
        .replace(/[\u0300-\u036f]/g, "")      // Remove diacritics
        .replace(/[^a-z0-9\s-]/g, "")         // Remove special chars
        .trim()
        .replace(/\s+/g, "-")                 // Replace spaces with -
        .replace(/-+/g, "-");                 // Remove duplicate -
}
