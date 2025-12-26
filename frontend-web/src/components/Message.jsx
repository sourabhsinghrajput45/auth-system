import React from 'react';

export function SuccessMessage({ message }) {
  return message ? (
    <div style={{ padding: '10px', backgroundColor: '#d1fae5', color: '#065f46', borderRadius: '6px' }}>
      {message}
    </div>
  ) : null;
}

export function ErrorMessage({ message }) {
  return message ? (
    <div style={{ padding: '10px', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '6px' }}>
      {message}
    </div>
  ) : null;
}
