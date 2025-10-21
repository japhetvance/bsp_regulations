'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import ReportCard from '@/components/ReportCard';
import SearchFilters from '@/components/SearchFilters';
import Pagination from '@/components/Pagination';

interface Report {
  Category: string;
  'Form No.': string;
  'MOR Ref.': string;
  'Report Title': string;
  Frequency: string;
  'Submission Deadline': string;
  'Submission Procedure / E-mail Address': string;
}

interface ApiResponse {
  data: Report[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: {
    categories: string[];
    frequencies: string[];
  };
}

export default function BSPReportsDashboard() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFrequency, setSelectedFrequency] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalReports, setTotalReports] = useState(0);
  const [categories, setCategories] = useState<string[]>([]);
  const [frequencies, setFrequencies] = useState<string[]>([]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search: searchTerm,
        category: selectedCategory,
        frequency: selectedFrequency,
        page: currentPage.toString(),
        limit: '20'
      });

      const response = await fetch(`/api/reports?${params}`);
      const data: ApiResponse = await response.json();
      
      setReports(data.data);
      setTotalPages(data.pagination.totalPages);
      setTotalReports(data.pagination.total);
      setCategories(data.filters.categories);
      setFrequencies(data.filters.frequencies);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [searchTerm, selectedCategory, selectedFrequency, currentPage]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchReports();
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleFrequencyChange = (frequency: string) => {
    setSelectedFrequency(frequency);
    setCurrentPage(1);
  };


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">BSP Regulatory Reports Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage and track Bangko Sentral ng Pilipinas regulatory reports</p>
            </div>
            <div className="text-sm text-gray-500">
              Last updated: {format(new Date(), 'MMM dd, yyyy')}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <SearchFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={handleCategoryChange}
          selectedFrequency={selectedFrequency}
          setSelectedFrequency={handleFrequencyChange}
          categories={categories}
          frequencies={frequencies}
          onSearch={handleSearch}
        />

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {reports.length} of {totalReports} reports
            {searchTerm && ` for "${searchTerm}"`}
            {selectedCategory !== 'all' && ` in ${selectedCategory}`}
            {selectedFrequency !== 'all' && ` with ${selectedFrequency} frequency`}
          </p>
        </div>

        {/* Reports Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reports.map((report, index) => (
              <ReportCard key={index} report={report} />
            ))}
          </div>
        )}

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

        {reports.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No reports found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
