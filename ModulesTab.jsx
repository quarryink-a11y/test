import React from 'react';
import { Monitor } from 'lucide-react';
import ConsultationForm from '@/components/consultation/ConsultationForm';

export default function ConsultationFormTab() {
  return (
    <div>
      {/* Info banner */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <Monitor className="w-4 h-4 text-blue-500" />
          <p className="font-semibold text-sm text-gray-900">Consultation Form Preview</p>
        </div>
        <p className="text-xs text-gray-500">
          This is how your consultation form looks on your website.<br />
          Clients fill it out and their inquiries appear in your Analytics. 
        </p>
      </div>

      {/* Preview */}
      <div className="border border-gray-200 rounded-2xl p-6 bg-white">
        <ConsultationForm preview={true} />
      </div>
    </div>
  );
}