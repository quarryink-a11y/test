import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

export default function AdminSuccessDialog({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center">
        <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-7 h-7 text-green-500" />
        </div>
        <h2 className="text-lg font-bold text-gray-900 mb-2">IT'S DONE!</h2>
        <p className="text-sm text-gray-500 mb-6">
          You're fully in control again, and<br />everything's still running smoothly 😌
        </p>
        <Button variant="outline" onClick={onClose} className="rounded-full px-8">Back</Button>
      </div>
    </div>
  );
}