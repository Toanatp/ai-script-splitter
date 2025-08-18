
import React from 'react';
import { useI18n } from '../contexts/I18nContext';

interface DonateModalProps {
  onClose: () => void;
}

const DonateModal: React.FC<DonateModalProps> = ({ onClose }) => {
  const { t } = useI18n();

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50" onClick={onClose}>
      <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-sm border border-gray-700 text-center" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-cyan-400 mb-4">{t('donateModalTitle')}</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-300 mb-2">{t('donateBankQrLabel')}</h3>
            <img
              src="https://i.ibb.co/tM96XVnY/1755513678940.png"
              alt="Bank Transfer QR Code"
              className="mx-auto rounded-lg border-4 border-gray-700 bg-white"
              style={{ maxWidth: '250px', width: '100%' }}
            />
          </div>
          <div>
            <a
              href="https://www.paypal.com/ncp/payment/VKJ3SSK6FDTXG"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-full px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {t('donatePaypalButton')}
            </a>
          </div>
        </div>
        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600 transition-colors"
          >
            {t('closeButton')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DonateModal;
