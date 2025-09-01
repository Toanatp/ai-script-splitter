import { GoogleGenAI, Type } from "@google/genai";
import type { Scene } from "../types";
import { getPromptTemplate, getVisualDescSchemaDescription, getPromptTemplateForPrompter } from "../i18n/locales";

// A local variable to rotate keys across different calls, not for concurrency safety but for load distribution.
let lastUsedKeyIndex = 0;

const callGemini = async (
  apiKeys: string[],
  mainPrompt: string,
  schema: any,
  errorInvalidResponse: string,
  errorGeneral: string,
  errorApiKeyMissing: string,
  errorAllKeysFailed: string
): Promise<Scene[]> => {
    const validKeys = apiKeys.filter(k => k.trim() !== '');
    if (validKeys.length === 0) {
        throw new Error(errorApiKeyMissing);
    }

    let lastError: Error | null = null;
    
    const startIndex = lastUsedKeyIndex % validKeys.length;

    for (let i = 0; i < validKeys.length; i++) {
        const keyIndex = (startIndex + i) % validKeys.length;
        const currentApiKey = validKeys[keyIndex];
        const ai = new GoogleGenAI({ apiKey: currentApiKey });
        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: mainPrompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: schema,
                },
            });

            const jsonString = response.text;
            const parsedData = JSON.parse(jsonString);

            if (!Array.isArray(parsedData)) {
                console.error("API response is not an array:", parsedData);
                throw new Error(errorInvalidResponse);
            }

            const validatedScenes: Scene[] = parsedData.map((item): Scene | null => {
                if (
                    typeof item.sceneNumber === 'number' &&
                    typeof item.originalText === 'string' &&
                    typeof item.imagePrompt === 'string'
                ) {
                    return {
                        sceneNumber: item.sceneNumber,
                        originalText: item.originalText,
                        visualDescription: typeof item.visualDescription === 'string' ? item.visualDescription : undefined,
                        imagePrompt: item.imagePrompt,
                        translatedText: typeof item.translatedText === 'string' ? item.translatedText : undefined,
                    };
                }
                return null;
            }).filter((item): item is Scene => item !== null);

            if (validatedScenes.length !== parsedData.length) {
                console.warn("Some items in the AI's response had incorrect formats and were filtered out.");
            }
            
            lastUsedKeyIndex = keyIndex + 1; // Success, so next call starts after this key
            return validatedScenes;

        } catch (error) {
            console.warn(`API call failed with key at index ${keyIndex}. Trying next key.`, error);
            lastError = error instanceof Error ? error : new Error(String(error));
        }
    }
    
    // If loop finishes, all keys failed. Throw a more specific error.
    console.error("All API keys failed.", lastError);
    if (lastError && lastError.message.includes('API key not valid')) {
        throw new Error(errorAllKeysFailed);
    }
    throw lastError || new Error(errorGeneral);
}

const buildSchema = (lang: 'vi' | 'en' | 'zh' | 'ja' | 'ko', includeVisualIdea: boolean) => {
    const properties: any = {
        sceneNumber: {
          type: Type.INTEGER,
          description: "The sequential number of the scene, starting from 1."
        },
        originalText: {
          type: Type.STRING,
          description: "The full, unchanged original text from the script for this scene."
        },
        translatedText: {
            type: Type.STRING,
            description: `The translation of the original text into the requested language. This field is only present if a translation was requested.`
        },
        imagePrompt: {
          type: Type.STRING,
          description: "A detailed, professional prompt in ENGLISH for AI image generation, strictly following the provided GOLDEN FORMULA."
        },
    };

    const required = ["sceneNumber", "originalText", "imagePrompt"];

    if (includeVisualIdea) {
        properties.visualDescription = {
          type: Type.STRING,
          description: getVisualDescSchemaDescription(lang),
        };
        required.push("visualDescription");
    }

    return {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties,
            required,
        },
    };
};


export const breakdownScript = async (
  apiKeys: string[],
  scriptText: string,
  duration: number,
  themeName: string,
  themeWps: number,
  aspectRatioValue: string,
  imageStylePrompt: string,
  characterDefinitions: string,
  translationLanguage: string,
  includeVisualIdea: boolean,
  customRules: string,
  lang: 'vi' | 'en' | 'zh' | 'ja' | 'ko',
  errorApiKeyMissing: string,
  errorInvalidResponse: string,
  errorGeneral: string,
  errorAllKeysFailed: string,
): Promise<Scene[]> => {

  const targetWordCount = Math.round(duration * themeWps);

  const mainPrompt = getPromptTemplate(lang, {
    duration,
    themeName,
    targetWordCount,
    imageStylePrompt,
    aspectRatioValue,
    characterDefinitions,
    translationLanguage,
    includeVisualIdea,
    customRules,
    scriptText,
  });

  const schema = buildSchema(lang, includeVisualIdea);

  return callGemini(apiKeys, mainPrompt, schema, errorInvalidResponse, errorGeneral, errorApiKeyMissing, errorAllKeysFailed);
};


export const generatePromptsFromScenes = async (
  apiKeys: string[],
  scriptText: string,
  themeName: string,
  aspectRatioValue: string,
  imageStylePrompt: string,
  characterDefinitions: string,
  translationLanguage: string,
  includeVisualIdea: boolean,
  lang: 'vi' | 'en' | 'zh' | 'ja' | 'ko',
  errorApiKeyMissing: string,
  errorInvalidResponse: string,
  errorGeneral: string,
  errorAllKeysFailed: string,
): Promise<Scene[]> => {

  const mainPrompt = getPromptTemplateForPrompter(lang, {
    themeName,
    imageStylePrompt,
    aspectRatioValue,
    characterDefinitions,
    translationLanguage,
    includeVisualIdea,
    scriptText,
  });

  const schema = buildSchema(lang, includeVisualIdea);
  
  return callGemini(apiKeys, mainPrompt, schema, errorInvalidResponse, errorGeneral, errorApiKeyMissing, errorAllKeysFailed);
};