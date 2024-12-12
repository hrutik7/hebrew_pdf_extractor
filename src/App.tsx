import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { TableView } from './components/TableView';
import { AdditionalText } from './components/AdditionalText';
import { ExtractedContent } from './types/Table';
import { extractTablesFromPDF } from './services/api';
import { Loader2 } from 'lucide-react';

function App() {
  const [loading, setLoading] = useState(false);
  const [extractedContent, setExtractedContent] = useState<ExtractedContent | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (file: File) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await extractTablesFromPDF(file);
      setExtractedContent(result);
    } catch (err) {
      setError('Failed to process PDF. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">PDF Table Extractor</h1>
          <p className="text-lg text-gray-600">
            Upload your PDF to extract and view tables while preserving their structure
          </p>
        </div>

        {!extractedContent && !loading && (
          <div className="max-w-xl mx-auto">
            <FileUpload onFileSelect={handleFileSelect} />
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <span className="ml-2 text-gray-600">Processing PDF...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 my-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {extractedContent && (
          <div className="space-y-8">
            {extractedContent.tables.map((table, index) => (
              <div key={index} className="bg-white shadow rounded-lg p-6">
                <TableView table={table} />
              </div>
            ))}
            <AdditionalText texts={extractedContent.additionalText} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;