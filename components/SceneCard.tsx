
import React, { useState, useCallback } from 'react';
import type { Scene } from '../types';
import CopyIcon from './icons/CopyIcon';
import { useI18n } from '../contexts/I18nContext';

interface SceneCardProps {
  scene: Scene;
}

const SceneCard: React.FC<SceneCardProps> = ({ scene }) => {
  const [copied, setCopied] = useState(false);
  const { t } = useI18n();

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(scene.imagePrompt).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [scene.imagePrompt]);

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-lg transition-all duration-300 hover:shadow-cyan-500/20 hover:border-cyan-500/50">
      <h3 className="text-2xl font-bold text-cyan-400 mb-4">
        {t('sceneCardTitle')} {scene.sceneNumber}
      </h3>
      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">{t('sceneCardOriginalText')}</h4>
          <p className="text-gray-300 bg-black/20 p-3 rounded-md border border-gray-700/50 italic">
            {scene.originalText}
          </p>
        </div>
        {scene.translatedText && (
          <div>
            <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">{t('sceneCardTranslatedText')}</h4>
            <p className="text-gray-300 bg-black/20 p-3 rounded-md border border-gray-700/50">
              {scene.translatedText}
            </p>
          </div>
        )}
        <div>
          <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">{t('sceneCardVisualIdea')}</h4>
          <p className="text-gray-300">{scene.visualDescription}</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">{t('sceneCardImagePrompt')}</h4>
          <div className="relative bg-gray-900 rounded-md p-4 border border-gray-700">
            <p className="text-cyan-200 font-mono text-sm leading-relaxed pr-12">
              {scene.imagePrompt}
            </p>
            <button
              onClick={handleCopy}
              className="absolute top-3 right-3 p-2 text-gray-400 bg-gray-800 rounded-md hover:bg-gray-700 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500"
              aria-label="Copy prompt"
            >
              {copied ? (
                 <span className="text-xs font-bold text-cyan-400">{t('copiedButton')}</span>
              ) : (
                <CopyIcon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SceneCard;