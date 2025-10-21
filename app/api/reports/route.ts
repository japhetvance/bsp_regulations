import { NextRequest, NextResponse } from 'next/server';
import { parse } from 'csv-parse/sync';
import { readFileSync } from 'fs';
import { join } from 'path';
import Fuse from 'fuse.js';

// Read and parse CSV data
const csvPath = join(process.cwd(), 'data', 'req_reports_list.csv');
const csvContent = readFileSync(csvPath, 'utf-8');
const records = parse(csvContent, {
  columns: true,
  skip_empty_lines: true,
});

// Create Fuse instance for fuzzy search
const fuse = new Fuse(records, {
  keys: [
    'Category',
    'Form No.',
    'MOR Ref.',
    'Report Title',
    'Frequency',
    'Submission Deadline',
    'Submission Procedure / E-mail Address'
  ],
  threshold: 0.3,
  includeScore: true,
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search');
  const category = searchParams.get('category');
  const frequency = searchParams.get('frequency');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');

  let filteredRecords = records;

  // Apply search filter
  if (search) {
    const searchResults = fuse.search(search);
    filteredRecords = searchResults.map(result => result.item);
  }

  // Apply category filter
  if (category && category !== 'all') {
    filteredRecords = filteredRecords.filter(record => 
      typeof record === 'object' &&
      record !== null &&
      'Category' in record &&
      (record as { Category?: string }).Category === category
    );
  }

  // Apply frequency filter
  if (frequency && frequency !== 'all') {
    filteredRecords = filteredRecords.filter(record => 
      typeof record === 'object' &&
      record !== null &&
      'Frequency' in record &&
      (record as { Frequency?: string }).Frequency === frequency
    );
  }

  // Get unique categories and frequencies for filters
  const categories = [...new Set(records.map(record => typeof record === 'object' && record !== null && 'Category' in record ? (record as { Category?: string }).Category : ''))].filter(Boolean);
  const frequencies = [...new Set(records.map(record => typeof record === 'object' && record !== null && 'Frequency' in record ? (record as { Frequency?: string }).Frequency : ''))].filter(Boolean);

  // Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedRecords = filteredRecords.slice(startIndex, endIndex);

  return NextResponse.json({
    data: paginatedRecords,
    pagination: {
      page,
      limit,
      total: filteredRecords.length,
      totalPages: Math.ceil(filteredRecords.length / limit)
    },
    filters: {
      categories,
      frequencies
    }
  });
}
