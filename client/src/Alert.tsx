import React from 'react';
import './Alert.css';

type AlertProps = {
  message: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export const Alert: React.FC<AlertProps> = ({ message, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="alert-main">
        <span className="alert-message">{message}</span>
        <button className="alert-button" onClick={onClose}>
        Close
        </button>
    </div>
  );
};