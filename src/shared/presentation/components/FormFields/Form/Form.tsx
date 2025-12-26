import React from 'react';

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  submit?: () => void;
}

export default function Form({ submit, onSubmit, children, ...rest }: FormProps) {
  const handle = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (typeof submit === 'function') {
      submit();
      return;
    }
    if (typeof onSubmit === 'function') {
      onSubmit(e);
    }
  };

  return (
    <form onSubmit={handle} {...rest}>
      {children}
    </form>
  );
}