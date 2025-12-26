import React from 'react';

export default function InputField({ label, type='text', value, onChange, placeholder, required, minLength }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{ fontWeight: 500 }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        minLength={minLength}
        style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
      />
    </div>
  );
}
