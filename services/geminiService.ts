import { GoogleGenAI, Type } from "@google/genai";
import type { Scene } from "../types";
import { getPromptTemplate, getVisualDescSchemaDescription, getPromptTemplateForPrompter } from "../i18n/locales";


const callGemini = async (
  apiKey: string,
  mainPrompt: string,
  schema: any,
  errorInvalidResponse: string,
  errorGeneral: string
): Promise<Scene[]> => {
    const ai = new GoogleGenAI({ apiKey });
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
                typeof item.visualDescription === 'string' &&
                typeof item.imagePrompt === 'string'
            ) {
                return {
                    sceneNumber: item.sceneNumber,
                    originalText: item.originalText,
                    visualDescription: item.visualDescription,
                    imagePrompt: item.imagePrompt,
                    translatedText: typeof item.translatedText === 'string' ? item.translatedText : undefined,
                };
            }
            return null;
        }).filter((item): item is Scene => item !== null);

        if (validatedScenes.length !== parsedData.length) {
            console.warn("Some items in the AI's response had incorrect formats and were filtered out.");
        }

        return validatedScenes;

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        if (error instanceof Error) {
            if (error.message.includes('json')) {
                throw new Error(errorInvalidResponse);
            }
            if (error.message.includes('API key not valid')) {
                throw new Error('API key not valid. Please check your key.');
            }
        }
        throw new Error(errorGeneral);
    }
}

export const breakdownScript = async (
  apiKey: string,
  scriptText: string,
  duration: number,
  themeName: string,
  themeWps: number,
  aspectRatioValue: string,
  imageStylePrompt: string,
  characterDefinitions: string,
  translationLanguage: string,
  lang: 'vi' | 'en' | 'zh' | 'ja' | 'ko',
  errorApiKeyMissing: string,
  errorInvalidResponse: string,
  errorGeneral: string
): Promise<Scene[]> => {

  if (!apiKey) {
    throw new Error(errorApiKeyMissing);
  }

  const targetWordCount = Math.round(duration * themeWps);

  const mainPrompt = getPromptTemplate(lang, {
    duration,
    themeName,
    targetWordCount,
    imageStylePrompt,
    aspectRatioValue,
    characterDefinitions,
    translationLanguage,
    scriptText,
  });

  const schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
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
        visualDescription: {
          type: Type.STRING,
          description: getVisualDescSchemaDescription(lang),
        },
        imagePrompt: {
          type: Type.STRING,
          description: "A detailed, professional prompt in ENGLISH for AI image generation, strictly following the provided GOLDEN FORMULA."
        },
      },
      required: ["sceneNumber", "originalText", "visualDescription", "imagePrompt"],
    },
  };

  return callGemini(apiKey, mainPrompt, schema, errorInvalidResponse, errorGeneral);
};


export const generatePromptsFromScenes = async (
  apiKey: string,
  scriptText: string,
  themeName: string,
  aspectRatioValue: string,
  imageStylePrompt: string,
  characterDefinitions: string,
  translationLanguage: string,
  lang: 'vi' | 'en' | 'zh' | 'ja' | 'ko',
  errorApiKeyMissing: string,
  errorInvalidResponse: string,
  errorGeneral: string
): Promise<Scene[]> => {

  if (!apiKey) {
    throw new Error(errorApiKeyMissing);
  }

  const mainPrompt = getPromptTemplateForPrompter(lang, {
    themeName,
    imageStylePrompt,
    aspectRatioValue,
    characterDefinitions,
    translationLanguage,
    scriptText,
  });

  const schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        sceneNumber: {
          type: Type.INTEGER,
          description: "The sequential number of the scene, starting from 1, corresponding to the input block."
        },
        originalText: {
          type: Type.STRING,
          description: "The full, unchanged original text from the script for this scene block."
        },
        translatedText: {
            type: Type.STRING,
            description: `The translation of the original text into the requested language. This field is only present if a translation was requested.`
        },
        visualDescription: {
          type: Type.STRING,
          description: getVisualDescSchemaDescription(lang),
        },
        imagePrompt: {
          type: Type.STRING,
          description: "A detailed, professional prompt in ENGLISH for AI image generation, strictly following the provided GOLDEN FORMULA."
        },
      },
      required: ["sceneNumber", "originalText", "visualDescription", "imagePrompt"],
    },
  };
  
  return callGemini(apiKey, mainPrompt, schema, errorInvalidResponse, errorGeneral);
};