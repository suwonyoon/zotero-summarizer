// ZoteroGPT preferences
pref("apiKey", "");
pref("model", "gpt-5-mini");
pref("systemPrompt", "You are a research paper summarizer. Provide only the summary without any meta-commentary or explanations of what you did.");
pref("presets", '{"language":[{"id":"lang-en","name":"English","prompt":"Please respond in English."},{"id":"lang-ko","name":"Korean","prompt":"한국어로 응답해주세요."},{"id":"lang-hybrid","name":"Korean+English Hybrid","prompt":"한국어 문법을 사용하되, 전문 용어는 영어로 유지해주세요. (Use Korean grammar but keep technical terms in English.)"}],"content":[{"id":"content-academic","name":"Academic Summary","prompt":"Provide an academic summary including: research question, methodology, key findings, and implications."},{"id":"content-keypoints","name":"Key Points","prompt":"Summarize the main ideas in bullet points."},{"id":"content-methodology","name":"Methodology Focus","prompt":"Focus on the methodology and experimental design used in this research."},{"id":"content-results","name":"Results & Conclusions","prompt":"Focus on the findings and conclusions of the research."},{"id":"content-critical","name":"Critical Analysis","prompt":"Provide a critical analysis evaluating the strengths, weaknesses, and limitations of this research."},{"id":"content-eli5","name":"ELI5 (Explain Like I\'m 5)","prompt":"Explain this research in simple terms that a beginner can understand."}]}');
pref("selectedPresets", '{"language":"lang-en","content":["content-academic"],"useMarkdownConversion":false}');

// Template example preferences (can be removed)
pref("enable", true);
pref("input", "This is input");
