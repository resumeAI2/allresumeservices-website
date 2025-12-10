/**
 * Utility functions for generating schema.org structured data markup
 */

interface TableRow {
  cells: string[];
}

interface TableData {
  caption?: string;
  headers: string[];
  rows: TableRow[];
}

/**
 * Extract table data from markdown content
 */
export function extractTablesFromMarkdown(markdown: string): TableData[] {
  const tables: TableData[] = [];
  
  // Debug logging removed
  
  // Find all table blocks in the markdown
  // Match table rows (with optional caption before)
  const tableRegex = /\|[^\n]+\|\n\|[\s\-:]+\|(?:\n\|[^\n]+\|)+/g;
  
  let match;
  let matchCount = 0;
  while ((match = tableRegex.exec(markdown)) !== null) {
    matchCount++;
    const fullMatch = match[0];
    // Look for caption before the table (within 200 chars before match)
    const beforeTable = markdown.substring(Math.max(0, match.index - 200), match.index);
    const captionMatch = beforeTable.match(/\*\*Table \d+:([^*]+)\*\*/);
    const caption = captionMatch ? captionMatch[1].trim() : undefined;
    
    // Extract table lines (excluding caption)
    const tableLines = fullMatch
      .split('\n')
      .filter(line => line.trim().startsWith('|'))
      .map(line => line.trim());
    
    if (tableLines.length < 2) continue;
    
    // Parse header row
    const headers = tableLines[0]
      .split('|')
      .slice(1, -1)
      .map(cell => cell.trim());
    
    // Parse data rows (skip separator row at index 1)
    const rows: TableRow[] = [];
    for (let i = 2; i < tableLines.length; i++) {
      const cells = tableLines[i]
        .split('|')
        .slice(1, -1)
        .map(cell => cell.trim());
      
      if (cells.length > 0) {
        rows.push({ cells });
      }
    }
    
    if (headers.length > 0 && rows.length > 0) {
      // Table extracted successfully
      tables.push({ caption, headers, rows });
    }
  }
  
  // Extraction complete
  return tables;
}

/**
 * Generate schema.org Table JSON-LD markup
 * @see https://schema.org/Table
 */
export function generateTableStructuredData(
  tableData: TableData,
  blogPostUrl: string,
  blogPostTitle: string
): object {
  // Build the table rows for structured data
  const structuredRows = [
    // Header row
    {
      '@type': 'TableRow',
      'rowNumber': 0,
      'cells': tableData.headers.map((header, index) => ({
        '@type': 'TableCell',
        'columnNumber': index,
        'text': header
      }))
    },
    // Data rows
    ...tableData.rows.map((row, rowIndex) => ({
      '@type': 'TableRow',
      'rowNumber': rowIndex + 1,
      'cells': row.cells.map((cell, cellIndex) => ({
        '@type': 'TableCell',
        'columnNumber': cellIndex,
        'text': cell
      }))
    }))
  ];
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Table',
    'about': tableData.caption || blogPostTitle,
    'url': blogPostUrl,
    'numberOfRows': tableData.rows.length + 1, // +1 for header
    'numberOfColumns': tableData.headers.length,
    'rows': structuredRows
  };
}

/**
 * Generate JSON-LD script content for all tables in a blog post
 */
export function generateBlogPostTableStructuredData(
  markdown: string,
  blogPostUrl: string,
  blogPostTitle: string
): string | null {
  const tables = extractTablesFromMarkdown(markdown);
  
  if (tables.length === 0) {
    return null;
  }
  
  // If there's only one table, return single Table markup
  if (tables.length === 1) {
    return JSON.stringify(
      generateTableStructuredData(tables[0], blogPostUrl, blogPostTitle),
      null,
      2
    );
  }
  
  // If there are multiple tables, wrap in an array
  const multipleTablesData = tables.map(table =>
    generateTableStructuredData(table, blogPostUrl, blogPostTitle)
  );
  
  return JSON.stringify(multipleTablesData, null, 2);
}
