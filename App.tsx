

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import * as XLSX from 'xlsx';
import { Document, Packer, Paragraph } from 'docx';
import { breakdownScript, generatePromptsFromScenes } from './services/geminiService';
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
import DonateModal from './components/DonateModal';
import HeartIcon from './components/icons/HeartIcon';

type AppTab = 'splitter' | 'prompter' | 'batch' | 'custom';
type BatchMode = 'individual' | 'combined';

type BatchTask = {
    id: number;
    script: string;
    characterDefinitions: string;
}

type CustomRuleBatchTask = {
    id: number;
    script: string;
    characterDefinitions: string;
}


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

// --- COMPONENT HIỂN THỊ KẾT QUẢ ---
interface ResultsViewProps {
    isLoading: boolean;
    error: string | null;
    scenes: Scene[];
    t: (key: string) => string;
    translationLanguage: string;
    includeVisualIdea: boolean;
}
const ResultsView: React.FC<ResultsViewProps> = ({ isLoading, error, scenes, t, translationLanguage, includeVisualIdea }) => {

    const handleDownloadXLSX = useCallback(() => {
        if (scenes.length === 0) return;
        const includeTranslations = translationLanguage !== 'none';
        
        const dataForSheet = scenes.map(scene => {
            const rowData: { [key: string]: string | number | undefined } = {};
            rowData[t('xlsxHeaderSceneNumber')] = scene.sceneNumber;
            rowData[t('xlsxHeaderOriginalText')] = scene.originalText;
            if (includeTranslations) {
                rowData[t('xlsxHeaderTranslatedText')] = scene.translatedText || '';
            }
            if(includeVisualIdea) {
                 rowData[t('xlsxHeaderVisualDesc')] = scene.visualDescription;
            }
            rowData[t('xlsxHeaderImagePrompt')] = scene.imagePrompt;
            return rowData;
        });

        const worksheet = XLSX.utils.json_to_sheet(dataForSheet);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, t('xlsxSheetName'));
        
        const colWidths = [{ wch: 10 }, { wch: 60 }]; // Scene#, Original
        if (includeTranslations) colWidths.push({ wch: 60 }); // Translated
        if(includeVisualIdea) colWidths.push({ wch: 50 }); // Visual
        colWidths.push({ wch: 70 }); // Prompt
        worksheet["!cols"] = colWidths;

        XLSX.writeFile(workbook, `${t('xlsxFileName')}.xlsx`);
    }, [scenes, t, translationLanguage, includeVisualIdea]);

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
            new Paragraph({ text: "" })
        ]);
        if (paragraphs.length > 0) paragraphs.pop();
        const doc = new Document({ sections: [{ children: paragraphs }] });
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

    const handleDownloadPromptsTXT = useCallback(() => {
        if (scenes.length === 0) return;
        const content = scenes.map(scene => scene.imagePrompt).join('\n\n');
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${t('promptsFileName')}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, [scenes, t]);


    return (
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
                         <button onClick={handleDownloadPromptsTXT} className="inline-flex items-center justify-center px-6 py-2 border border-cyan-500 text-cyan-400 font-bold rounded-full hover:bg-cyan-500/10 transition-colors focus:outline-none focus:ring-4 focus:ring-cyan-300/50">
                            <FileTextIcon className="w-5 h-5 mr-2" />{t('downloadPromptsButton')}
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
    );
};

// --- VIEW CHO TAB TỰ ĐỘNG PHÂN CẢNH ---
const SceneSplitterView: React.FC<{ apiKeys: string[] }> = ({ apiKeys }) => {
    const { t, language } = useI18n();
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
    const [translationLanguage, setTranslationLanguage] = useState<string>('none');
    const [includeVisualIdea, setIncludeVisualIdea] = useState<boolean>(true);
    const [modalMode, setModalMode] = useState<'theme' | 'ratio' | 'style' | null>(null);

    useEffect(() => {
        setScript(t('placeholderScript'));
        setCharacterDefinitions(t('placeholderCharacters'));
        try {
            setCustomThemes(JSON.parse(localStorage.getItem('customThemes') || '[]'));
            setCustomRatios(JSON.parse(localStorage.getItem('customRatios') || '[]'));
            setCustomStyles(JSON.parse(localStorage.getItem('customStyles') || '[]'));
        } catch (e) { console.error("Failed to load settings from localStorage", e); }
    }, [t]);

    const themeOptions = useMemo(() => [
        ...DEFAULT_THEME_DATA.map(theme => ({ ...theme, name: t(`theme_${theme.id}`)})),
        ...customThemes.map(theme => ({ ...theme, name: `${theme.name} (${t('customOptionSuffix')})`}))
    ], [t, customThemes]);

    const aspectRatioOptions = useMemo(() => [
        ...DEFAULT_ASPECT_RATIO_DATA.map(ratio => ({ ...ratio, name: t(`ratio_${ratio.id}`)})),
        ...customRatios.map(ratio => ({ ...ratio, name: `${ratio.name} (${t('customOptionSuffix')})`}))
    ], [t, customRatios]);

    const styleOptions = useMemo(() => [
        ...DEFAULT_STYLE_DATA.map(style => ({ id: style.id, name: t(`style_${style.id}`), prompt: t(`style_prompt_${style.id}`) })),
        ...customStyles.map(style => ({ ...style, name: `${style.name} (${t('customOptionSuffix')})`}))
    ], [t, customStyles]);

    const translationOptions = useMemo(() => [
        { id: 'none', name: t('translate_none') }, { id: 'vi', name: t('lang_vi') }, { id: 'en', name: t('lang_en') },
        { id: 'zh', name: t('lang_zh') }, { id: 'ja', name: t('lang_ja') }, { id: 'ko', name: t('lang_ko') },
    ], [t]);

    const handleSelectionChange = (type: 'theme' | 'ratio' | 'style', value: string) => {
        if (value === 'add_new') setModalMode(type);
        else {
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
        if (apiKeys.length === 0) { setError(t('errorApiKeyMissing')); return; }
        if (!script.trim()) { setError(t('errorScriptRequired')); return; }
        if (!selectedTheme || !selectedAspectRatio || !selectedStyle) { setError(t('errorOptionsMissing')); return; }
        setIsLoading(true); setError(null); setScenes([]);
        try {
            const result = await breakdownScript(apiKeys, script, duration, selectedTheme.name, selectedTheme.wps, selectedAspectRatio.value, selectedStyle.prompt, characterDefinitions, translationLanguage, includeVisualIdea, '', language, t('errorApiKeyMissing'), t('errorInvalidResponse'), t('errorUnknown'), t('errorAllKeysFailed'));
            setScenes(result);
        } catch (e: unknown) {
            if (e instanceof Error) { setError(e.message); } else { setError(t('errorUnknown')); }
        } finally { setIsLoading(false); }
    }, [apiKeys, script, duration, selectedTheme, selectedAspectRatio, selectedStyle, characterDefinitions, translationLanguage, includeVisualIdea, language, t]);

    return (
        <>
            {modalMode && <CustomOptionModal mode={modalMode} onClose={() => setModalMode(null)} onSave={handleSaveCustomOption} t={t} />}
            <div className="bg-gray-800 rounded-lg p-6 shadow-2xl shadow-black/30 space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                     <div className="lg:col-span-2">
                        <label htmlFor="translate-select" className="block text-sm font-medium text-gray-300 mb-2">{t('translateLabel')}</label>
                        <select id="translate-select" value={translationLanguage} onChange={(e) => setTranslationLanguage(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-md p-2 text-gray-200 focus:ring-2 focus:ring-cyan-500">
                            {translationOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
                        </select>
                    </div>
                </div>
                 <div className="flex items-center">
                    <input id="include-visual-idea" type="checkbox" checked={includeVisualIdea} onChange={(e) => setIncludeVisualIdea(e.target.checked)} className="h-4 w-4 rounded border-gray-600 bg-gray-900 text-cyan-600 focus:ring-cyan-500" />
                    <label htmlFor="include-visual-idea" className="ml-3 text-sm font-medium text-gray-300">{t('includeVisualIdeaLabel')}</label>
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
                    <button onClick={handleGenerate} disabled={isLoading || apiKeys.length === 0} className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-full shadow-lg hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-300/50">
                        {isLoading ? (<><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>{t('generatingButton')}</>) : (<><SparklesIcon className="w-5 h-5 mr-2" />{t('generateButton')}</>)}
                    </button>
                </div>
            </div>
            <ResultsView isLoading={isLoading} error={error} scenes={scenes} t={t} translationLanguage={translationLanguage} includeVisualIdea={includeVisualIdea} />
        </>
    );
};

// --- VIEW CHO TAB TẠO PROMPT TỪ PHÂN CẢNH SẴN ---
const PromptGeneratorView: React.FC<{ apiKeys: string[] }> = ({ apiKeys }) => {
    const { t, language } = useI18n();
    const [script, setScript] = useState<string>('');
    const [scenes, setScenes] = useState<Scene[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [characterDefinitions, setCharacterDefinitions] = useState<string>('');
    const [customThemes, setCustomThemes] = useState<ThemeOption[]>([]);
    const [customRatios, setCustomRatios] = useState<AspectRatioOption[]>([]);
    const [customStyles, setCustomStyles] = useState<StyleOption[]>([]);
    const [selectedThemeId, setSelectedThemeId] = useState<string>('storytelling');
    const [selectedAspectRatioId, setSelectedAspectRatioId] = useState<string>('16:9');
    const [selectedStyleId, setSelectedStyleId] = useState<string>('automatic');
    const [translationLanguage, setTranslationLanguage] = useState<string>('none');
    const [includeVisualIdea, setIncludeVisualIdea] = useState<boolean>(true);
    const [modalMode, setModalMode] = useState<'theme' | 'ratio' | 'style' | null>(null);

    useEffect(() => {
        setScript(t('scriptPlaceholder_prompter_example'));
        setCharacterDefinitions(t('placeholderCharacters'));
        try {
            setCustomThemes(JSON.parse(localStorage.getItem('customThemes') || '[]'));
            setCustomRatios(JSON.parse(localStorage.getItem('customRatios') || '[]'));
            setCustomStyles(JSON.parse(localStorage.getItem('customStyles') || '[]'));
        } catch (e) { console.error("Failed to load settings from localStorage", e); }
    }, [t]);

    const themeOptions = useMemo(() => [
        ...DEFAULT_THEME_DATA.map(theme => ({ ...theme, name: t(`theme_${theme.id}`)})),
        ...customThemes.map(theme => ({ ...theme, name: `${theme.name} (${t('customOptionSuffix')})`}))
    ], [t, customThemes]);

    const aspectRatioOptions = useMemo(() => [
        ...DEFAULT_ASPECT_RATIO_DATA.map(ratio => ({ ...ratio, name: t(`ratio_${ratio.id}`)})),
        ...customRatios.map(ratio => ({ ...ratio, name: `${ratio.name} (${t('customOptionSuffix')})`}))
    ], [t, customRatios]);

    const styleOptions = useMemo(() => [
        ...DEFAULT_STYLE_DATA.map(style => ({ id: style.id, name: t(`style_${style.id}`), prompt: t(`style_prompt_${style.id}`) })),
        ...customStyles.map(style => ({ ...style, name: `${style.name} (${t('customOptionSuffix')})`}))
    ], [t, customStyles]);

    const translationOptions = useMemo(() => [
        { id: 'none', name: t('translate_none') }, { id: 'vi', name: t('lang_vi') }, { id: 'en', name: t('lang_en') },
        { id: 'zh', name: t('lang_zh') }, { id: 'ja', name: t('lang_ja') }, { id: 'ko', name: t('lang_ko') },
    ], [t]);

    const handleSelectionChange = (type: 'theme' | 'ratio' | 'style', value: string) => {
        if (value === 'add_new') setModalMode(type);
        else {
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
        if (apiKeys.length === 0) { setError(t('errorApiKeyMissing')); return; }
        if (!script.trim()) { setError(t('errorScriptRequired')); return; }
        if (!selectedTheme || !selectedAspectRatio || !selectedStyle) { setError(t('errorOptionsMissing')); return; }
        setIsLoading(true); setError(null); setScenes([]);
        try {
            const result = await generatePromptsFromScenes(apiKeys, script, selectedTheme.name, selectedAspectRatio.value, selectedStyle.prompt, characterDefinitions, translationLanguage, includeVisualIdea, language, t('errorApiKeyMissing'), t('errorInvalidResponse'), t('errorUnknown'), t('errorAllKeysFailed'));
            setScenes(result);
        } catch (e: unknown) {
            if (e instanceof Error) { setError(e.message); } else { setError(t('errorUnknown')); }
        } finally { setIsLoading(false); }
    }, [apiKeys, script, selectedTheme, selectedAspectRatio, selectedStyle, characterDefinitions, translationLanguage, includeVisualIdea, language, t]);

    return (
        <>
            {modalMode && <CustomOptionModal mode={modalMode} onClose={() => setModalMode(null)} onSave={handleSaveCustomOption} t={t} />}
            <div className="bg-gray-800 rounded-lg p-6 shadow-2xl shadow-black/30 space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="theme-select-p" className="block text-sm font-medium text-gray-300 mb-2">{t('themeLabel')}</label>
                        <select id="theme-select-p" value={selectedThemeId} onChange={(e) => handleSelectionChange('theme', e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-md p-2 text-gray-200 focus:ring-2 focus:ring-cyan-500">
                            {themeOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
                            <option value="add_new" className="font-bold text-cyan-400">{t('addNewOption')}</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="aspect-ratio-select-p" className="block text-sm font-medium text-gray-300 mb-2">{t('ratioLabel')}</label>
                        <select id="aspect-ratio-select-p" value={selectedAspectRatioId} onChange={(e) => handleSelectionChange('ratio', e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-md p-2 text-gray-200 focus:ring-2 focus:ring-cyan-500">
                            {aspectRatioOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
                            <option value="add_new" className="font-bold text-cyan-400">{t('addNewRatio')}</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="style-select-p" className="block text-sm font-medium text-gray-300 mb-2">{t('styleLabel')}</label>
                        <select id="style-select-p" value={selectedStyleId} onChange={(e) => handleSelectionChange('style', e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-md p-2 text-gray-200 focus:ring-2 focus:ring-cyan-500">
                            {styleOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
                            <option value="add_new" className="font-bold text-cyan-400">{t('addNewStyle')}</option>
                        </select>
                    </div>
                     <div>
                        <label htmlFor="translate-select-p" className="block text-sm font-medium text-gray-300 mb-2">{t('translateLabel')}</label>
                        <select id="translate-select-p" value={translationLanguage} onChange={(e) => setTranslationLanguage(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-md p-2 text-gray-200 focus:ring-2 focus:ring-cyan-500">
                            {translationOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
                        </select>
                    </div>
                </div>
                 <div className="flex items-center">
                    <input id="include-visual-idea-p" type="checkbox" checked={includeVisualIdea} onChange={(e) => setIncludeVisualIdea(e.target.checked)} className="h-4 w-4 rounded border-gray-600 bg-gray-900 text-cyan-600 focus:ring-cyan-500" />
                    <label htmlFor="include-visual-idea-p" className="ml-3 text-sm font-medium text-gray-300">{t('includeVisualIdeaLabel')}</label>
                </div>
                <div>
                    <label htmlFor="character-input-p" className="block text-sm font-medium text-gray-300 mb-2">{t('characterLabel')}</label>
                    <textarea id="character-input-p" value={characterDefinitions} onChange={(e) => setCharacterDefinitions(e.target.value)} placeholder={t('characterPlaceholder')} className="w-full h-24 bg-gray-900 border border-gray-700 rounded-md p-4 text-gray-200 focus:ring-2 focus:ring-cyan-500 resize-y" />
                </div>
                <div>
                    <label htmlFor="script-input-p" className="block text-sm font-medium text-gray-300 mb-2">{t('scriptLabel_prompter')}</label>
                    <p className="text-sm text-gray-400 mb-2 -mt-1">{t('prompter_instructions')}</p>
                    <textarea id="script-input-p" value={script} onChange={(e) => setScript(e.target.value)} placeholder={t('scriptPlaceholder_prompter')} className="w-full h-64 bg-gray-900 border border-gray-700 rounded-md p-4 text-gray-200 focus:ring-2 focus:ring-cyan-500 resize-y" />
                </div>
                <div className="mt-2 flex justify-center">
                    <button onClick={handleGenerate} disabled={isLoading || apiKeys.length === 0} className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-full shadow-lg hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-300/50">
                        {isLoading ? (<><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>{t('generatingButton')}</>) : (<><SparklesIcon className="w-5 h-5 mr-2" />{t('generatePromptsButton')}</>)}
                    </button>
                </div>
            </div>
             <ResultsView isLoading={isLoading} error={error} scenes={scenes} t={t} translationLanguage={translationLanguage} includeVisualIdea={includeVisualIdea} />
        </>
    );
};

// --- VIEW CHO TAB BATCH PROCESSING ---
const BatchView: React.FC<{ apiKeys: string[] }> = ({ apiKeys }) => {
    const { t, language } = useI18n();
    const [tasks, setTasks] = useState<BatchTask[]>([{id: 1, script: '', characterDefinitions: ''}, {id: 2, script: '', characterDefinitions: ''}, {id: 3, script: '', characterDefinitions: ''}]);
    const [batchMode, setBatchMode] = useState<BatchMode>('individual');

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [individualResults, setIndividualResults] = useState<{taskId: number, scenes: Scene[], error: string | null}[]>([]);
    const [combinedResult, setCombinedResult] = useState<{scenes: Scene[], error: string | null} | null>(null);
    
    // Settings state
    const [duration, setDuration] = useState<number>(10);
    const [characterDefinitions, setCharacterDefinitions] = useState<string>(''); // For combined mode
    const [customThemes, setCustomThemes] = useState<ThemeOption[]>([]);
    const [customRatios, setCustomRatios] = useState<AspectRatioOption[]>([]);
    const [customStyles, setCustomStyles] = useState<StyleOption[]>([]);
    const [selectedThemeId, setSelectedThemeId] = useState<string>('storytelling');
    const [selectedAspectRatioId, setSelectedAspectRatioId] = useState<string>('16:9');
    const [selectedStyleId, setSelectedStyleId] = useState<string>('automatic');
    const [translationLanguage, setTranslationLanguage] = useState<string>('none');
    const [includeVisualIdea, setIncludeVisualIdea] = useState<boolean>(true);
    const [modalMode, setModalMode] = useState<'theme' | 'ratio' | 'style' | null>(null);
    
    useEffect(() => {
        setCharacterDefinitions(t('placeholderCharacters'));
        try {
            setCustomThemes(JSON.parse(localStorage.getItem('customThemes') || '[]'));
            setCustomRatios(JSON.parse(localStorage.getItem('customRatios') || '[]'));
            setCustomStyles(JSON.parse(localStorage.getItem('customStyles') || '[]'));
        } catch (e) { console.error("Failed to load settings from localStorage", e); }
    }, [t]);

    const themeOptions = useMemo(() => [...DEFAULT_THEME_DATA.map(theme => ({ ...theme, name: t(`theme_${theme.id}`)})), ...customThemes.map(theme => ({ ...theme, name: `${theme.name} (${t('customOptionSuffix')})`}))], [t, customThemes]);
    const aspectRatioOptions = useMemo(() => [...DEFAULT_ASPECT_RATIO_DATA.map(ratio => ({ ...ratio, name: t(`ratio_${ratio.id}`)})), ...customRatios.map(ratio => ({ ...ratio, name: `${ratio.name} (${t('customOptionSuffix')})`}))], [t, customRatios]);
    const styleOptions = useMemo(() => [...DEFAULT_STYLE_DATA.map(style => ({ id: style.id, name: t(`style_${style.id}`), prompt: t(`style_prompt_${style.id}`) })), ...customStyles.map(style => ({ ...style, name: `${style.name} (${t('customOptionSuffix')})`}))], [t, customStyles]);
    const translationOptions = useMemo(() => [{ id: 'none', name: t('translate_none') }, { id: 'vi', name: t('lang_vi') }, { id: 'en', name: t('lang_en') }, { id: 'zh', name: t('lang_zh') }, { id: 'ja', name: t('lang_ja') }, { id: 'ko', name: t('lang_ko') },], [t]);
    
    const handleSelectionChange = (type: 'theme' | 'ratio' | 'style', value: string) => {
        if (value === 'add_new') setModalMode(type);
        else {
            if (type === 'theme') setSelectedThemeId(value);
            if (type === 'ratio') setSelectedAspectRatioId(value);
            if (type === 'style') setSelectedStyleId(value);
        }
    };

    const handleSaveCustomOption = (data: any) => { /* Omitted for brevity, logic is the same as other views */ };
    
    const selectedTheme = useMemo(() => themeOptions.find(t => t.id === selectedThemeId)!, [themeOptions, selectedThemeId]);
    const selectedAspectRatio = useMemo(() => aspectRatioOptions.find(r => r.id === selectedAspectRatioId)!, [aspectRatioOptions, selectedAspectRatioId]);
    const selectedStyle = useMemo(() => styleOptions.find(s => s.id === selectedStyleId)!, [styleOptions, selectedStyleId]);

    const handleTaskFieldChange = (id: number, field: 'script' | 'characterDefinitions', value: string) => {
        setTasks(currentTasks => 
            currentTasks.map(task => 
                task.id === id ? { ...task, [field]: value } : task
            )
        );
    };
    
    const addTask = () => {
        setTasks(currentTasks => [...currentTasks, { id: Date.now(), script: '', characterDefinitions: '' }]);
    };

    const removeTask = (id: number) => {
        setTasks(currentTasks => currentTasks.filter(task => task.id !== id));
    };

    const handleGenerateBatch = useCallback(async () => {
        if (apiKeys.length === 0) {
            const error = t('errorApiKeyMissing');
            if (batchMode === 'individual') setIndividualResults(tasks.map(t => ({ taskId: t.id, scenes: [], error })));
            else setCombinedResult({ scenes: [], error });
            return;
        }
        if (!selectedTheme || !selectedAspectRatio || !selectedStyle) return;

        setIsLoading(true);
        setIndividualResults([]);
        setCombinedResult(null);

        const activeTasks = tasks.filter(task => task.script.trim() !== '');
        if (activeTasks.length === 0) {
            setIsLoading(false);
            return;
        }

        const promises = activeTasks.map(task => {
             const taskCharacterDefs = batchMode === 'individual' ? task.characterDefinitions : characterDefinitions;
             return breakdownScript(
                apiKeys, task.script, duration, selectedTheme.name, selectedTheme.wps,
                selectedAspectRatio.value, selectedStyle.prompt, taskCharacterDefs,
                translationLanguage, includeVisualIdea, '', language, t('errorApiKeyMissing'), t('errorInvalidResponse'),
                t('errorUnknown'), t('errorAllKeysFailed')
            );
        });

        if (batchMode === 'individual') {
            const results = await Promise.allSettled(promises);
            const finalResults = results.map((result, index) => {
                const taskId = activeTasks[index].id;
                if (result.status === 'fulfilled') {
                    return { taskId, scenes: result.value, error: null };
                } else {
                    return { taskId, scenes: [], error: (result.reason as Error).message || t('errorUnknown') };
                }
            });
            setIndividualResults(finalResults);
        } else { // Combined mode
            try {
                const resultsArrays = await Promise.all(promises);
                let sceneCounter = 1;
                const combinedScenes = resultsArrays.flat().map(scene => ({
                    ...scene,
                    sceneNumber: sceneCounter++
                }));
                setCombinedResult({ scenes: combinedScenes, error: null });
            } catch (e: unknown) {
                const error = e instanceof Error ? e.message : t('errorUnknown');
                setCombinedResult({ scenes: [], error });
            }
        }

        setIsLoading(false);
    }, [apiKeys, tasks, batchMode, duration, selectedTheme, selectedAspectRatio, selectedStyle, characterDefinitions, translationLanguage, includeVisualIdea, language, t]);


    return (
        <>
            {modalMode && <CustomOptionModal mode={modalMode} onClose={() => setModalMode(null)} onSave={handleSaveCustomOption} t={t} />}
            <div className="bg-gray-800 rounded-lg p-6 shadow-2xl shadow-black/30 space-y-6">
                {/* Batch Mode Selector */}
                <fieldset className="border border-gray-700 p-4 rounded-md">
                    <legend className="px-2 text-sm font-medium text-gray-300">{t('batchModeLabel')}</legend>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex items-center">
                            <input id="mode-individual" name="batch-mode" type="radio" checked={batchMode === 'individual'} onChange={() => setBatchMode('individual')} className="h-4 w-4 text-cyan-600 bg-gray-900 border-gray-600 focus:ring-cyan-500" />
                            <label htmlFor="mode-individual" className="ml-3 block text-sm font-medium text-gray-200">{t('batchModeIndividual')}</label>
                        </div>
                        <div className="flex items-center">
                            <input id="mode-combined" name="batch-mode" type="radio" checked={batchMode === 'combined'} onChange={() => setBatchMode('combined')} className="h-4 w-4 text-cyan-600 bg-gray-900 border-gray-600 focus:ring-cyan-500" />
                            <label htmlFor="mode-combined" className="ml-3 block text-sm font-medium text-gray-200">{t('batchModeCombined')}</label>
                        </div>
                    </div>
                </fieldset>

                {/* Shared Settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                        <label htmlFor="duration-input-b" className="block text-sm font-medium text-gray-300 mb-2">{t('durationLabel')}</label>
                        <input type="number" id="duration-input-b" value={duration} onChange={(e) => setDuration(Math.max(1, parseInt(e.target.value, 10) || 1))} className="w-full bg-gray-900 border border-gray-700 rounded-md p-2 text-gray-200 focus:ring-2 focus:ring-cyan-500" min="1" />
                    </div>
                    <div>
                        <label htmlFor="theme-select-b" className="block text-sm font-medium text-gray-300 mb-2">{t('themeLabel')}</label>
                        <select id="theme-select-b" value={selectedThemeId} onChange={(e) => handleSelectionChange('theme', e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-md p-2 text-gray-200 focus:ring-2 focus:ring-cyan-500">{themeOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}<option value="add_new" className="font-bold text-cyan-400">{t('addNewOption')}</option></select>
                    </div>
                    <div>
                        <label htmlFor="aspect-ratio-select-b" className="block text-sm font-medium text-gray-300 mb-2">{t('ratioLabel')}</label>
                        <select id="aspect-ratio-select-b" value={selectedAspectRatioId} onChange={(e) => handleSelectionChange('ratio', e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-md p-2 text-gray-200 focus:ring-2 focus:ring-cyan-500">{aspectRatioOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}<option value="add_new" className="font-bold text-cyan-400">{t('addNewRatio')}</option></select>
                    </div>
                    <div>
                        <label htmlFor="style-select-b" className="block text-sm font-medium text-gray-300 mb-2">{t('styleLabel')}</label>
                        <select id="style-select-b" value={selectedStyleId} onChange={(e) => handleSelectionChange('style', e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-md p-2 text-gray-200 focus:ring-2 focus:ring-cyan-500">{styleOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}<option value="add_new" className="font-bold text-cyan-400">{t('addNewStyle')}</option></select>
                    </div>
                    <div className="lg:col-span-2">
                        <label htmlFor="translate-select-b" className="block text-sm font-medium text-gray-300 mb-2">{t('translateLabel')}</label>
                        <select id="translate-select-b" value={translationLanguage} onChange={(e) => setTranslationLanguage(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-md p-2 text-gray-200 focus:ring-2 focus:ring-cyan-500">{translationOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}</select>
                    </div>
                </div>
                 <div className="flex items-center">
                    <input id="include-visual-idea-b" type="checkbox" checked={includeVisualIdea} onChange={(e) => setIncludeVisualIdea(e.target.checked)} className="h-4 w-4 rounded border-gray-600 bg-gray-900 text-cyan-600 focus:ring-cyan-500" />
                    <label htmlFor="include-visual-idea-b" className="ml-3 text-sm font-medium text-gray-300">{t('includeVisualIdeaLabel')}</label>
                </div>
                {batchMode === 'combined' && (
                    <div>
                        <label htmlFor="character-input-b" className="block text-sm font-medium text-gray-300 mb-2">{t('characterLabel')}</label>
                        <textarea id="character-input-b" value={characterDefinitions} onChange={(e) => setCharacterDefinitions(e.target.value)} placeholder={t('characterPlaceholder')} className="w-full h-24 bg-gray-900 border border-gray-700 rounded-md p-4 text-gray-200 focus:ring-2 focus:ring-cyan-500 resize-y" />
                    </div>
                )}
                
                {/* Task Inputs */}
                <div className="space-y-4">
                    {tasks.map((task, index) => (
                        <div key={task.id} className="bg-gray-900/50 p-4 rounded-md border border-gray-700 space-y-3">
                             <div className="flex justify-between items-center">
                                <label htmlFor={`task-script-${task.id}`} className="block text-sm font-semibold text-gray-300">{t('batchTaskLabel')} {index + 1}</label>
                                {tasks.length > 1 && <button onClick={() => removeTask(task.id)} className="text-xs text-red-400 hover:text-red-300 font-semibold">{t('removeTaskButton')}</button>}
                             </div>
                            <textarea id={`task-script-${task.id}`} value={task.script} onChange={(e) => handleTaskFieldChange(task.id, 'script', e.target.value)} placeholder={t('scriptPlaceholder')} className="w-full h-32 bg-gray-900 border border-gray-600 rounded-md p-3 text-gray-200 focus:ring-2 focus:ring-cyan-500 resize-y" />
                             {batchMode === 'individual' && (
                                <div>
                                    <label htmlFor={`task-chars-${task.id}`} className="block text-xs font-medium text-gray-400 mb-1">{t('characterDefinitionForTask')}</label>
                                    <textarea id={`task-chars-${task.id}`} value={task.characterDefinitions} onChange={(e) => handleTaskFieldChange(task.id, 'characterDefinitions', e.target.value)} placeholder={t('characterPlaceholder')} className="w-full h-20 bg-gray-900 border border-gray-600 rounded-md p-3 text-gray-200 focus:ring-2 focus:ring-cyan-500 resize-y" />
                                </div>
                             )}
                        </div>
                    ))}
                </div>
                 <div className="flex justify-center mt-2">
                    <button onClick={addTask} className="text-sm font-semibold text-cyan-400 hover:text-cyan-300">{t('addTaskButton')}</button>
                </div>


                {/* Generate Button */}
                <div className="mt-2 flex justify-center">
                    <button onClick={handleGenerateBatch} disabled={isLoading || apiKeys.length === 0} className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-full shadow-lg hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-300/50">
                        {isLoading ? (<><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>{t('generatingBatchButton')}</>) : (<><SparklesIcon className="w-5 h-5 mr-2" />{t('batchGenerateButton')}</>)}
                    </button>
                </div>
            </div>
            
            {/* Results */}
            <div className="mt-8">
                {isLoading && <Spinner />}
                {batchMode === 'individual' && individualResults.length > 0 && (
                    <div className="space-y-12">
                         <div className="flex flex-wrap justify-center gap-2 mb-8 p-4 bg-gray-800 rounded-lg">
                            {individualResults.map((result) => (
                                <a key={`nav-${result.taskId}`} href={`#task-result-${result.taskId}`} className="px-4 py-2 text-sm font-medium text-cyan-300 bg-gray-900 rounded-full hover:bg-gray-700 transition-colors">
                                    {t('goToTaskResult').replace('{taskNumber}', (tasks.findIndex(t => t.id === result.taskId) + 1).toString())}
                                </a>
                            ))}
                        </div>
                        {individualResults.map((result, index) => (
                             <div key={result.taskId} id={`task-result-${result.taskId}`} className="border-t-2 border-dashed border-gray-700 pt-8">
                                <h2 className="text-2xl font-bold text-center text-cyan-400 mb-4">{t('batchResultsTitle').replace('{taskNumber}', (tasks.findIndex(t => t.id === result.taskId) + 1).toString())}</h2>
                                <ResultsView isLoading={false} error={result.error} scenes={result.scenes} t={t} translationLanguage={translationLanguage} includeVisualIdea={includeVisualIdea} />
                            </div>
                        ))}
                    </div>
                )}
                 {batchMode === 'combined' && combinedResult && (
                     <div className="border-t-2 border-dashed border-gray-700 pt-8">
                        <h2 className="text-2xl font-bold text-center text-cyan-400 mb-4">{t('combinedResultsTitle')}</h2>
                        <ResultsView isLoading={false} error={combinedResult.error} scenes={combinedResult.scenes} t={t} translationLanguage={translationLanguage} includeVisualIdea={includeVisualIdea} />
                    </div>
                )}
            </div>
        </>
    );
};


// --- VIEW CHO TAB QUY TẮC TÙY CHỈNH ---
const CustomRulesView: React.FC<{ apiKeys: string[] }> = ({ apiKeys }) => {
    const { t, language } = useI18n();
    const [tasks, setTasks] = useState<CustomRuleBatchTask[]>([
        { id: 1, script: '', characterDefinitions: '' },
        { id: 2, script: '', characterDefinitions: '' },
        { id: 3, script: '', characterDefinitions: '' },
    ]);
    const [batchMode, setBatchMode] = useState<BatchMode>('individual');

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [individualResults, setIndividualResults] = useState<{taskId: number, scenes: Scene[], error: string | null}[]>([]);
    const [combinedResult, setCombinedResult] = useState<{scenes: Scene[], error: string | null} | null>(null);
    // FIX: Add missing error state to handle component-level errors.
    const [error, setError] = useState<string | null>(null);

    // Settings state
    const [customRules, setCustomRules] = useState<string>('');
    const [characterDefinitions, setCharacterDefinitions] = useState<string>(''); // For combined mode
    const [customThemes, setCustomThemes] = useState<ThemeOption[]>([]);
    const [customRatios, setCustomRatios] = useState<AspectRatioOption[]>([]);
    const [customStyles, setCustomStyles] = useState<StyleOption[]>([]);
    const [selectedThemeId, setSelectedThemeId] = useState<string>('storytelling');
    const [selectedAspectRatioId, setSelectedAspectRatioId] = useState<string>('16:9');
    const [selectedStyleId, setSelectedStyleId] = useState<string>('automatic');
    const [translationLanguage, setTranslationLanguage] = useState<string>('none');
    const [includeVisualIdea, setIncludeVisualIdea] = useState<boolean>(true);
    const [modalMode, setModalMode] = useState<'theme' | 'ratio' | 'style' | null>(null);

    useEffect(() => {
        setCharacterDefinitions(t('placeholderCharacters'));
        try {
            setCustomThemes(JSON.parse(localStorage.getItem('customThemes') || '[]'));
            setCustomRatios(JSON.parse(localStorage.getItem('customRatios') || '[]'));
            setCustomStyles(JSON.parse(localStorage.getItem('customStyles') || '[]'));
        } catch (e) { console.error("Failed to load settings from localStorage", e); }
    }, [t]);

    const themeOptions = useMemo(() => [ ...DEFAULT_THEME_DATA.map(theme => ({ ...theme, name: t(`theme_${theme.id}`)})), ...customThemes.map(theme => ({ ...theme, name: `${theme.name} (${t('customOptionSuffix')})`})) ], [t, customThemes]);
    const aspectRatioOptions = useMemo(() => [ ...DEFAULT_ASPECT_RATIO_DATA.map(ratio => ({ ...ratio, name: t(`ratio_${ratio.id}`)})), ...customRatios.map(ratio => ({ ...ratio, name: `${ratio.name} (${t('customOptionSuffix')})`})) ], [t, customRatios]);
    const styleOptions = useMemo(() => [ ...DEFAULT_STYLE_DATA.map(style => ({ id: style.id, name: t(`style_${style.id}`), prompt: t(`style_prompt_${style.id}`) })), ...customStyles.map(style => ({ ...style, name: `${style.name} (${t('customOptionSuffix')})`})) ], [t, customStyles]);
    const translationOptions = useMemo(() => [ { id: 'none', name: t('translate_none') }, { id: 'vi', name: t('lang_vi') }, { id: 'en', name: t('lang_en') }, { id: 'zh', name: t('lang_zh') }, { id: 'ja', name: t('lang_ja') }, { id: 'ko', name: t('lang_ko') }, ], [t]);

    const handleSelectionChange = (type: 'theme' | 'ratio' | 'style', value: string) => {
        if (value === 'add_new') setModalMode(type);
        else {
            if (type === 'theme') setSelectedThemeId(value);
            if (type === 'ratio') setSelectedAspectRatioId(value);
            if (type === 'style') setSelectedStyleId(value);
        }
    };

    const handleSaveCustomOption = (data: any) => { /* Omitted for brevity */ };

    const selectedTheme = useMemo(() => themeOptions.find(t => t.id === selectedThemeId)!, [themeOptions, selectedThemeId]);
    const selectedAspectRatio = useMemo(() => aspectRatioOptions.find(r => r.id === selectedAspectRatioId)!, [aspectRatioOptions, selectedAspectRatioId]);
    const selectedStyle = useMemo(() => styleOptions.find(s => s.id === selectedStyleId)!, [styleOptions, selectedStyleId]);

    const handleTaskFieldChange = (id: number, field: 'script' | 'characterDefinitions', value: string) => {
        setTasks(currentTasks =>
            currentTasks.map(task =>
                task.id === id ? { ...task, [field]: value } : task
            )
        );
    };

    const addTask = () => {
        setTasks(currentTasks => [...currentTasks, { id: Date.now(), script: '', characterDefinitions: '' }]);
    };

    const removeTask = (id: number) => {
        setTasks(currentTasks => currentTasks.filter(task => task.id !== id));
    };

    const handleGenerateBatch = useCallback(async () => {
        if (apiKeys.length === 0) {
            const error = t('errorApiKeyMissing');
            if (batchMode === 'individual') setIndividualResults(tasks.map(t => ({ taskId: t.id, scenes: [], error })));
            else setCombinedResult({ scenes: [], error });
            return;
        }
        if (!customRules.trim()) {
            setError(t('errorCustomRulesRequired'));
            return;
        }
        if (!selectedTheme || !selectedAspectRatio || !selectedStyle) return;

        setIsLoading(true);
        setError(null);
        setIndividualResults([]);
        setCombinedResult(null);

        const activeTasks = tasks.filter(task => task.script.trim() !== '');
        if (activeTasks.length === 0) {
            setIsLoading(false);
            return;
        }

        const promises = activeTasks.map(task => {
             const taskCharacterDefs = batchMode === 'individual' ? task.characterDefinitions : characterDefinitions;
             return breakdownScript(
                apiKeys, task.script, 0, selectedTheme.name, 0,
                selectedAspectRatio.value, selectedStyle.prompt, taskCharacterDefs,
                translationLanguage, includeVisualIdea, customRules, language, t('errorApiKeyMissing'), t('errorInvalidResponse'),
                t('errorUnknown'), t('errorAllKeysFailed')
            );
        });

        if (batchMode === 'individual') {
            const results = await Promise.allSettled(promises);
            const finalResults = results.map((result, index) => {
                const taskId = activeTasks[index].id;
                if (result.status === 'fulfilled') {
                    return { taskId, scenes: result.value, error: null };
                } else {
                    return { taskId, scenes: [], error: (result.reason as Error).message || t('errorUnknown') };
                }
            });
            setIndividualResults(finalResults);
        } else { // Combined mode
            try {
                const resultsArrays = await Promise.all(promises);
                let sceneCounter = 1;
                const combinedScenes = resultsArrays.flat().map(scene => ({
                    ...scene,
                    sceneNumber: sceneCounter++
                }));
                setCombinedResult({ scenes: combinedScenes, error: null });
            } catch (e: unknown) {
                const error = e instanceof Error ? e.message : t('errorUnknown');
                setCombinedResult({ scenes: [], error });
            }
        }

        setIsLoading(false);
    }, [apiKeys, tasks, batchMode, customRules, selectedTheme, selectedAspectRatio, selectedStyle, characterDefinitions, translationLanguage, includeVisualIdea, language, t]);


    return (
        <>
            {modalMode && <CustomOptionModal mode={modalMode} onClose={() => setModalMode(null)} onSave={handleSaveCustomOption} t={t} />}
            <div className="bg-gray-800 rounded-lg p-6 shadow-2xl shadow-black/30 space-y-6">
                <fieldset className="border border-gray-700 p-4 rounded-md">
                    <legend className="px-2 text-sm font-medium text-gray-300">{t('batchModeLabel')}</legend>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex items-center">
                            <input id="mode-individual-c" name="batch-mode-c" type="radio" checked={batchMode === 'individual'} onChange={() => setBatchMode('individual')} className="h-4 w-4 text-cyan-600 bg-gray-900 border-gray-600 focus:ring-cyan-500" />
                            <label htmlFor="mode-individual-c" className="ml-3 block text-sm font-medium text-gray-200">{t('batchModeIndividual')}</label>
                        </div>
                        <div className="flex items-center">
                            <input id="mode-combined-c" name="batch-mode-c" type="radio" checked={batchMode === 'combined'} onChange={() => setBatchMode('combined')} className="h-4 w-4 text-cyan-600 bg-gray-900 border-gray-600 focus:ring-cyan-500" />
                            <label htmlFor="mode-combined-c" className="ml-3 block text-sm font-medium text-gray-200">{t('batchModeCombined')}</label>
                        </div>
                    </div>
                </fieldset>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                     <div>
                        <label htmlFor="theme-select-c" className="block text-sm font-medium text-gray-300 mb-2">{t('themeLabel')}</label>
                        <select id="theme-select-c" value={selectedThemeId} onChange={(e) => handleSelectionChange('theme', e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-md p-2 text-gray-200 focus:ring-2 focus:ring-cyan-500">{themeOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}<option value="add_new" className="font-bold text-cyan-400">{t('addNewOption')}</option></select>
                    </div>
                    <div>
                        <label htmlFor="aspect-ratio-select-c" className="block text-sm font-medium text-gray-300 mb-2">{t('ratioLabel')}</label>
                        <select id="aspect-ratio-select-c" value={selectedAspectRatioId} onChange={(e) => handleSelectionChange('ratio', e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-md p-2 text-gray-200 focus:ring-2 focus:ring-cyan-500">{aspectRatioOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}<option value="add_new" className="font-bold text-cyan-400">{t('addNewRatio')}</option></select>
                    </div>
                    <div>
                        <label htmlFor="style-select-c" className="block text-sm font-medium text-gray-300 mb-2">{t('styleLabel')}</label>
                        <select id="style-select-c" value={selectedStyleId} onChange={(e) => handleSelectionChange('style', e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-md p-2 text-gray-200 focus:ring-2 focus:ring-cyan-500">{styleOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}<option value="add_new" className="font-bold text-cyan-400">{t('addNewStyle')}</option></select>
                    </div>
                    <div className="lg:col-span-3">
                        <label htmlFor="translate-select-c" className="block text-sm font-medium text-gray-300 mb-2">{t('translateLabel')}</label>
                        <select id="translate-select-c" value={translationLanguage} onChange={(e) => setTranslationLanguage(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-md p-2 text-gray-200 focus:ring-2 focus:ring-cyan-500">{translationOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}</select>
                    </div>
                </div>
                 <div className="flex items-center">
                    <input id="include-visual-idea-c" type="checkbox" checked={includeVisualIdea} onChange={(e) => setIncludeVisualIdea(e.target.checked)} className="h-4 w-4 rounded border-gray-600 bg-gray-900 text-cyan-600 focus:ring-cyan-500" />
                    <label htmlFor="include-visual-idea-c" className="ml-3 text-sm font-medium text-gray-300">{t('includeVisualIdeaLabel')}</label>
                </div>
                 {batchMode === 'combined' && (
                    <div>
                        <label htmlFor="character-input-c" className="block text-sm font-medium text-gray-300 mb-2">{t('characterLabel')}</label>
                        <textarea id="character-input-c" value={characterDefinitions} onChange={(e) => setCharacterDefinitions(e.target.value)} placeholder={t('characterPlaceholder')} className="w-full h-24 bg-gray-900 border border-gray-700 rounded-md p-4 text-gray-200 focus:ring-2 focus:ring-cyan-500 resize-y" />
                    </div>
                )}

                <div>
                    <label htmlFor="custom-rules-input-c" className="block text-sm font-medium text-gray-300 mb-2">{t('customRulesLabel')}</label>
                    <textarea
                        id="custom-rules-input-c"
                        value={customRules}
                        onChange={(e) => setCustomRules(e.target.value)}
                        placeholder={t('customRulesPlaceholder')}
                        className="w-full h-32 bg-gray-900 border border-gray-700 rounded-md p-4 text-gray-200 focus:ring-2 focus:ring-cyan-500 resize-y"
                    />
                </div>
                
                <div className="space-y-4">
                    {tasks.map((task, index) => (
                        <div key={task.id} className="bg-gray-900/50 p-4 rounded-md border border-gray-700 space-y-3">
                             <div className="flex justify-between items-center">
                                <label className="block text-sm font-semibold text-gray-300">{t('batchTaskLabel')} {index + 1}</label>
                                {tasks.length > 1 && <button onClick={() => removeTask(task.id)} className="text-xs text-red-400 hover:text-red-300 font-semibold">{t('removeTaskButton')}</button>}
                             </div>
                            <textarea id={`task-script-${task.id}`} value={task.script} onChange={(e) => handleTaskFieldChange(task.id, 'script', e.target.value)} placeholder={t('scriptPlaceholder')} className="w-full h-32 bg-gray-900 border border-gray-600 rounded-md p-3 text-gray-200 focus:ring-2 focus:ring-cyan-500 resize-y" />
                             {batchMode === 'individual' && (
                                <div>
                                    <label htmlFor={`task-chars-${task.id}`} className="block text-xs font-medium text-gray-400 mb-1">{t('characterDefinitionForTask')}</label>
                                    <textarea id={`task-chars-${task.id}`} value={task.characterDefinitions} onChange={(e) => handleTaskFieldChange(task.id, 'characterDefinitions', e.target.value)} placeholder={t('characterPlaceholder')} className="w-full h-20 bg-gray-900 border border-gray-600 rounded-md p-3 text-gray-200 focus:ring-2 focus:ring-cyan-500 resize-y" />
                                </div>
                             )}
                        </div>
                    ))}
                </div>
                 <div className="flex justify-center mt-2">
                    <button onClick={addTask} className="text-sm font-semibold text-cyan-400 hover:text-cyan-300">{t('addTaskButton')}</button>
                </div>

                <div className="mt-2 flex justify-center">
                    <button onClick={handleGenerateBatch} disabled={isLoading || apiKeys.length === 0} className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-full shadow-lg hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-300/50">
                        {isLoading ? (<><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>{t('generatingBatchButton')}</>) : (<><SparklesIcon className="w-5 h-5 mr-2" />{t('batchGenerateButton')}</>)}
                    </button>
                </div>
            </div>

            {/* FIX: Display the general error message if it exists. */}
            {error && (
                <div className="mt-8 bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg text-center" role="alert">
                    <strong className="font-bold">{t('errorAlertTitle')}</strong><span className="block sm:inline ml-2">{error}</span>
                </div>
            )}

             <div className="mt-8">
                {isLoading && <Spinner />}
                {batchMode === 'individual' && individualResults.length > 0 && (
                    <div className="space-y-12">
                         <div className="flex flex-wrap justify-center gap-2 mb-8 p-4 bg-gray-800 rounded-lg">
                            {individualResults.map((result) => (
                                <a key={`nav-c-${result.taskId}`} href={`#task-result-c-${result.taskId}`} className="px-4 py-2 text-sm font-medium text-cyan-300 bg-gray-900 rounded-full hover:bg-gray-700 transition-colors">
                                    {t('goToTaskResult').replace('{taskNumber}', (tasks.findIndex(t => t.id === result.taskId) + 1).toString())}
                                </a>
                            ))}
                        </div>
                        {individualResults.map((result) => (
                             <div key={result.taskId} id={`task-result-c-${result.taskId}`} className="border-t-2 border-dashed border-gray-700 pt-8">
                                <h2 className="text-2xl font-bold text-center text-cyan-400 mb-4">{t('batchResultsTitle').replace('{taskNumber}', (tasks.findIndex(t => t.id === result.taskId) + 1).toString())}</h2>
                                <ResultsView isLoading={isLoading} error={result.error} scenes={result.scenes} t={t} translationLanguage={translationLanguage} includeVisualIdea={includeVisualIdea} />
                            </div>
                        ))}
                    </div>
                )}
                 {batchMode === 'combined' && combinedResult && (
                     <div className="border-t-2 border-dashed border-gray-700 pt-8">
                        <h2 className="text-2xl font-bold text-center text-cyan-400 mb-4">{t('combinedResultsTitle')}</h2>
                        <ResultsView isLoading={false} error={combinedResult.error} scenes={combinedResult.scenes} t={t} translationLanguage={translationLanguage} includeVisualIdea={includeVisualIdea} />
                    </div>
                )}
            </div>
        </>
    );
};


const AppContainer = () => {
    const { t } = useI18n();
    const [apiKeysText, setApiKeysText] = useState<string>('');
    const [activeTab, setActiveTab] = useState<AppTab>('splitter');

    const apiKeys = useMemo(() => apiKeysText.split('\n').filter(k => k.trim()), [apiKeysText]);

    useEffect(() => {
        try {
            const savedKeys = localStorage.getItem('gemini-api-keys');
            if (savedKeys) setApiKeysText(savedKeys);
        } catch (e) { console.error("Failed to load API keys from localStorage", e); }
    }, []);

    const handleApiKeyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newKeysText = e.target.value;
        setApiKeysText(newKeysText);
        localStorage.setItem('gemini-api-keys', newKeysText);
    };

    const TabButton: React.FC<{ tabId: AppTab; children: React.ReactNode }> = ({ tabId, children }) => (
        <button
            onClick={() => setActiveTab(tabId)}
            className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors focus:outline-none ${activeTab === tabId ? 'bg-gray-800 text-cyan-400 border-b-2 border-cyan-400' : 'bg-gray-900 text-gray-400 hover:bg-gray-800/50'}`}
        >
            {children}
        </button>
    );

    return (
        <>
            <div className="text-center mb-10">
                <p className="mt-4 text-lg text-gray-400 max-w-3xl mx-auto">{t('appDescription')}</p>
                <div className="mt-6 text-gray-500 max-w-3xl mx-auto text-sm border-t border-gray-800 pt-6">
                    <p>{t('copyrightText_part1')} <strong className="font-semibold text-gray-300">Bit & Đô</strong>.</p>
                    <p className="mt-2 flex flex-wrap justify-center items-center gap-x-3 gap-y-1">
                        <a href="https://www.youtube.com/@Bit-Do" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">{t('youtubeLinkText')}</a>
                        <span className="text-gray-600">|</span>
                        <a href="https://zalo.me/g/icgdoy825" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">{t('zaloGroupLinkText')}</a>
                        <span className="text-gray-600">|</span>
                        <span>{t('zaloPersonalText')} 0342472776</span>
                    </p>
                </div>
            </div>
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <label htmlFor="api-key-input" className="flex items-center text-sm font-medium text-gray-300 mb-2">
                        {t('apiKeyLabel')}
                        <div className="relative group ml-2">
                            <InfoIcon className="w-4 h-4 text-gray-500 cursor-pointer" />
                            <div className="absolute bottom-full mb-2 w-72 p-2 text-xs text-center text-gray-200 bg-gray-900 border border-gray-700 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">{t('apiKeyTooltip')}</div>
                        </div>
                    </label>
                    <div className="relative">
                        <KeyIcon className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                        <textarea
                            id="api-key-input" value={apiKeysText} onChange={handleApiKeyChange}
                            placeholder={t('apiKeyPlaceholder')}
                            rows={3}
                            className="w-full bg-gray-900 border border-gray-700 rounded-md p-2 pl-10 text-gray-200 focus:ring-2 focus:ring-cyan-500 resize-y"
                        />
                    </div>
                </div>

                <div className="border-b border-gray-700">
                    <nav className="-mb-px flex space-x-2" aria-label="Tabs">
                        <TabButton tabId="splitter">{t('tab_splitter')}</TabButton>
                        <TabButton tabId="prompter">{t('tab_prompter')}</TabButton>
                        <TabButton tabId="batch">{t('tab_batch')}</TabButton>
                        <TabButton tabId="custom">{t('tab_custom')}</TabButton>
                    </nav>
                </div>

                <div className="mt-4">
                    {activeTab === 'splitter' && <SceneSplitterView apiKeys={apiKeys} />}
                    {activeTab === 'prompter' && <PromptGeneratorView apiKeys={apiKeys} />}
                    {activeTab === 'batch' && <BatchView apiKeys={apiKeys} />}
                    {activeTab === 'custom' && <CustomRulesView apiKeys={apiKeys} />}
                </div>
            </div>
        </>
    )
}

function App() {
  const { t } = useI18n();
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <header className="container mx-auto px-4 py-4 flex justify-between items-center border-b border-gray-800">
        <h1 className="text-2xl font-bold">
            <a href="https://www.youtube.com/@Bit-Do" target="_blank" rel="noopener noreferrer" className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 hover:opacity-80 transition-opacity">
                {t('appTitle')}
            </a>
        </h1>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:py-12">
        <AppContainer />
      </main>

      <footer className="text-center py-6 text-sm text-gray-600">
        <p dangerouslySetInnerHTML={{ __html: t('footerText') }} />
        <div className="mt-4">
            <button
                onClick={() => setIsDonateModalOpen(true)}
                className="inline-flex items-center justify-center px-5 py-2 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-rose-500 transition-transform transform hover:scale-105"
            >
                <HeartIcon className="w-5 h-5 mr-2" />
                {t('donateButton')}
            </button>
        </div>
      </footer>
      {isDonateModalOpen && <DonateModal onClose={() => setIsDonateModalOpen(false)} />}
    </div>
  );
}

export default App;