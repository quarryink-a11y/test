import React, { useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import PhoneInput from '@/components/contacts/PhoneInput';

const MODULES = ['Portfolio', 'Designs', 'Events', 'Reviews', 'Contacts'];

export default function AdminForm({ admin, onSave, onCancel }) {
  const isEdit = !!admin;
  const [form, setForm] = useState({
    first_name: admin?.first_name || '',
    last_name: admin?.last_name || '',
    email: admin?.email || '',
    phone_code: admin?.phone_code || '+1',
    phone_country_id: admin?.phone_country_id || 'us',
    phone_number: admin?.phone_number || '',
    password: '',
    repeat_password: '',
    modules: admin?.modules || [],
  });
  const [showPass, setShowPass] = useState(false);
  const [showRepeat, setShowRepeat] = useState(false);
  const [saving, setSaving] = useState(false);

  const toggleModule = (mod) => {
    setForm(p => ({
      ...p,
      modules: p.modules.includes(mod)
        ? p.modules.filter(m => m !== mod)
        : [...p.modules, mod]
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  return (
    <div className="bg-blue-50/50 rounded-2xl p-6 relative">
      <button onClick={onCancel} className="absolute top-4 right-4 w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center hover:bg-blue-600 transition-colors">
        <X className="w-4 h-4 text-white" />
      </button>

      <div className="space-y-4">
        {/* Name */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500 mb-1.5">First name</p>
            <Input value={form.first_name} onChange={e => setForm(p => ({ ...p, first_name: e.target.value }))}
              placeholder="Enter first name" className="bg-white rounded-xl border-gray-200" />
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1.5">Last name</p>
            <Input value={form.last_name} onChange={e => setForm(p => ({ ...p, last_name: e.target.value }))}
              placeholder="Enter last name" className="bg-white rounded-xl border-gray-200" />
          </div>
        </div>

        {/* Email + Phone */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500 mb-1.5">Email</p>
            <Input value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              placeholder="Enter email" className="bg-white rounded-xl border-gray-200" disabled={isEdit} />
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1.5">Phone number</p>
            <PhoneInput
              code={form.phone_code}
              countryId={form.phone_country_id}
              number={form.phone_number}
              onCodeChange={(code, id) => setForm(p => ({ ...p, phone_code: code, phone_country_id: id }))}
              onNumberChange={v => setForm(p => ({ ...p, phone_number: v }))}
            />
          </div>
        </div>

        {/* Password */}
        {!isEdit && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-1.5">Password</p>
              <div className="relative">
                <Input type={showPass ? 'text' : 'password'} value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  placeholder="Type the password" className="bg-white rounded-xl border-gray-200 pr-10" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1.5">Repeat password</p>
              <div className="relative">
                <Input type={showRepeat ? 'text' : 'password'} value={form.repeat_password}
                  onChange={e => setForm(p => ({ ...p, repeat_password: e.target.value }))}
                  placeholder="Type the password" className="bg-white rounded-xl border-gray-200 pr-10" />
                <button type="button" onClick={() => setShowRepeat(!showRepeat)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showRepeat ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Access to modules */}
        <div>
          <p className="text-sm text-gray-500 mb-1.5">Access to modules</p>
          <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
            {MODULES.map(mod => (
              <label key={mod} className="flex items-center gap-3 cursor-pointer">
                <Checkbox
                  checked={form.modules.includes(mod)}
                  onCheckedChange={() => toggleModule(mod)}
                  className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                />
                <span className="text-sm text-gray-700">{mod}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-center gap-3 pt-6">
        {isEdit ? (
          <>
            <Button variant="outline" onClick={onCancel} className="rounded-full px-8 border-blue-200 text-blue-600 hover:bg-blue-50">Cancel</Button>
            <Button onClick={handleSave} disabled={saving} className="bg-red-500 hover:bg-red-600 rounded-full px-8">
              {saving ? 'Saving...' : 'Save changes'}
            </Button>
          </>
        ) : (
          <Button onClick={handleSave} disabled={saving} className="bg-blue-500 hover:bg-blue-600 rounded-full px-10">
            {saving ? 'Saving...' : 'Save'}
          </Button>
        )}
      </div>
    </div>
  );
}