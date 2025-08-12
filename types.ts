// Cấu trúc chung cho các tùy chọn đơn giản như Tỷ lệ ảnh
export interface Option {
  id: string; // ID duy nhất, ví dụ: '16:9' hoặc 'custom-ratio-123'
  name: string; // Tên hiển thị, ví dụ: "16:9 (Ngang)"
  value: string; // Giá trị thực tế, ví dụ: "16:9"
  isCustom?: boolean;
}

// Cấu trúc cho Chủ đề, có chứa tốc độ đọc (Words Per Second)
export interface ThemeOption {
  id: string;
  name: string; // Tên hiển thị, ví dụ: "Kể chuyện"
  wps: number; // Words Per Second
  isCustom?: boolean;
}

// Cấu trúc cho Phong cách, có chứa một đoạn prompt chi tiết
export interface StyleOption {
  id:string;
  name: string; // Tên hiển thị, ví dụ: "Photorealistic"
  prompt: string; // Đoạn prompt chi tiết để chèn vào câu lệnh
  isCustom?: boolean;
}

export interface Scene {
  sceneNumber: number;
  originalText: string;
  translatedText?: string;
  visualDescription: string;
  imagePrompt: string;
}