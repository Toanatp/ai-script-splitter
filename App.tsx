
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import * as XLSX from 'xlsx';
import { Document, Packer, Paragraph } from 'docx';
import { breakdownScript } from './services/geminiService';
import type { Scene, ThemeOption, Option as AspectRatioOption, StyleOption } from './types';
import SceneCard from './components/SceneCard';
import Spinner from './components/Spinner';
import SparklesIcon from './components/icons/SparklesIcon';
import DownloadIcon from './components/icons/DownloadIcon';
import FileTextIcon from './components/icons/FileTextIcon';
import KeyIcon from './components/icons/KeyIcon';
import InfoIcon from './components/icons/InfoIcon';
import { useI18n } from './contexts/I18nContext';
import LanguageSwitcher from './components/LanguageSwitcher';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';


// --- DỮ LIỆU MẶC ĐỊNH (RAW DATA)---
const DEFAULT_THEME_DATA = [
    { id: 'storytelling', wps: 2.3 }, { id: 'news', wps: 2.7 }, { id: 'science', wps: 2.1 },
    { id: 'tutorial', wps: 2.0 }, { id: 'vlog', wps: 2.4 }, { id: 'gaming', wps: 2.8 },
    { id: 'documentary', wps: 2.0 }, { id: 'comedy', wps: 2.6 }, { id: 'review', wps: 2.5 },
    { id: 'meditation', wps: 1.5 }, { id: 'podcast', wps: 2.4 }, { id: 'finance', wps: 2.2 },
    { id: 'history', wps: 2.1 }, { id: 'cooking', wps: 2.2 }, { id: 'travel', wps: 2.4 },
    { id: 'fitness', wps: 2.3 }, { id: 'tech', wps: 2.5 }, { id: 'asmr', wps: 1.7 },
    { id: 'kids', wps: 2.0 }, { id: 'philosophy', wps: 1.9 }, { id: 'horror', wps: 2.2 },
];

const DEFAULT_ASPECT_RATIO_DATA = [
    { id: '16:9', value: '16:9' }, { id: '9:16', value: '9:16' },
    { id: '1:1', value: '1:1' }, { id: '4:3', value: '4:3' },
];

const DEFAULT_STYLE_DATA = [
    { id: 'automatic' }, { id: 'photorealistic' }, { id: 'anime_ghibli' }, 
    { id: 'cyberpunk' }, { id: 'fantasy_art' }, { id: 'watercolor' },
];

// --- COMPONENT MODAL TÙY CHỈNH ---
interface CustomOptionModalProps {
    mode: 'theme' | 'ratio' | 'style';
    onClose: () => void;
    onSave: (data: any) => void;
    t: (key: string) => string;
}

const CustomOptionModal: React.FC<CustomOptionModalProps> = ({ mode, onClose, onSave, t }) => {
    const [name, setName] = useState('');
    const [value, setValue] = useState('');
    const [wps, setWps] = useState(2.3);
    const [promptText, setPromptText] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        let data;
        switch (mode) {
            case 'theme':
                data = { name, wps: parseFloat(wps.toString()) };
                if (!name || isNaN(data.wps)) return;
                break;
            case 'ratio':
                data = { name, value };
                 if (!name || !value.match(/^\d+:\d+$/)) {
                    alert(t('errorInvalidRatioFormat'));
                    return;
                }
                break;
            case 'style':
                data = { name, prompt: promptText };
                if (!name || !promptText) return;
                break;
        }
        onSave(data);
    };

    const titles = {
        theme: t('modalTitleTheme'),
        ratio: t('modalTitleRatio'),
        style: t('modalTitleStyle'),
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md border border-gray-700" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold text-cyan-400 mb-4">{titles[mode]}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">{t('modalDisplayNameLabel')}</label>
                        <input value={name} onChange={e => setName(e.target.value)} placeholder={t('modalDisplayNamePlaceholder')} className="w-full bg-gray-900 border border-gray-700 rounded-md p-2 text-gray-200 focus:ring-2 focus:ring-cyan-500" required />
                    </div>
                    {mode === 'theme' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">{t('modalWpsLabel')}</label>
                            <input type="number" step="0.1" value={wps} onChange={e => setWps(parseFloat(e.target.value))} className="w-full bg-gray-900 border border-gray-700 rounded-md p-2 text-gray-200 focus:ring-2 focus:ring-cyan-500" required />
                        </div>
                    )}
                    {mode === 'ratio' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">{t('modalRatioValueLabel')}</label>
                            <input value={value} onChange={e => setValue(e.target.value)} placeholder={t('modalRatioValuePlaceholder')} className="w-full bg-gray-900 border border-gray-700 rounded-md p-2 text-gray-200 focus:ring-2 focus:ring-cyan-500" required />
                        </div>
                    )}
                    {mode === 'style' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">{t('modalStylePromptLabel')}</label>
                            <textarea value={promptText} onChange={e => setPromptText(e.target.value)} placeholder={t('modalStylePromptPlaceholder')} className="w-full h-24 bg-gray-900 border border-gray-700 rounded-md p-2 text-gray-200 resize-y focus:ring-2 focus:ring-cyan-500" required />
                        </div>
                    )}
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-md text-gray-300 hover:bg-gray-700 transition-colors">{t('cancelButton')}</button>
                        <button type="submit" className="px-4 py-2 rounded-md bg-cyan-600 text-white font-semibold hover:bg-cyan-700 transition-colors">{t('saveButton')}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const SignedOutView = () => {
    const { t } = useI18n();
    return (
        <div className="text-center py-20 flex flex-col items-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-200">{t('signInTitle')}</h2>
            <p className="mt-4 text-lg text-gray-400 max-w-2xl">{t('signInCTA')}</p>
            <div className="mt-8">
                 {/* The UserButton will render a "Sign In" button */}
                 <UserButton afterSignOutUrl="/" />
            </div>
        </div>
    );
};


const MainAppView = () => {
  const { t, language } = useI18n();
  
  const [apiKey, setApiKey] = useState<string>('');
  const [script, setScript] = useState<string>('');
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [duration, setDuration] = useState<number>(10);
  const [characterDefinitions, setCharacterDefinitions] = useState<string>('');
  
  const [customThemes, setCustomThemes] = useState<ThemeOption[]>([]);
  const [customRatios, setCustomRatios] = useState<AspectRatioOption[]>([]);
  const [customStyles, setCustomStyles] = useState<StyleOption[]>([]);

  const [selectedThemeId, setSelectedThemeId] = useState<string>('storytelling');
  const [selectedAspectRatioId, setSelectedAspectRatioId] = useState<string>('16:9');
  const [selectedStyleId, setSelectedStyleId] = useState<string>('automatic');

  const [modalMode, setModalMode] = useState<'theme' | 'ratio' | 'style' | null>(null);
  
  useEffect(() => {
    setScript(t('placeholderScript'));
    setCharacterDefinitions(t('placeholderCharacters'));
  }, [t]);

  useEffect(() => {
    try {
      const savedKey = localStorage.getItem('gemini-api-key');
      if (savedKey) {
          setApiKey(savedKey);
      }
      setCustomThemes(JSON.parse(localStorage.getItem('customThemes') || '[]'));
      setCustomRatios(JSON.parse(localStorage.getItem('customRatios') || '[]'));
      setCustomStyles(JSON.parse(localStorage.getItem('customStyles') || '[]'));
    } catch (e) {
      console.error("Failed to load settings from localStorage", e);
    }
  }, []);

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newKey = e.target.value;
    setApiKey(newKey);
    localStorage.setItem('gemini-api-key', newKey);
  };
  
  const themeOptions = useMemo(() => [
      ...DEFAULT_THEME_DATA.map(theme => ({ ...theme, name: t(`theme_${theme.id}`)})),
      ...customThemes.map(theme => ({ ...theme, name: `${theme.name} (${t('customOptionSuffix')})`}))
  ], [t, customThemes]);

  const aspectRatioOptions = useMemo(() => [
      ...DEFAULT_ASPECT_RATIO_DATA.map(ratio => ({ ...ratio, name: t(`ratio_${ratio.id}`)})),
      ...customRatios.map(ratio => ({ ...ratio, name: `${ratio.name} (${t('customOptionSuffix')})`}))
  ], [t, customRatios]);

  const styleOptions = useMemo(() => [
        ...DEFAULT_STYLE_DATA.map(style => ({
            id: style.id,
            name: t(`style_${style.id}`),
            prompt: t(`style_prompt_${style.id}`)
        })),
        ...customStyles.map(style => ({ ...style, name: `${style.name} (${t('customOptionSuffix')})`}))
  ], [t, customStyles]);


  const handleSelectionChange = (type: 'theme' | 'ratio' | 'style', value: string) => {
     if (value === 'add_new') {
        setModalMode(type);
     } else {
        if (type === 'theme') setSelectedThemeId(value);
        if (type === 'ratio') setSelectedAspectRatioId(value);
        if (type === 'style') setSelectedStyleId(value);
     }
  };

  const handleSaveCustomOption = (data: any) => {
    const id = `custom-${modalMode}-${Date.now()}`;
    const newOption = { ...data, id, isCustom: true };

    if (modalMode === 'theme') {
      const updated = [...customThemes, newOption];
      setCustomThemes(updated);
      setSelectedThemeId(id);
      localStorage.setItem('customThemes', JSON.stringify(updated));
    } else if (modalMode === 'ratio') {
      const updated = [...customRatios, newOption];
      setCustomRatios(updated);
      setSelectedAspectRatioId(id);
      localStorage.setItem('customRatios', JSON.stringify(updated));
    } else if (modalMode === 'style') {
      const updated = [...customStyles, newOption];
      setCustomStyles(updated);
      setSelectedStyleId(id);
      localStorage.setItem('customStyles', JSON.stringify(updated));
    }
    setModalMode(null);
  };

  const selectedTheme = useMemo(() => themeOptions.find(t => t.id === selectedThemeId)!, [themeOptions, selectedThemeId]);
  const selectedAspectRatio = useMemo(() => aspectRatioOptions.find(r => r.id === selectedAspectRatioId)!, [aspectRatioOptions, selectedAspectRatioId]);
  const selectedStyle = useMemo(() => styleOptions.find(s => s.id === selectedStyleId)!, [styleOptions, selectedStyleId]);


  const handleGenerate = useCallback(async () => {
    if (!apiKey.trim()) {
      setError(t('errorApiKeyMissing'));
      return;
    }
    if (!script.trim()) {
      setError(t('errorScriptRequired'));
      return;
    }
    if (!selectedTheme || !selectedAspectRatio || !selectedStyle) {
      setError(t('errorOptionsMissing'));
      return;
    }
    setIsLoading(true);
    setError(null);
    setScenes([]);

    try {
      const result = await breakdownScript(
        apiKey,
        script, 
        duration, 
        selectedTheme.name, 
        selectedTheme.wps, 
        selectedAspectRatio.value, 
        selectedStyle.prompt, 
        characterDefinitions, 
        language,
        t('errorApiKeyMissing'),
        t('errorInvalidResponse'),
        t('errorUnknown')
      );
      setScenes(result);
    } catch (e: unknown) {
      if (e instanceof Error) { setError(e.message); } 
      else { setError(t('errorUnknown')); }
    } finally {
      setIsLoading(false);
    }
  }, [apiKey, script, duration, selectedTheme, selectedAspectRatio, selectedStyle, characterDefinitions, language, t]);
  
  const handleDownloadXLSX = useCallback(() => {
    if (scenes.length === 0) return;
    const dataForSheet = scenes.map(scene => ({
        [t('xlsxHeaderSceneNumber')]: scene.sceneNumber, 
        [t('xlsxHeaderOriginalText')]: scene.originalText,
        [t('xlsxHeaderVisualDesc')]: scene.visualDescription, 
        [t('xlsxHeaderImagePrompt')]: scene.imagePrompt,
    }));
    const worksheet = XLSX.utils.json_to_sheet(dataForSheet);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, t('xlsxSheetName'));
    worksheet["!cols"] = [ { wch: 10 }, { wch: 60 }, { wch: 50 }, { wch: 70 } ];
    XLSX.writeFile(workbook, `${t('xlsxFileName')}.xlsx`);
  }, [scenes, t]);

  const handleDownloadTXT = useCallback(() => {
    if (scenes.length === 0) return;
    const content = scenes.map(scene => scene.originalText).join('\n\n');
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${t('txtFileName')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [scenes, t]);

  const handleDownloadDOCX = useCallback(() => {
    if (scenes.length === 0) return;

    const paragraphs = scenes.flatMap(scene => [
      new Paragraph({ text: scene.originalText }),
      new Paragraph({ text: "" }) // Blank line
    ]);
    if (paragraphs.length > 0) paragraphs.pop(); // Remove last blank line

    const doc = new Document({
        sections: [{ children: paragraphs }],
    });

    Packer.toBlob(doc).then(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${t('docxFileName')}.docx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
  }, [scenes, t]);

    return (
        <>
            {modalMode && <CustomOptionModal mode={modalMode} onClose={() => setModalMode(null)} onSave={handleSaveCustomOption} t={t} />}
            <div className="text-center mb-10">
                <p className="mt-4 text-lg text-gray-400 max-w-3xl mx-auto">
                    {t('appDescription')}
                </p>
            </div>
            <div className="max-w-4xl mx-auto">
                <div className="bg-gray-800 rounded-lg p-6 shadow-2xl shadow-black/30 space-y-6">
                    <div>
                        <label htmlFor="api-key-input" className="flex items-center text-sm font-medium text-gray-300 mb-2">
                            {t('apiKeyLabel')}
                            <div className="relative group ml-2">
                                <InfoIcon className="w-4 h-4 text-gray-500 cursor-pointer" />
                                <div className="absolute bottom-full mb-2 w-72 p-2 text-xs text-center text-gray-200 bg-gray-900 border border-gray-700 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                    {t('apiKeyTooltip')}
                                </div>
                            </div>
                        </label>
                        <div className="relative">
                            <KeyIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input
                                type="password"
                                id="api-key-input"
                                value={apiKey}
                                onChange={handleApiKeyChange}
                                placeholder={t('apiKeyPlaceholder')}
                                className="w-full bg-gray-900 border border-gray-700 rounded-md p-2 pl-10 text-gray-200 focus:ring-2 focus:ring-cyan-500"
                            />
                        </div>
                    </div>

                    <hr className="border-gray-700" />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-x-6 gap-y-4">
                        <div>
                            <label htmlFor="duration-input" className="block text-sm font-medium text-gray-300 mb-2">{t('durationLabel')}</label>
                            <input type="number" id="duration-input" value={duration} onChange={(e) => setDuration(Math.max(1, parseInt(e.target.value, 10) || 1))} className="w-full bg-gray-900 border border-gray-700 rounded-md p-2 text-gray-200 focus:ring-2 focus:ring-cyan-500" min="1" />
                        </div>
                        <div>
                            <label htmlFor="theme-select" className="block text-sm font-medium text-gray-300 mb-2">{t('themeLabel')}</label>
                            <select id="theme-select" value={selectedThemeId} onChange={(e) => handleSelectionChange('theme', e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-md p-2 text-gray-200 focus:ring-2 focus:ring-cyan-500">
                                {themeOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
                                <option value="add_new" className="font-bold text-cyan-400">{t('addNewOption')}</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="aspect-ratio-select" className="block text-sm font-medium text-gray-300 mb-2">{t('ratioLabel')}</label>
                            <select id="aspect-ratio-select" value={selectedAspectRatioId} onChange={(e) => handleSelectionChange('ratio', e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-md p-2 text-gray-200 focus:ring-2 focus:ring-cyan-500">
                                {aspectRatioOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
                                <option value="add_new" className="font-bold text-cyan-400">{t('addNewRatio')}</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="style-select" className="block text-sm font-medium text-gray-300 mb-2">{t('styleLabel')}</label>
                            <select id="style-select" value={selectedStyleId} onChange={(e) => handleSelectionChange('style', e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-md p-2 text-gray-200 focus:ring-2 focus:ring-cyan-500">
                                {styleOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
                                <option value="add_new" className="font-bold text-cyan-400">{t('addNewStyle')}</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="character-input" className="block text-sm font-medium text-gray-300 mb-2">{t('characterLabel')}</label>
                        <textarea id="character-input" value={characterDefinitions} onChange={(e) => setCharacterDefinitions(e.target.value)} placeholder={t('characterPlaceholder')} className="w-full h-24 bg-gray-900 border border-gray-700 rounded-md p-4 text-gray-200 focus:ring-2 focus:ring-cyan-500 resize-y" />
                    </div>

                    <div>
                        <label htmlFor="script-input" className="block text-sm font-medium text-gray-300 mb-2">{t('scriptLabel')}</label>
                        <textarea id="script-input" value={script} onChange={(e) => setScript(e.target.value)} placeholder={t('scriptPlaceholder')} className="w-full h-64 bg-gray-900 border border-gray-700 rounded-md p-4 text-gray-200 focus:ring-2 focus:ring-cyan-500 resize-y" />
                    </div>

                    <div className="mt-2 flex justify-center">
                        <button onClick={handleGenerate} disabled={isLoading || !apiKey.trim()} className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-full shadow-lg hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-300/50">
                            {isLoading ? (<><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>{t('generatingButton')}</>) : (<><SparklesIcon className="w-5 h-5 mr-2" />{t('generateButton')}</>)}
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-12 max-w-4xl mx-auto">
                {isLoading && <Spinner />}
                {error && (
                    <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg text-center" role="alert">
                        <strong className="font-bold">{t('errorAlertTitle')}</strong><span className="block sm:inline ml-2">{error}</span>
                    </div>
                )}
                {scenes.length > 0 && (
                    <>
                        <div className="mb-8 flex flex-wrap justify-center items-center gap-4">
                            <button onClick={handleDownloadXLSX} className="inline-flex items-center justify-center px-6 py-2 border border-cyan-500 text-cyan-400 font-bold rounded-full hover:bg-cyan-500/10 transition-colors focus:outline-none focus:ring-4 focus:ring-cyan-300/50">
                                <DownloadIcon className="w-5 h-5 mr-2" />{t('downloadXlsxButton')}
                            </button>
                            <button onClick={handleDownloadTXT} className="inline-flex items-center justify-center px-6 py-2 border border-cyan-500 text-cyan-400 font-bold rounded-full hover:bg-cyan-500/10 transition-colors focus:outline-none focus:ring-4 focus:ring-cyan-300/50">
                                <FileTextIcon className="w-5 h-5 mr-2" />{t('downloadTxtButton')}
                            </button>
                            <button onClick={handleDownloadDOCX} className="inline-flex items-center justify-center px-6 py-2 border border-cyan-500 text-cyan-400 font-bold rounded-full hover:bg-cyan-500/10 transition-colors focus:outline-none focus:ring-4 focus:ring-cyan-300/50">
                                <FileTextIcon className="w-5 h-5 mr-2" />{t('downloadDocxButton')}
                            </button>
                        </div>
                        <div className="space-y-8">{scenes.map((scene) => (<SceneCard key={scene.sceneNumber} scene={scene} />))}</div>
                    </>
                )}
                {!isLoading && !error && scenes.length === 0 && (
                    <div className="text-center py-10 text-gray-500">
                        <div className="bg-gray-800/50 border border-dashed border-gray-700 rounded-lg p-8 max-w-lg mx-auto">
                            <h3 className="text-xl font-semibold text-gray-300">{t('readyTitle')}</h3>
                            <p className="mt-2">{t('readyMessage')}</p>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

function App() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <header className="container mx-auto px-4 py-4 flex justify-between items-center border-b border-gray-800">
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            {t('appTitle')}
        </h1>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:py-12">
        <SignedIn>
          <MainAppView />
        </SignedIn>
        <SignedOut>
          <SignedOutView />
        </SignedOut>
      </main>

      <footer className="text-center py-6 text-sm text-gray-600">
        <p dangerouslySetInnerHTML={{ __html: t('footerText') }} />
      </footer>
    </div>
  );
}

export default App;
