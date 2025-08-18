

export type Language = 'vi' | 'en' | 'zh' | 'ja' | 'ko';

type TranslationKeys = { [key: string]: string };
type AllTranslations = { [key in Language]: TranslationKeys };

const translations: AllTranslations = {
  // --- TIẾNG VIỆT ---
  vi: {
    // App Info & Header
    appTitle: "Trình Phân Cảnh Kịch Bản AI by Bit Đô",
    appDescription: "Dán kịch bản, định nghĩa nhân vật, chọn tùy chọn. AI sẽ tự động chia cảnh, tạo prompt ảnh nhất quán và đúng phong cách.",
    
    // Language Names
    lang_vi: "Tiếng Việt",
    lang_en: "English",
    lang_zh: "中文",
    lang_ja: "日本語",
    lang_ko: "한국어",

    // Tabs
    tab_splitter: "Tự động Phân Cảnh & Tạo Prompt",
    tab_prompter: "Tạo Prompt từ Phân Cảnh có sẵn",

    // Form Labels
    apiKeyLabel: "Google AI API Key",
    durationLabel: "Thời lượng (giây)",
    themeLabel: "Chủ đề",
    ratioLabel: "Tỷ lệ ảnh",
    styleLabel: "Phong cách ảnh",
    translateLabel: "Dịch lời thoại sang",
    characterLabel: "Định nghĩa nhân vật (Tùy chọn)",
    scriptLabel: "Kịch bản chính",
    scriptLabel_prompter: "Kịch bản (đã được phân cảnh)",
    prompter_instructions: "Dán kịch bản đã được chia thành các đoạn. AI sẽ nhận diện mỗi đoạn cách nhau bởi một dòng trống là một phân cảnh riêng biệt để tạo prompt.",


    // Placeholders & Tooltips
    apiKeyPlaceholder: "Dán API Key của bạn vào đây",
    apiKeyTooltip: "Khóa của bạn được lưu trữ trong bộ nhớ cục bộ của trình duyệt và không bao giờ được gửi đi đâu ngoại trừ API của Google. Lấy khóa của bạn từ Google AI Studio.",
    placeholderScript: "Xin chào các bạn, chào mừng đã quay trở lại với kênh của chúng mình. Trong video ngày hôm nay, chúng ta sẽ cùng nhau khám phá một chủ đề vô cùng thú vị: lịch sử của những chiếc bánh pizza...",
    placeholderCharacters: `Định nghĩa nhân vật (mỗi dòng một nhân vật):\nArion: một chàng trai trẻ tóc bạc, mắt xanh, mặc áo dài màu xanh.\nElara: một nữ pháp sư thông thái với mái tóc trắng dài, tay cầm một cây trượng phát sáng.`,
    characterPlaceholder: "Định nghĩa nhân vật (mỗi dòng một nhân vật):\nTên Nhân Vật 1: mô tả chi tiết\nArion: a young man with silver hair, green eyes...",
    scriptPlaceholder: "Dán toàn bộ kịch bản của bạn vào đây...",
    scriptPlaceholder_prompter: "Dán kịch bản đã được phân cảnh của bạn vào đây. Mỗi phân cảnh được ngăn cách bởi một dòng trống.",
    scriptPlaceholder_prompter_example: `Tesla mất năm 1943 trong một căn phòng nhỏ, gần như không ai bên cạnh.\n\nÔng để lại hơn 300 bằng sáng chế, cùng hàng loạt sổ tay và ý tưởng, nhưng phần lớn bị lãng quên.\n\nSau khi ông qua đời, FBI đã niêm phong toàn bộ tài liệu nghiên cứu, lo ngại những ý tưởng điên rồ liên quan vũ khí hạt nhân.\n\nPhải đến nửa sau thế kỷ 20, người ta mới bắt đầu nhìn lại. Họ nhận ra Tesla đi trước thời đại cả trăm năm.`,

    // Buttons
    generateButton: "Tạo phân cảnh",
    generatePromptsButton: "Tạo Prompts",
    generatingButton: "Đang phân tích...",
    downloadXlsxButton: "Tải file XLSX",
    downloadTxtButton: "Tải file TXT",
    downloadDocxButton: "Tải file DOCX",
    copiedButton: "Đã chép!",
    cancelButton: "Hủy",
    saveButton: "Lưu",
    
    // Options
    addNewOption: "+ Thêm chủ đề mới...",
    addNewRatio: "+ Thêm tỷ lệ mới...",
    addNewStyle: "+ Thêm phong cách mới...",
    customOptionSuffix: "(Tự tạo)",
    translate_none: "Không dịch (Giữ nguyên gốc)",
    
    // Results Area
    readyTitle: "Sẵn sàng để bắt đầu",
    readyMessage: "Nhập API Key của bạn ở trên và bắt đầu tạo phân cảnh. Kết quả sẽ xuất hiện ở đây.",
    
    // Scene Card
    sceneCardTitle: "Phân cảnh",
    sceneCardOriginalText: "Đoạn kịch bản gốc",
    sceneCardTranslatedText: "Lời thoại đã dịch",
    sceneCardVisualIdea: "Ý tưởng hình ảnh",
    sceneCardImagePrompt: "Prompt tạo ảnh (Tiếng Anh)",

    // Errors
    errorAlertTitle: "Lỗi!",
    errorApiKeyMissing: "Vui lòng cung cấp API Key của Google AI.",
    errorScriptRequired: "Vui lòng nhập kịch bản của bạn.",
    errorOptionsMissing: "Lỗi tùy chọn, vui lòng tải lại trang.",
    errorUnknown: "Đã xảy ra một lỗi. Vui lòng kiểm tra console để biết chi tiết.",
    errorInvalidResponse: "AI đã trả về một phản hồi không hợp lệ. Điều này có thể do kịch bản quá phức tạp hoặc yêu cầu không rõ ràng. Hãy thử đơn giản hóa nó.",
    errorInvalidRatioFormat: 'Tỷ lệ phải có dạng "số:số", ví dụ: 21:9',

    // Modal
    modalTitleTheme: "Thêm chủ đề mới",
    modalTitleRatio: "Thêm tỷ lệ ảnh mới",
    modalTitleStyle: "Thêm phong cách ảnh mới",
    modalDisplayNameLabel: "Tên hiển thị",
    modalDisplayNamePlaceholder: "Ví dụ: Lịch sử hào hùng",
    modalWpsLabel: "Tốc độ đọc (Từ/giây)",
    modalRatioValueLabel: "Giá trị tỷ lệ",
    modalRatioValuePlaceholder: "Ví dụ: 21:9",
    modalStylePromptLabel: "Mô tả Prompt chi tiết",
    modalStylePromptPlaceholder: "Ví dụ: 3D Render, Pixar animation style...",
    
    // XLSX Export
    xlsxSheetName: "Phân Cảnh",
    xlsxFileName: "PhanCanhKichBan",
    txtFileName: "KichBanPhanDoan",
    docxFileName: "KichBanPhanDoan",
    xlsxHeaderSceneNumber: "Số thứ tự",
    xlsxHeaderOriginalText: "Nội dung lời thoại",
    xlsxHeaderTranslatedText: "Nội dung đã dịch",
    xlsxHeaderVisualDesc: "Ý nghĩa hình ảnh",
    xlsxHeaderImagePrompt: "Prompt tạo ảnh",

    // Copyright Intro Section
    copyrightText_part1: "Bản quyền công cụ thuộc về kênh",
    youtubeLinkText: "Kênh YouTube",
    zaloGroupLinkText: "Nhóm Zalo",
    zaloPersonalText: "Zalo Cá nhân:",

    // Footer
    footerText: "Bản quyền thuộc về <a href='https://www.youtube.com/@Bit-Do' target='_blank' rel='noopener noreferrer' class='text-cyan-400 hover:underline'>Bit Đô</a>. Tham gia <a href='https://zalo.me/g/ubgxhh983' target='_blank' rel='noopener noreferrer' class='text-cyan-400 hover:underline'>nhóm Zalo</a> | Liên hệ: 0342472776 | Xem mã nguồn trên <a href='https://github.com' target='_blank' rel='noopener noreferrer' class='text-cyan-400 hover:underline'>GitHub</a>.",

    // Default Option Names
    theme_storytelling: "Kể chuyện / Tóm tắt phim",
    theme_news: "Tin tức / Cập nhật",
    theme_science: "Khoa học / Khám phá",
    theme_tutorial: "Hướng dẫn / DIY",
    theme_vlog: "Vlog đời sống",
    theme_gaming: "Gaming / Bình luận game",
    theme_documentary: "Phim tài liệu",
    theme_comedy: "Hài kịch / Scape",
    theme_review: "Đánh giá sản phẩm / Phim",
    theme_meditation: "Thiền / Thư giãn",
    theme_podcast: "Podcast",
    theme_finance: "Tài chính / Kinh doanh",
    theme_history: "Lịch sử",
    theme_cooking: "Nấu ăn",
    theme_travel: "Du lịch",
    theme_fitness: "Thể hình / Sức khỏe",
    theme_tech: "Công nghệ",
    theme_asmr: "ASMR",
    theme_kids: "Nội dung trẻ em",
    theme_philosophy: "Triết học / Suy ngẫm",
    theme_horror: "Kể chuyện kinh dị",
    'ratio_16:9': "16:9 (Ngang)",
    'ratio_9:16': "9:16 (Dọc)",
    'ratio_1:1': "1:1 (Vuông)",
    'ratio_4:3': "4:3 (Cổ điển)",
    style_automatic: "Tự động",
    style_photorealistic: "Photorealistic",
    style_anime_ghibli: "Anime (Ghibli)",
    style_cyberpunk: "Cyberpunk",
    style_fantasy_art: "Fantasy Art",
    style_watercolor: "Watercolor",
    style_prompt_automatic: 'Tự động (AI tự quyết định phong cách phù hợp nhất với kịch bản)',
    style_prompt_photorealistic: 'Photorealistic, hyper-detailed, DSLR photo',
    style_prompt_anime_ghibli: 'Anime in the style of Ghibli studio, vibrant and emotional, hand-drawn aesthetic',
    style_prompt_cyberpunk: 'Cyberpunk city, neon-drenched, dystopian future, high-tech implants',
    style_prompt_fantasy_art: 'Epic fantasy art, mythological, magical, grand landscapes',
    style_prompt_watercolor: 'Delicate watercolor painting, soft edges, artistic, blended colors',
  },

  // --- ENGLISH ---
  en: {
    appTitle: "AI Script Scene Splitter by Bit Đô",
    appDescription: "Paste your script, define characters, choose options. The AI will automatically split scenes and generate consistent, stylized image prompts.",
    lang_vi: "Tiếng Việt",
    lang_en: "English",
    lang_zh: "中文",
    lang_ja: "日本語",
    lang_ko: "한국어",
    tab_splitter: "Auto Scene Split & Prompt",
    tab_prompter: "Prompt from Pre-scened Script",
    apiKeyLabel: "Google AI API Key",
    durationLabel: "Duration (seconds)",
    themeLabel: "Theme",
    ratioLabel: "Aspect Ratio",
    styleLabel: "Image Style",
    translateLabel: "Translate Dialogue to",
    characterLabel: "Character Definitions (Optional)",
    scriptLabel: "Main Script",
    scriptLabel_prompter: "Script (Pre-scened)",
    prompter_instructions: "Paste your script, already divided into segments. The AI will recognize each segment separated by a blank line as a distinct scene to generate a prompt for.",
    apiKeyPlaceholder: "Paste your API Key here",
    apiKeyTooltip: "Your key is stored in your browser's local storage and is never sent anywhere except to Google's API. Get your key from Google AI Studio.",
    placeholderScript: "Hello everyone, and welcome back to our channel. In today's video, we're going to explore a very interesting topic: the history of pizza...",
    placeholderCharacters: `Define characters (one per line):\nArion: a young man with silver hair, green eyes, wearing a blue tunic.\nElara: a wise sorceress with long white hair, holding a glowing staff.`,
    characterPlaceholder: "Define characters (one per line):\nCharacter Name 1: detailed description\nArion: a young man with silver hair, green eyes...",
    scriptPlaceholder: "Paste your entire script here...",
    scriptPlaceholder_prompter: "Paste your pre-scened script here. Each scene is separated by a blank line.",
    scriptPlaceholder_prompter_example: `Tesla died in 1943 in a small room, almost alone.\n\nHe left behind over 300 patents, numerous notebooks and ideas, but most were forgotten.\n\nAfter his death, the FBI sealed all his research documents, fearing crazy ideas related to nuclear weapons.\n\nIt wasn't until the second half of the 20th century that people began to look back. They realized Tesla was a hundred years ahead of his time.`,
    generateButton: "Generate Scenes",
    generatePromptsButton: "Generate Prompts",
    generatingButton: "Analyzing...",
    downloadXlsxButton: "Download XLSX",
    downloadTxtButton: "Download TXT",
    downloadDocxButton: "Download DOCX",
    copiedButton: "Copied!",
    cancelButton: "Cancel",
    saveButton: "Save",
    addNewOption: "+ Add new theme...",
    addNewRatio: "+ Add new ratio...",
    addNewStyle: "+ Add new style...",
    customOptionSuffix: "(Custom)",
    translate_none: "None (Keep Original)",
    readyTitle: "Ready to Start",
    readyMessage: "Enter your API Key above to begin generating scenes. Your results will appear here.",
    sceneCardTitle: "Scene",
    sceneCardOriginalText: "Original Script Text",
    sceneCardTranslatedText: "Translated Dialogue",
    sceneCardVisualIdea: "Visual Idea",
    sceneCardImagePrompt: "Image Prompt (English)",
    errorAlertTitle: "Error!",
    errorApiKeyMissing: "Please provide your Google AI API Key.",
    errorScriptRequired: "Please enter your script.",
    errorOptionsMissing: "Options error, please reload the page.",
    errorUnknown: "An error occurred. Please check the console for details.",
    errorInvalidResponse: "The AI returned an invalid response. This might be due to a very complex script or an unclear request. Try simplifying it.",
    errorInvalidRatioFormat: 'Ratio must be in "number:number" format, e.g., 21:9',
    modalTitleTheme: "Add New Theme",
    modalTitleRatio: "Add New Aspect Ratio",
    modalTitleStyle: "Add New Image Style",
    modalDisplayNameLabel: "Display Name",
    modalDisplayNamePlaceholder: "e.g., Epic History",
    modalWpsLabel: "Words Per Second",
    modalRatioValueLabel: "Ratio Value",
    modalRatioValuePlaceholder: "e.g., 21:9",
    modalStylePromptLabel: "Detailed Prompt Description",
    modalStylePromptPlaceholder: "e.g., 3D Render, Pixar animation style...",
    xlsxSheetName: "Scenes",
    xlsxFileName: "ScriptScenes",
    txtFileName: "SegmentedScript",
    docxFileName: "SegmentedScript",
    xlsxHeaderSceneNumber: "Scene Number",
    xlsxHeaderOriginalText: "Original Text",
    xlsxHeaderTranslatedText: "Translated Text",
    xlsxHeaderVisualDesc: "Visual Description",
    xlsxHeaderImagePrompt: "Image Prompt",
    copyrightText_part1: "Tool copyright belongs to the channel",
    youtubeLinkText: "YouTube Channel",
    zaloGroupLinkText: "Zalo Group",
    zaloPersonalText: "Personal Zalo:",
    footerText: "Copyright © <a href='https://www.youtube.com/@Bit-Do' target='_blank' rel='noopener noreferrer' class='text-cyan-400 hover:underline'>Bit Đô</a>. Join <a href='https://zalo.me/g/ubgxhh983' target='_blank' rel='noopener noreferrer' class='text-cyan-400 hover:underline'>Zalo Group</a> | Contact: 0342472776 | View source on <a href='https://github.com' target='_blank' rel='noopener noreferrer' class='text-cyan-400 hover:underline'>GitHub</a>.",
    theme_storytelling: "Storytelling / Movie Recap",
    theme_news: "News / Updates",
    theme_science: "Science / Discovery",
    theme_tutorial: "Tutorial / DIY",
    theme_vlog: "Lifestyle Vlog",
    theme_gaming: "Gaming / Commentary",
    theme_documentary: "Documentary",
    theme_comedy: "Comedy / Sketch",
    theme_review: "Product / Movie Review",
    theme_meditation: "Meditation / Relaxation",
    theme_podcast: "Podcast",
    theme_finance: "Finance / Business",
    theme_history: "History",
    theme_cooking: "Cooking",
    theme_travel: "Travel",
    theme_fitness: "Fitness / Health",
    theme_tech: "Technology",
    theme_asmr: "ASMR",
    theme_kids: "Kids Content",
    theme_philosophy: "Philosophy / Contemplation",
    theme_horror: "Horror Storytelling",
    'ratio_16:9': "16:9 (Landscape)",
    'ratio_9:16': "9:16 (Portrait)",
    'ratio_1:1': "1:1 (Square)",
    'ratio_4:3': "4:3 (Classic)",
    style_automatic: "Automatic",
    style_photorealistic: "Photorealistic",
    style_anime_ghibli: "Anime (Ghibli)",
    style_cyberpunk: "Cyberpunk",
    style_fantasy_art: "Fantasy Art",
    style_watercolor: "Watercolor",
    style_prompt_automatic: 'Automatic (AI decides the most suitable style for the script)',
    style_prompt_photorealistic: 'Photorealistic, hyper-detailed, DSLR photo',
    style_prompt_anime_ghibli: 'Anime in the style of Ghibli studio, vibrant and emotional, hand-drawn aesthetic',
    style_prompt_cyberpunk: 'Cyberpunk city, neon-drenched, dystopian future, high-tech implants',
    style_prompt_fantasy_art: 'Epic fantasy art, mythological, magical, grand landscapes',
    style_prompt_watercolor: 'Delicate watercolor painting, soft edges, artistic, blended colors',
  },

  // --- 中文 ---
  zh: {
    appTitle: "AI 剧本场景拆分工具 by Bit Đô",
    appDescription: "粘贴您的剧本，定义角色，选择选项。AI将自动拆分场景并生成风格一致的图像提示。",
    lang_vi: "Tiếng Việt",
    lang_en: "English",
    lang_zh: "中文",
    lang_ja: "日本語",
    lang_ko: "한국어",
    tab_splitter: "自动场景拆分和提示生成",
    tab_prompter: "从预设场景生成提示",
    apiKeyLabel: "Google AI API 密钥",
    durationLabel: "时长 (秒)",
    themeLabel: "主题",
    ratioLabel: "宽高比",
    styleLabel: "图像风格",
    translateLabel: "将对话翻译成",
    characterLabel: "角色定义 (可选)",
    scriptLabel: "主剧本",
    scriptLabel_prompter: "剧本 (已分场景)",
    prompter_instructions: "粘贴您已分段的剧本。AI会将每个用空行分隔的段落识别为独立的场景来生成提示。",
    apiKeyPlaceholder: "在此处粘贴您的 API 密钥",
    apiKeyTooltip: "您的密钥存储在浏览器的本地存储中，除了 Google 的 API 之外，绝不会发送到任何地方。从 Google AI Studio 获取您的密钥。",
    placeholderScript: "大家好，欢迎回到我们的频道。在今天的视频中，我们将探讨一个非常有趣的话题：披萨的历史...",
    placeholderCharacters: `定义角色 (每行一个):\n阿瑞安: 一个银发绿眼的年轻男子，穿着蓝色束腰外衣。\n艾拉拉: 一位白发长长的智慧女巫，手持发光法杖。`,
    characterPlaceholder: "定义角色 (每行一个):\n角色名1: 详细描述\n阿瑞安: a young man with silver hair, green eyes...",
    scriptPlaceholder: "在此处粘贴您的完整剧本...",
    scriptPlaceholder_prompter: "在此处粘贴您已分好场景的剧本。每个场景之间用一个空行隔开。",
    scriptPlaceholder_prompter_example: `特斯拉于1943年在一个小房间里去世，几乎无人陪伴。\n\n他留下了300多项专利，无数的笔记本和想法，但大部分都被遗忘了。\n\n他去世后，联邦调查局（FBI）封存了他所有的研究文件，担心其中与核武器有关的疯狂想法。\n\n直到20世纪下半叶，人们才开始重新审视他。他们意识到特斯拉领先于他所在的时代一百年。`,
    generateButton: "生成场景",
    generatePromptsButton: "生成提示",
    generatingButton: "分析中...",
    downloadXlsxButton: "下载 XLSX",
    downloadTxtButton: "下载 TXT",
    downloadDocxButton: "下载 DOCX",
    copiedButton: "已复制!",
    cancelButton: "取消",
    saveButton: "保存",
    addNewOption: "+ 添加新主题...",
    addNewRatio: "+ 添加新宽高比...",
    addNewStyle: "+ 添加新风格...",
    customOptionSuffix: "(自定义)",
    translate_none: "不翻译 (保留原文)",
    readyTitle: "准备开始",
    readyMessage: "在上方输入您的 API 密钥以开始生成场景。您的结果将显示在此处。",
    sceneCardTitle: "场景",
    sceneCardOriginalText: "原始剧本文字",
    sceneCardTranslatedText: "翻译后的对话",
    sceneCardVisualIdea: "视觉构想",
    sceneCardImagePrompt: "图像提示 (英文)",
    errorAlertTitle: "错误!",
    errorApiKeyMissing: "请输入您的 Google AI API 密钥。",
    errorScriptRequired: "请输入您的剧本。",
    errorOptionsMissing: "选项错误，请重新加载页面。",
    errorUnknown: "发生未知错误。请检查控制台以获取详细信息。",
    errorInvalidResponse: "AI 返回了无效的响应。这可能是由于剧本过于复杂或请求不明确。请尝试简化它。",
    errorInvalidRatioFormat: '宽高比必须是 "数字:数字" 格式，例如: 21:9',
    modalTitleTheme: "添加新主题",
    modalTitleRatio: "添加新宽高比",
    modalTitleStyle: "添加新图像风格",
    modalDisplayNameLabel: "显示名称",
    modalDisplayNamePlaceholder: "例如: 史诗历史",
    modalWpsLabel: "语速 (词/秒)",
    modalRatioValueLabel: "宽高比值",
    modalRatioValuePlaceholder: "例如: 21:9",
    modalStylePromptLabel: "详细提示描述",
    modalStylePromptPlaceholder: "例如: 3D Render, Pixar animation style...",
    xlsxSheetName: "场景",
    xlsxFileName: "剧本场景",
    txtFileName: "分段剧本",
    docxFileName: "分段剧本",
    xlsxHeaderSceneNumber: "场景编号",
    xlsxHeaderOriginalText: "原文",
    xlsxHeaderTranslatedText: "翻译内容",
    xlsxHeaderVisualDesc: "视觉描述",
    xlsxHeaderImagePrompt: "图像提示",
    copyrightText_part1: "工具版权归频道所有",
    youtubeLinkText: "YouTube 频道",
    zaloGroupLinkText: "Zalo 群组",
    zaloPersonalText: "个人 Zalo:",
    footerText: "版权所有 © <a href='https://www.youtube.com/@Bit-Do' target='_blank' rel='noopener noreferrer' class='text-cyan-400 hover:underline'>Bit Đô</a>. 加入 <a href='https://zalo.me/g/ubgxhh983' target='_blank' rel='noopener noreferrer' class='text-cyan-400 hover:underline'>Zalo 群组</a> | 联系: 0342472776 | 在 <a href='https://github.com' target='_blank' rel='noopener noreferrer' class='text-cyan-400 hover:underline'>GitHub</a> 上查看源代码。",
    theme_storytelling: "故事/电影解说",
    theme_news: "新闻/更新",
    theme_science: "科学/发现",
    theme_tutorial: "教程/DIY",
    theme_vlog: "生活Vlog",
    theme_gaming: "游戏/评论",
    theme_documentary: "纪录片",
    theme_comedy: "喜剧/小品",
    theme_review: "产品/电影评论",
    theme_meditation: "冥想/放松",
    theme_podcast: "播客",
    theme_finance: "金融/商业",
    theme_history: "历史",
    theme_cooking: "烹饪",
    theme_travel: "旅行",
    theme_fitness: "健身/健康",
    theme_tech: "科技",
    theme_asmr: "ASMR",
    theme_kids: "儿童内容",
    theme_philosophy: "哲学/思考",
    theme_horror: "恐怖故事",
    'ratio_16:9': "16:9 (横向)",
    'ratio_9:16': "9:16 (纵向)",
    'ratio_1:1': "1:1 (方形)",
    'ratio_4:3': "4:3 (经典)",
    style_automatic: "自动",
    style_photorealistic: "照片级真实",
    style_anime_ghibli: "动漫 (吉卜力)",
    style_cyberpunk: "赛博朋克",
    style_fantasy_art: "奇幻艺术",
    style_watercolor: "水彩",
    style_prompt_automatic: '自动 (AI决定最适合剧本的风格)',
    style_prompt_photorealistic: 'Photorealistic, hyper-detailed, DSLR photo',
    style_prompt_anime_ghibli: 'Anime in the style of Ghibli studio, vibrant and emotional, hand-drawn aesthetic',
    style_prompt_cyberpunk: 'Cyberpunk city, neon-drenched, dystopian future, high-tech implants',
    style_prompt_fantasy_art: 'Epic fantasy art, mythological, magical, grand landscapes',
    style_prompt_watercolor: 'Delicate watercolor painting, soft edges, artistic, blended colors',
  },

  // --- 日本語 ---
  ja: {
    appTitle: "AI脚本シーン分割ツール by Bit Đô",
    appDescription: "脚本を貼り付け、キャラクターを定義し、オプションを選択します。AIが自動的にシーンを分割し、一貫性のあるスタイル化された画像プロンプトを生成します。",
    lang_vi: "Tiếng Việt",
    lang_en: "English",
    lang_zh: "中文",
    lang_ja: "日本語",
    lang_ko: "한국어",
    tab_splitter: "自動シーン分割＆プロンプト生成",
    tab_prompter: "事前分割済み脚本からプロンプトを生成",
    apiKeyLabel: "Google AI APIキー",
    durationLabel: "時間 (秒)",
    themeLabel: "テーマ",
    ratioLabel: "アスペクト比",
    styleLabel: "画像スタイル",
    translateLabel: "対話を翻訳",
    characterLabel: "キャラクター定義 (任意)",
    scriptLabel: "メイン脚本",
    scriptLabel_prompter: "脚本 (シーン分割済み)",
    prompter_instructions: "既にセグメントに分割された脚本を貼り付けてください。AIは空行で区切られた各セグメントを個別のシーンとして認識し、プロンプトを生成します。",
    apiKeyPlaceholder: "ここにAPIキーを貼り付けてください",
    apiKeyTooltip: "キーはブラウザのローカルストレージに保存され、GoogleのAPI以外には送信されません。Google AI Studioからキーを取得してください。",
    placeholderScript: "皆さん、こんにちは。私たちのチャンネルへようこそ。今日のビデオでは、非常に興味深いトピック、ピザの歴史について探求します...",
    placeholderCharacters: `キャラクターを定義します (1行に1人):\nアリオン: 銀髪で緑色の目をした若い男性、青いチュニックを着用。\nエララ: 長い白髪の賢い魔女、光る杖を持っている。`,
    characterPlaceholder: "キャラクターを定義します (1行に1人):\nキャラクター名1: 詳細な説明\nアリオン: a young man with silver hair, green eyes...",
    scriptPlaceholder: "ここに脚本全体を貼り付けてください...",
    scriptPlaceholder_prompter: "ここにシーン分割済みの脚本を貼り付けてください。各シーンは空行で区切られます。",
    scriptPlaceholder_prompter_example: `テスラは1943年に小さな部屋で、ほとんど一人で亡くなりました。\n\n彼は300以上の特許、多数のノートやアイデアを残しましたが、そのほとんどは忘れ去られました。\n\n彼の死後、FBIは核兵器に関連する狂気じみたアイデアを恐れて、彼の研究資料をすべて封印しました。\n\n人々が彼を再評価し始めたのは20世紀後半になってからでした。彼らはテスラが時代を100年も先取りしていたことに気づきました。`,
    generateButton: "シーンを生成",
    generatePromptsButton: "プロンプトを生成",
    generatingButton: "分析中...",
    downloadXlsxButton: "XLSX をダウンロード",
    downloadTxtButton: "TXT をダウンロード",
    downloadDocxButton: "DOCX をダウンロード",
    copiedButton: "コピーしました！",
    cancelButton: "キャンセル",
    saveButton: "保存",
    addNewOption: "+ 新しいテーマを追加...",
    addNewRatio: "+ 新しい比率を追加...",
    addNewStyle: "+ 新しいスタイルを追加...",
    customOptionSuffix: "(カスタム)",
    translate_none: "翻訳しない (原文のまま)",
    readyTitle: "準備完了",
    readyMessage: "上記のAPIキーを入力してシーンの生成を開始してください。結果はここに表示されます。",
    sceneCardTitle: "シーン",
    sceneCardOriginalText: "元の脚本テキスト",
    sceneCardTranslatedText: "翻訳された対話",
    sceneCardVisualIdea: "ビジュアルアイデア",
    sceneCardImagePrompt: "画像プロンプト (英語)",
    errorAlertTitle: "エラー！",
    errorApiKeyMissing: "Google AI APIキーを入力してください。",
    errorScriptRequired: "脚本を入力してください。",
    errorOptionsMissing: "オプションエラーです。ページをリロードしてください。",
    errorUnknown: "不明なエラーが発生しました。詳細はコンソールを確認してください。",
    errorInvalidResponse: "AIが無効な応答を返しました。これは、脚本が複雑すぎるか、リクエストが不明確なことが原因である可能性があります。簡略化してみてください。",
    errorInvalidRatioFormat: 'アスペクト比は "数値:数値" 形式でなければなりません。例: 21:9',
    modalTitleTheme: "新しいテーマを追加",
    modalTitleRatio: "新しいアスペクト比を追加",
    modalTitleStyle: "新しい画像スタイルを追加",
    modalDisplayNameLabel: "表示名",
    modalDisplayNamePlaceholder: "例: 壮大な歴史",
    modalWpsLabel: "読書速度 (単語/秒)",
    modalRatioValueLabel: "アスペクト比の値",
    modalRatioValuePlaceholder: "例: 21:9",
    modalStylePromptLabel: "詳細なプロンプト説明",
    modalStylePromptPlaceholder: "例: 3D Render, Pixar animation style...",
    xlsxSheetName: "シーン",
    xlsxFileName: "脚本シーン",
    txtFileName: "分節脚本",
    docxFileName: "分節脚本",
    xlsxHeaderSceneNumber: "シーン番号",
    xlsxHeaderOriginalText: "元のテキスト",
    xlsxHeaderTranslatedText: "翻訳された内容",
    xlsxHeaderVisualDesc: "ビジュアル説明",
    xlsxHeaderImagePrompt: "画像プロンプト",
    copyrightText_part1: "ツールの著作権はチャンネルに帰属します",
    youtubeLinkText: "YouTubeチャンネル",
    zaloGroupLinkText: "Zaloグループ",
    zaloPersonalText: "個人Zalo:",
    footerText: "著作権 © <a href='https://www.youtube.com/@Bit-Do' target='_blank' rel='noopener noreferrer' class='text-cyan-400 hover:underline'>Bit Đô</a>. <a href='https://zalo.me/g/ubgxhh983' target='_blank' rel='noopener noreferrer' class='text-cyan-400 hover:underline'>Zalo グループ</a>に参加 | 連絡先: 0342472776 | <a href='https://github.com' target='_blank' rel='noopener noreferrer' class='text-cyan-400 hover:underline'>GitHub</a>でソースを表示。",
    theme_storytelling: "物語/映画の要約",
    theme_news: "ニュース/更新情報",
    theme_science: "科学/発見",
    theme_tutorial: "チュートリアル/DIY",
    theme_vlog: "日常Vlog",
    theme_gaming: "ゲーム/実況",
    theme_documentary: "ドキュメンタリー",
    theme_comedy: "コメディ/寸劇",
    theme_review: "製品/映画レビュー",
    theme_meditation: "瞑想/リラクゼーション",
    theme_podcast: "ポッドキャスト",
    theme_finance: "金融/ビジネス",
    theme_history: "歴史",
    theme_cooking: "料理",
    theme_travel: "旅行",
    theme_fitness: "フィットネス/健康",
    theme_tech: "テクノロジー",
    theme_asmr: "ASMR",
    theme_kids: "子供向けコンテンツ",
    theme_philosophy: "哲学/思索",
    theme_horror: "ホラーストーリー",
    'ratio_16:9': "16:9 (横)",
    'ratio_9:16': "9:16 (縦)",
    'ratio_1:1': "1:1 (正方形)",
    'ratio_4:3': "4:3 (クラシック)",
    style_automatic: "自動",
    style_photorealistic: "フォトリアリスティック",
    style_anime_ghibli: "アニメ (ジブリ)",
    style_cyberpunk: "サイバーパンク",
    style_fantasy_art: "ファンタジーアート",
    style_watercolor: "水彩画",
    style_prompt_automatic: '自動 (AIが脚本に最も適したスタイルを決定します)',
    style_prompt_photorealistic: 'Photorealistic, hyper-detailed, DSLR photo',
    style_prompt_anime_ghibli: 'Anime in the style of Ghibli studio, vibrant and emotional, hand-drawn aesthetic',
    style_prompt_cyberpunk: 'Cyberpunk city, neon-drenched, dystopian future, high-tech implants',
    style_prompt_fantasy_art: 'Epic fantasy art, mythological, magical, grand landscapes',
    style_prompt_watercolor: 'Delicate watercolor painting, soft edges, artistic, blended colors',
  },

  // --- 한국어 ---
  ko: {
    appTitle: "AI 스크립트 장면 분할기 by Bit Đô",
    appDescription: "스크립트를 붙여넣고, 캐릭터를 정의하고, 옵션을 선택하세요. AI가 자동으로 장면을 분할하고 일관된 스타일의 이미지 프롬프트를 생성합니다.",
    lang_vi: "Tiếng Việt",
    lang_en: "English",
    lang_zh: "中文",
    lang_ja: "日本語",
    lang_ko: "한국어",
    tab_splitter: "자동 장면 분할 및 프롬프트 생성",
    tab_prompter: "미리 나눈 장면에서 프롬프트 생성",
    apiKeyLabel: "Google AI API 키",
    durationLabel: "지속 시간 (초)",
    themeLabel: "테마",
    ratioLabel: "종횡비",
    styleLabel: "이미지 스타일",
    translateLabel: "대화 번역",
    characterLabel: "캐릭터 정의 (선택 사항)",
    scriptLabel: "메인 스크립트",
    scriptLabel_prompter: "스크립트 (장면 분할됨)",
    prompter_instructions: "이미 세그먼트로 나뉜 스크립트를 붙여넣으세요. AI는 빈 줄로 구분된 각 세그먼트를 별개의 장면으로 인식하여 프롬프트를 생성합니다.",
    apiKeyPlaceholder: "API 키를 여기에 붙여넣으세요",
    apiKeyTooltip: "키는 브라우저의 로컬 저장소에 저장되며 Google의 API를 제외하고는 어디에도 전송되지 않습니다. Google AI Studio에서 키를 받으세요.",
    placeholderScript: "여러분, 안녕하세요. 저희 채널에 오신 것을 환영합니다. 오늘 영상에서는 매우 흥미로운 주제인 피자의 역사에 대해 알아보겠습니다...",
    placeholderCharacters: `캐릭터 정의 (한 줄에 한 명):\n아리온: 은색 머리카락과 녹색 눈을 가진 젊은 남성, 파란색 튜닉을 입고 있음.\n엘라라: 긴 흰 머리카락을 가진 현명한 마법사, 빛나는 지팡이를 들고 있음.`,
    characterPlaceholder: "캐릭터 정의 (한 줄에 한 명):\n캐릭터 이름 1: 상세 설명\n아리온: a young man with silver hair, green eyes...",
    scriptPlaceholder: "여기에 전체 스크립트를 붙여넣으세요...",
    scriptPlaceholder_prompter: "미리 장면을 나눈 스크립트를 여기에 붙여넣으세요. 각 장면은 빈 줄로 구분됩니다.",
    scriptPlaceholder_prompter_example: `테슬라는 1943년 작은 방에서 거의 혼자 사망했습니다.\n\n그는 300개가 넘는 특허, 수많은 노트와 아이디어를 남겼지만 대부분 잊혀졌습니다.\n\n그의 사후 FBI는 핵무기와 관련된 미친 아이디어를 우려하여 그의 모든 연구 문서를 봉인했습니다.\n\n20세기 후반이 되어서야 사람들은 그를 다시 돌아보기 시작했습니다. 그들은 테슬라가 시대를 100년이나 앞서갔다는 것을 깨달았습니다.`,
    generateButton: "장면 생성",
    generatePromptsButton: "프롬프트 생성",
    generatingButton: "분석 중...",
    downloadXlsxButton: "XLSX 다운로드",
    downloadTxtButton: "TXT 다운로드",
    downloadDocxButton: "DOCX 다운로드",
    copiedButton: "복사됨!",
    cancelButton: "취소",
    saveButton: "저장",
    addNewOption: "+ 새 테마 추가...",
    addNewRatio: "+ 새 비율 추가...",
    addNewStyle: "+ 새 스타일 추가...",
    customOptionSuffix: "(사용자 정의)",
    translate_none: "번역 안 함 (원본 유지)",
    readyTitle: "시작할 준비가 되었습니다",
    readyMessage: "장면 생성을 시작하려면 위에 API 키를 입력하세요. 결과는 여기에 표시됩니다.",
    sceneCardTitle: "장면",
    sceneCardOriginalText: "원본 스크립트 텍스트",
    sceneCardTranslatedText: "번역된 대화",
    sceneCardVisualIdea: "시각적 아이디어",
    sceneCardImagePrompt: "이미지 프롬프트 (영어)",
    errorAlertTitle: "오류!",
    errorApiKeyMissing: "Google AI API 키를 입력해주세요.",
    errorScriptRequired: "스크립트를 입력해주세요.",
    errorOptionsMissing: "옵션 오류, 페이지를 새로고침해주세요.",
    errorUnknown: "알 수 없는 오류가 발생했습니다. 자세한 내용은 콘솔을 확인하세요.",
    errorInvalidResponse: "AI가 잘못된 응답을 반환했습니다. 스크립트가 너무 복잡하거나 요청이 명확하지 않기 때문일 수 있습니다. 간단하게 시도해보세요.",
    errorInvalidRatioFormat: '종횡비는 "숫자:숫자" 형식이어야 합니다. 예: 21:9',
    modalTitleTheme: "새 테마 추가",
    modalTitleRatio: "새 종횡비 추가",
    modalTitleStyle: "새 이미지 스타일 추가",
    modalDisplayNameLabel: "표시 이름",
    modalDisplayNamePlaceholder: "예: 장대한 역사",
    modalWpsLabel: "읽기 속도 (단어/초)",
    modalRatioValueLabel: "종횡비 값",
    modalRatioValuePlaceholder: "예: 21:9",
    modalStylePromptLabel: "상세 프롬프트 설명",
    modalStylePromptPlaceholder: "예: 3D Render, Pixar animation style...",
    xlsxSheetName: "장면",
    xlsxFileName: "스크립트_장면",
    txtFileName: "분할된_스크립트",
    docxFileName: "분할된_스크립트",
    xlsxHeaderSceneNumber: "장면 번호",
    xlsxHeaderOriginalText: "원본 텍스트",
    xlsxHeaderTranslatedText: "번역된 내용",
    xlsxHeaderVisualDesc: "시각적 설명",
    xlsxHeaderImagePrompt: "이미지 프롬프트",
    copyrightText_part1: "도구 저작권은 채널에 있습니다",
    youtubeLinkText: "YouTube 채널",
    zaloGroupLinkText: "Zalo 그룹",
    zaloPersonalText: "개인 Zalo:",
    footerText: "저작권 © <a href='https://www.youtube.com/@Bit-Do' target='_blank' rel='noopener noreferrer' class='text-cyan-400 hover:underline'>Bit Đô</a>. <a href='https://zalo.me/g/ubgxhh983' target='_blank' rel='noopener noreferrer' class='text-cyan-400 hover:underline'>Zalo 그룹</a>에 가입 | 연락처: 0342472776 | <a href='https://github.com' target='_blank' rel='noopener noreferrer' class='text-cyan-400 hover:underline'>GitHub</a>에서 소스 보기.",
    theme_storytelling: "스토리텔링 / 영화 요약",
    theme_news: "뉴스 / 업데이트",
    theme_science: "과학 / 발견",
    theme_tutorial: "튜토리얼 / DIY",
    theme_vlog: "일상 브이로그",
    theme_gaming: "게임 / 해설",
    theme_documentary: "다큐멘터리",
    theme_comedy: "코미디 / 스케치",
    theme_review: "제품 / 영화 리뷰",
    theme_meditation: "명상 / 휴식",
    theme_podcast: "팟캐스트",
    theme_finance: "금융 / 비즈니스",
    theme_history: "역사",
    theme_cooking: "요리",
    theme_travel: "여행",
    theme_fitness: "피트니스 / 건강",
    theme_tech: "기술",
    theme_asmr: "ASMR",
    theme_kids: "어린이 콘텐츠",
    theme_philosophy: "철학 / 사색",
    theme_horror: "공포 이야기",
    'ratio_16:9': "16:9 (가로)",
    'ratio_9:16': "9:16 (세로)",
    'ratio_1:1': "1:1 (정사각형)",
    'ratio_4:3': "4:3 (클래식)",
    style_automatic: "자동",
    style_photorealistic: "사실적",
    style_anime_ghibli: "애니메이션 (지브리)",
    style_cyberpunk: "사이버펑크",
    style_fantasy_art: "판타지 아트",
    style_watercolor: "수채화",
    style_prompt_automatic: '자동 (AI가 스크립트에 가장 적합한 스타일을 결정합니다)',
    style_prompt_photorealistic: 'Photorealistic, hyper-detailed, DSLR photo',
    style_prompt_anime_ghibli: 'Anime in the style of Ghibli studio, vibrant and emotional, hand-drawn aesthetic',
    style_prompt_cyberpunk: 'Cyberpunk city, neon-drenched, dystopian future, high-tech implants',
    style_prompt_fantasy_art: 'Epic fantasy art, mythological, magical, grand landscapes',
    style_prompt_watercolor: 'Delicate watercolor painting, soft edges, artistic, blended colors',
  },
};

type PromptTemplateArgs = {
  duration?: number,
  themeName?: string,
  targetWordCount?: number,
  imageStylePrompt: string,
  aspectRatioValue: string,
  characterDefinitions: string,
  translationLanguage: string,
  scriptText: string,
}

const languageMap: { [key: string]: string } = {
    vi: "Vietnamese",
    en: "English",
    zh: "Chinese",
    ja: "Japanese",
    ko: "Korean"
};

const imagePromptRules = (imageStylePrompt: string, aspectRatioValue: string, characterDefinitions: string, translationLanguage: string) => `
**IMAGE PROMPT CREATION RULES (MOST IMPORTANT):**
You must create each 'imagePrompt' like an expert prompt engineer. Strictly adhere to the following rules:

1.  **THE GOLDEN FORMULA:** Each prompt must be constructed in ENGLISH using the following structure:
    **[Medium & Style] of [Subject] + [Action/Pose] + in [Setting/Environment] + with [Lighting] + [Color] + [Camera & Composition] + [Details, Quality & Parameters]**

2.  **DETAILED COMPONENT GUIDE:**
    -   **Medium & Style:** You must use the following style: **${imageStylePrompt}**. If it's "Automatic", choose the most fitting style yourself.
    -   **Subject, Action, Setting:** Infer directly from the content of the \`originalText\` for that scene. Be very specific.
    -   **Lighting:** You **MUST** choose a lighting type. Infer from the mood of the \`originalText\`. EXAMPLES: 'soft natural light' for peaceful scenes, 'dramatic lighting, cinematic lighting' for tense scenes, 'neon lights' for city nights, 'golden hour' for sunsets.
    -   **Color:** You **MUST** describe the color palette. EXAMPLES: 'vibrant colors' for happy scenes, 'monochromatic blue, cool tones' for sad or cold scenes, 'pastel color palette' for dreamy scenes.
    -   **Camera & Composition:** You **MUST** choose a camera shot. Infer for cinematic effect. EXAMPLES: 'wide-angle shot, landscape' for vast scenery, 'close-up shot, portrait' for character emotions, 'low-angle shot' to show grandeur, 'aerial view' for an overview.
    -   **Details, Quality & Parameters:** **ALWAYS** end the prompt with the following string, including the technical parameter for the aspect ratio: ", highly detailed, intricate details, masterpiece, 8k --ar ${aspectRatioValue}".

${characterDefinitions.trim()
    ? `3. **Character Consistency (Crucial):** Below are user-provided character definitions. They might be written in natural language, detailed bullet points, or just keywords.
        **Your Task:**
        - **Read and Understand:** Analyze the text below to identify the name and core visual traits of each character (appearance, clothing, weapons, distinct features).
        - **Synthesize & Insert:** When a character's name (e.g., "Kael", "Lyra") appears in a scene's \`originalText\`, you must automatically **synthesize a concise visual description** of that character and **insert it naturally into the \`imagePrompt\`**.
        - **Focus on Visuals:** Ignore non-visual details like "Personality", "History", or "Relationships". The goal is to create a consistent visual description for the image generation AI.

        **CHARACTER DEFINITIONS TO ANALYZE AND USE:**
        ---
        ${characterDefinitions}
        ---`
    : ""}

${translationLanguage && translationLanguage !== 'none'
    ? `4. **TRANSLATION (Conditional):** The user has requested a translation. For each scene, you **MUST** translate the \`originalText\` into **${languageMap[translationLanguage] || translationLanguage}**.
    - Place the translated text into a new field called \`translatedText\`.
    - If the original text is already in ${languageMap[translationLanguage] || translationLanguage}, just copy it to the \`translatedText\` field.
    - The translation must be accurate and natural.`
    : ""}

5.  **Ratio Optimization (Creative):** In addition to adding the technical parameter above, let the **${aspectRatioValue}** aspect ratio influence your description's content. For '9:16', describe vertical elements. For '16:9', describe wide landscapes.
`;


const enPromptTemplate = ({ duration, themeName, targetWordCount, imageStylePrompt, aspectRatioValue, characterDefinitions, translationLanguage, scriptText }: PromptTemplateArgs) => `Analyze the following script. Your task is to split it into scenes and create image prompts according to the detailed rules below.

**SCENE SPLITTING RULES:**
1.  **Duration:** Each scene's original text should correspond to a speaking duration of approximately ${duration} seconds. Based on the "${themeName}" theme, estimate the original text length for each scene to be around ${targetWordCount} words. Split at natural pauses.
2.  **Output Format:** Return a JSON array following the provided schema.
${imagePromptRules(imageStylePrompt, aspectRatioValue, characterDefinitions, translationLanguage)}
**SCRIPT TO ANALYZE:**
${scriptText}`;


const viPromptTemplate = ({ duration, themeName, targetWordCount, imageStylePrompt, aspectRatioValue, characterDefinitions, translationLanguage, scriptText }: PromptTemplateArgs) => `Phân tích kịch bản sau đây. Nhiệm vụ của bạn là chia nó thành các phân cảnh và tạo prompt ảnh theo các quy tắc chi tiết dưới đây.

**QUY TẮC PHÂN CẢNH:**
1. **Thời lượng:** Mỗi phân cảnh phải có độ dài văn bản gốc tương ứng với thời lượng nói khoảng ${duration} giây. Dựa trên chủ đề "${themeName}", hãy ước tính độ dài văn bản gốc cho mỗi phân cảnh vào khoảng ${targetWordCount} từ. Chia ở những điểm ngắt nghỉ tự nhiên.
2. **Định dạng Output:** Trả về một mảng JSON theo schema đã cung cấp.
${imagePromptRules(imageStylePrompt, aspectRatioValue, characterDefinitions, translationLanguage).replace('**IMAGE PROMPT CREATION RULES (MOST IMPORTANT):**', '**QUY TẮC TẠO PROMPT ẢNH (QUAN TRỌNG NHẤT):**')}
**KỊCH BẢN ĐỂ PHÂN TÍCH:**
${scriptText}`;


const enPromptTemplatePrompter = ({ themeName, imageStylePrompt, aspectRatioValue, characterDefinitions, translationLanguage, scriptText }: PromptTemplateArgs) => `Analyze the following pre-scened script. Your task is to create image prompts for each scene according to the detailed rules below.

**SCENE PROCESSING RULES:**
1.  **Scene Definition:** The script is already divided into scenes. **Each block of text separated by one or more blank lines is a distinct scene.**
2.  **Contextual Theme:** The overall theme for this script is "${themeName}". Use this to guide the mood and style of your visual descriptions and prompt creation.
3.  **Task:** You do not need to split scenes. Process each given scene sequentially.
4.  **Output Format:** Return a JSON array following the provided schema, where each object corresponds to a scene from the input script.
${imagePromptRules(imageStylePrompt, aspectRatioValue, characterDefinitions, translationLanguage)}
**PRE-SCENED SCRIPT TO ANALYZE:**
${scriptText}`;

const viPromptTemplatePrompter = ({ themeName, imageStylePrompt, aspectRatioValue, characterDefinitions, translationLanguage, scriptText }: PromptTemplateArgs) => `Phân tích kịch bản đã được phân cảnh sẵn sau đây. Nhiệm vụ của bạn là tạo prompt ảnh cho mỗi phân cảnh theo các quy tắc chi tiết dưới đây.

**QUY TẮC XỬ LÝ PHÂN CẢNH:**
1.  **Định nghĩa phân cảnh:** Kịch bản đã được chia thành các phân cảnh. **Mỗi đoạn văn bản được ngăn cách bởi một dòng trống được coi là một phân cảnh riêng biệt.**
2.  **Chủ đề Ngữ cảnh:** Chủ đề tổng thể cho kịch bản này là "${themeName}". Hãy sử dụng thông tin này để định hướng không khí và phong cách cho các mô tả hình ảnh và việc tạo prompt của bạn.
3.  **Nhiệm vụ:** Bạn không cần phải chia cảnh nữa. Hãy xử lý tuần tự từng phân cảnh đã cho.
4.  **Định dạng Output:** Trả về một mảng JSON theo schema đã cung cấp, trong đó mỗi object tương ứng với một phân cảnh từ kịch bản đầu vào.
${imagePromptRules(imageStylePrompt, aspectRatioValue, characterDefinitions, translationLanguage).replace('**IMAGE PROMPT CREATION RULES (MOST IMPORTANT):**', '**QUY TẮC TẠO PROMPT ẢNH (QUAN TRỌNG NHẤT):**')}
**KỊCH BẢN ĐÃ PHÂN CẢNH ĐỂ PHÂN TÍCH:**
${scriptText}`;


const promptTemplates: {[key in Language]: (args: PromptTemplateArgs) => string} = {
  vi: viPromptTemplate,
  en: enPromptTemplate,
  zh: enPromptTemplate,
  ja: enPromptTemplate,
  ko: enPromptTemplate
};

const promptTemplatesForPrompter: {[key in Language]: (args: PromptTemplateArgs) => string} = {
  vi: viPromptTemplatePrompter,
  en: enPromptTemplatePrompter,
  zh: enPromptTemplatePrompter,
  ja: enPromptTemplatePrompter,
  ko: enPromptTemplatePrompter
};


const visualDescSchemaDescriptions: {[key in Language]: string} = {
  vi: "Mô tả ngắn gọn bằng TIẾNG VIỆT về ý tưởng hình ảnh sẽ minh họa cho đoạn văn bản này.",
  en: "A brief description in ENGLISH of the visual idea that will illustrate this text passage.",
  zh: "用中文简要描述将说明此文本段落的视觉概念。",
  ja: "このテキスト箇所を説明する視覚的なアイデアの簡単な日本語での説明。",
  ko: "이 텍스트 구절을 설명할 시각적 아이디어에 대한 한국어의 간략한 설명。",
}

export const getPromptTemplate = (lang: Language, args: PromptTemplateArgs) => {
    return (promptTemplates[lang] || promptTemplates['en'])(args);
}

export const getPromptTemplateForPrompter = (lang: Language, args: PromptTemplateArgs) => {
    return (promptTemplatesForPrompter[lang] || promptTemplatesForPrompter['en'])(args);
}

export const getVisualDescSchemaDescription = (lang: Language) => {
    return visualDescSchemaDescriptions[lang] || visualDescSchemaDescriptions['en'];
}

export default translations;