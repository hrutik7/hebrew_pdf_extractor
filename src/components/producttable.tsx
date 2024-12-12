import React from "react";

const ProductTable = () => {
  const products = [
    { code: "GT-1315-10", description: "GT-", location: "A1", barcode: "1234567890", quantity: 10, price: "$100" },
    { code: "GT-1315-12", description: "GT-", location: "A2", barcode: "1234567891", quantity: 12, price: "$120" },
    { code: "GT-1315-14", description: "GT-", location: "A3", barcode: "1234567892", quantity: 14, price: "$140" },
    { code: "GT-1315-59", description: "GT-", location: "B1", barcode: "1234567893", quantity: 59, price: "$590" },
    { code: "GT-1537-6", description: "GT-", location: "B2", barcode: "1234567894", quantity: 6, price: "$60" },
    // Add more rows as needed
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Product Table</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">No.</th>
              <th className="border border-gray-300 px-4 py-2">Product Code</th>
              <th className="border border-gray-300 px-4 py-2">Item Description</th>
              <th className="border border-gray-300 px-4 py-2">Location</th>
              <th className="border border-gray-300 px-4 py-2">Barcode</th>
              <th className="border border-gray-300 px-4 py-2">Quantity</th>
              <th className="border border-gray-300 px-4 py-2">Price</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2 text-center">{index + 1}</td>
                <td className="border border-gray-300 px-4 py-2">{product.code}</td>
                <td className="border border-gray-300 px-4 py-2">{product.description}</td>
                <td className="border border-gray-300 px-4 py-2">{product.location}</td>
                <td className="border border-gray-300 px-4 py-2">{product.barcode}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">{product.quantity}</td>
                <td className="border border-gray-300 px-4 py-2 text-right">{product.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductTable;
