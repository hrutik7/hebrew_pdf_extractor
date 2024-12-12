import React from 'react';

interface AdditionalTextProps {
  texts: string[];
}

export const AdditionalText: React.FC<AdditionalTextProps> = ({ texts }) => {
  if (texts.length === 0) return null;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Additional Text</h3>
      {texts.map((text, index) => (
        <p key={index} className="text-gray-700 mb-2">{text}</p>
      ))}
    </div>
  );
};