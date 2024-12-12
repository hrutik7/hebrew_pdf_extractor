import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { Loader2 } from 'lucide-react';
import { extractTablesFromPDF } from './services/api';

function App() {
  const [loading, setLoading] = useState(false);
  const [extractedContent, setExtractedContent] = useState(null);
  const [error, setError] = useState<string | null>(null);
  const [productsData, setProductsData] = useState<any[]>([]);

  const handleFileSelect = async (file: File) => {
    setLoading(true);
    setError(null);
    try {
      const result:any = await extractTablesFromPDF(file); // Assuming this returns the extracted tables
      console.log(result, 'Extracted Content');
      
      // Assuming the result contains an array of products
      setProductsData(result?.data || []);
      console.log(result?.data,"asdasd")
      setExtractedContent(result);
    } catch (err) {
      setError('Failed to process PDF. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const ProductTable = () => {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Product Table</h1>
        {productsData.length === 0 ? (
          <p className="text-gray-600">No products to display. Please upload a valid PDF.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2">לא.</th>
                  <th className="border border-gray-300 px-4 py-2">קוד מוצר
                  </th>
                  <th className="border border-gray-300 px-4 py-2">תיאור פריט
                  </th>
                  <th className="border border-gray-300 px-4 py-2">מיקום</th>
                  <th className="border border-gray-300 px-4 py-2">ברקוד</th>
                  <th className="border border-gray-300 px-4 py-2">כמות</th>
                  <th className="border border-gray-300 px-4 py-2">מחיר</th>
                </tr>
              </thead>
              <tbody>
                {productsData.map((product, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 text-center">{index + 1}</td>
                    <td className="border border-gray-300 px-4 py-2">{product.Product_Code}</td>
                    <td className="border border-gray-300 px-4 py-2">{product.Item_Description}</td>
                    <td className="border border-gray-300 px-4 py-2">{product.Location}</td>
                    <td className="border border-gray-300 px-4 py-2">{product.Barcode}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">{product.Quantity}</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">{product.Price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
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

        {productsData.length > 0 && <ProductTable />}
      </div>
    </div>
  );
}

export default App;
