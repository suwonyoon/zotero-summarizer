# Zotero Summarizer

> AI-powered PDF summarization for Zotero using OpenAI GPT

[![zotero target version](https://img.shields.io/badge/Zotero-7-green?style=flat-square&logo=zotero&logoColor=CC2936)](https://www.zotero.org)
[![Using Zotero Plugin Template](https://img.shields.io/badge/Using-Zotero%20Plugin%20Template-blue?style=flat-square&logo=github)](https://github.com/windingwind/zotero-plugin-template)
[![License](https://img.shields.io/github/license/suwonyoon/zotero-summarizer?style=flat-square)](https://github.com/suwonyoon/zotero-summarizer/blob/main/LICENSE)
[![Latest Release](https://img.shields.io/github/v/release/suwonyoon/zotero-summarizer?style=flat-square)](https://github.com/suwonyoon/zotero-summarizer/releases/latest)
[![GitHub Downloads](https://img.shields.io/github/downloads/suwonyoon/zotero-summarizer/total?style=flat-square)](https://github.com/suwonyoon/zotero-summarizer/releases)

---

## 📑 Table of Contents

- [Features](#-features)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [Usage](#-usage)
- [Configuration](#-configuration)
- [How It Works](#-how-it-works)
- [Troubleshooting](#-troubleshooting)
- [FAQ](#-faq)
- [Roadmap](#-roadmap)
- [Development](#-development)
- [Contributing](#-contributing)
- [Security](#-security)
- [License](#-license)
- [Acknowledgments](#-acknowledgments)
- [Support](#-support)

---

## ✨ Features

- **🤖 AI-Powered PDF Summarization** - Automatically generates summaries of academic papers using OpenAI GPT models
- **📄 Smart PDF Processing** - Size-aware processing: small PDFs (≤25MB) use Responses API with file upload, large PDFs use fulltext extraction
- **🎨 Flexible Preset System** - Customize your summaries with:
  - **Language presets**: English, Korean, Korean+English Hybrid
  - **Content styles**: Academic Summary, Key Points, Methodology Focus, Results & Conclusions, Critical Analysis, ELI5
- **⚙️ Easy Customization** - Create, edit, and delete custom presets through an intuitive preset manager
- **📝 Live Preview** - See the combined prompt before generating summaries
- **🎨 Rich Text Formatting** - Optional Markdown to rich text HTML conversion for beautiful notes
- **🔄 Batch Processing** - Summarize multiple items at once with progress tracking
- **📋 Menu Integration** - Accessible via Tools menu and context menu
- **💾 Automatic Note Creation** - Saves summaries as child notes in Zotero
- **🔌 Dual API Support** - Intelligently uses Responses API (with PDF) or Chat Completions API (title/abstract only)

---

## 📸 Screenshots

> **Note**: Screenshots will be added soon. See [screenshots/README.md](screenshots/README.md) for guidelines.

<!-- Uncomment when screenshots are available
### Main Interface
![Main Interface](screenshots/main-interface.png)

### Preset Selector with Live Preview
![Preset Selector](screenshots/preset-selector.png)

### Generated Summary
![Generated Summary](screenshots/generated-summary.png)
-->

---

## 📋 Prerequisites

Before installing Zotero Summarizer, ensure you have:

- **Zotero 7 Beta or Later** - [Download Zotero 7](https://www.zotero.org/support/dev/zotero_7_for_developers)
- **OpenAI API Key** - [Get your API key](https://platform.openai.com/api-keys)
- **OpenAI Account with Credits** - Ensure your account has sufficient credits/billing enabled

### System Requirements

- **Operating Systems**: Windows 10+, macOS 10.15+, Linux
- **Zotero Version**: 7.0.0-beta or later
- **Internet Connection**: Required for OpenAI API calls

---

## 📥 Installation

### Method 1: From GitHub Releases (Recommended)

1. Download the latest `.xpi` file from [Releases](https://github.com/suwonyoon/zotero-summarizer/releases/latest)
2. Open Zotero
3. Go to **Tools → Add-ons**
4. Click the gear icon ⚙️ → **Install Add-on From File...**
5. Select the downloaded `.xpi` file
6. Restart Zotero
7. Configure your OpenAI API key: **Tools → Zotero Summarizer → Settings**

### Method 2: From Source

```bash
git clone https://github.com/suwonyoon/zotero-summarizer.git
cd zotero-gpt
npm install
npm run build
```

The built plugin will be in `.scaffold/build/`. Install the `.xpi` file in Zotero as described above.

### Verify Installation

After installation, you should see **Zotero Summarizer** in the **Tools** menu.

---

## 🚀 Quick Start

### 1. Configure API Key

1. Go to **Tools → Zotero Summarizer → Settings**
2. Enter your OpenAI API key
3. (Optional) Change the model (default: `gpt-5-mini`, also supports `gpt-5`)
4. Click **Confirm**

### 2. Generate Your First Summary

1. Select one or more items in your Zotero library
2. Right-click → **Generate AI Summary** (or **Tools → Zotero Summarizer → Generate Summary**)
3. Wait for processing (progress window will show status)
4. View the generated summary in the item's child notes

### 3. Customize Presets (Optional)

1. Go to **Tools → Zotero Summarizer → Select Active Presets**
2. Choose a language preset (single selection)
3. Select one or more content style presets
4. Preview the combined prompt on the right
5. Click **OK** to save

---

## 📖 Usage

### Basic Usage

#### Generate Summary for Single Item

1. Select an item in your Zotero library
2. Right-click → **Generate AI Summary**
3. Wait for processing
4. View the summary in the child note

#### Batch Processing Multiple Items

1. Select multiple items (hold `Ctrl`/`Cmd` while clicking)
2. Right-click → **Generate AI Summary**
3. Wait for batch processing to complete
4. Each item will have its own child note with the summary

### Advanced Usage

#### Custom Presets

**Create a New Preset:**

1. Go to **Tools → Zotero Summarizer → Manage Prompt Presets**
2. Switch to the appropriate tab (Language or Content)
3. Fill in the preset name and prompt
4. Click **Add New**
5. Click **Save All**

**Edit an Existing Preset:**

1. Open **Manage Prompt Presets**
2. Select the preset from the list
3. Modify the name or prompt
4. Click **Update Selected**
5. Click **Save All**

**Delete a Preset:**

1. Open **Manage Prompt Presets**
2. Select the preset to delete
3. Click **Delete Selected**
4. Click **Save All**

---

## ⚙️ Configuration

### Settings

Access via **Tools → Zotero Summarizer → Settings**

| Setting | Description | Default |
|---------|-------------|---------|
| **API Key** | Your OpenAI API key | (empty) |
| **Model** | OpenAI model to use (`gpt-5-mini` or `gpt-5`) | `gpt-5-mini` |

### Preset Selection

Access via **Tools → Zotero Summarizer → Select Active Presets**

- **Language Preset** (single selection):
  - English
  - Korean
  - Korean+English Hybrid

- **Content Style Presets** (multiple selection):
  - Academic Summary
  - Key Points
  - Methodology Focus
  - Results & Conclusions
  - Critical Analysis
  - ELI5 (Explain Like I'm 5)

### Preset Management

Access via **Tools → Zotero Summarizer → Manage Prompt Presets**

- Create custom language and content presets
- Edit existing presets
- Delete unwanted presets

---

## 🔬 How It Works

### With PDF Attachment (≤ 25 MB)

```
1. User selects item(s) and triggers summary generation
2. Plugin extracts title, abstract, and PDF path
3. PDF file is uploaded to OpenAI Files API
4. Prompt is constructed from active presets + title + abstract
5. OpenAI Responses API is called with PDF file + prompt
6. Summary is parsed from API response
7. Child note is created with formatted summary
```

**API Used**: `https://api.openai.com/v1/responses`

**Input**: PDF file + title + abstract + text prompt
**Output**: Comprehensive PDF-based summary

### With Large PDF Attachment (> 25 MB)

```
1. User selects item(s) and triggers summary generation
2. Plugin extracts title, abstract, and PDF attachment
3. Full text is extracted from PDF using Zotero's built-in extraction
4. Prompt is constructed from active presets + title + abstract + full text
5. OpenAI Chat Completions API is called with combined context
6. Summary is parsed from API response
7. Child note is created with formatted summary
```

**API Used**: `https://api.openai.com/v1/chat/completions`

**Input**: Title + abstract + PDF full text + text prompt
**Output**: Comprehensive full-text summary

**Note**: If Responses API fails for small PDFs, the system automatically falls back to fulltext extraction.

### Without PDF Attachment

```
1. User selects item(s) and triggers summary generation
2. Plugin extracts title and abstract from metadata
3. Prompt is constructed with title + abstract + presets
4. OpenAI Chat Completions API is called
5. Summary is parsed from API response
6. Child note is created with formatted summary
```

**API Used**: `https://api.openai.com/v1/chat/completions`

**Input**: Title + abstract + text prompt
**Output**: Metadata-based summary

### Cost Estimation

Costs vary based on PDF size and processing method:

- **Small PDFs (≤ 25 MB)**: Uses Responses API with PDF file upload - optimal quality
- **Large PDFs (> 25 MB)**: Uses Chat Completions API with fulltext extraction - cost-effective for large documents
- **Without PDF**: Lowest cost, summaries based on title and abstract only

**Tip**: Monitor your [OpenAI usage dashboard](https://platform.openai.com/usage) to track costs. Pricing varies by model - `gpt-5-mini` is more cost-effective than `gpt-5`.

---

## 🔧 Troubleshooting

### Common Issues

#### 1. "API Key is not configured"

**Cause**: OpenAI API key not set
**Solution**: Go to **Tools → Zotero Summarizer → Settings** and enter your API key

#### 2. "Failed to upload PDF" or "API request failed"

**Possible Causes**:
- Invalid API key
- Network connectivity issues
- OpenAI API service outage
- Insufficient OpenAI credits

**Solutions**:
- Verify your API key at [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
- Check your internet connection
- Check [OpenAI status page](https://status.openai.com/)
- Verify billing/credits at [platform.openai.com/settings/organization/billing](https://platform.openai.com/settings/organization/billing)

#### 3. No Summary Generated

**Possible Causes**:
- Item has no PDF or abstract
- API rate limiting
- API timeout

**Solutions**:
- Ensure the item has either a PDF attachment or abstract
- Wait a few minutes and try again (rate limiting)
- Check Zotero's error console (**Tools → Developer → Error Console**)

#### 4. Summary Quality Issues

**Possible Causes**:
- Poor PDF quality or OCR errors
- Preset prompts not specific enough
- Model limitation

**Solutions**:
- Ensure PDFs are text-based (not scanned images)
- Customize presets for better instructions
- Try the `gpt-5` model for better quality (higher cost than `gpt-5-mini`)

### Debug Mode

To enable detailed logging:

1. Open Zotero's Error Console: **Tools → Developer → Error Console**
2. Filter logs by searching for `[ZoteroGPT]`
3. Look for error messages or warnings

---

## ❓ FAQ

### General Questions

**Q: Is Zotero Summarizer free?**
A: The plugin is free and open-source (AGPL-3.0), but you need an OpenAI API key which has associated costs.

**Q: Which OpenAI models are supported?**
A: `gpt-5-mini` (default, cost-effective) and `gpt-5` (higher quality, higher cost). Other models have been deprecated by OpenAI.

**Q: Can I use this offline?**
A: No, Zotero Summarizer requires an internet connection to communicate with OpenAI's API.

**Q: Does Zotero Summarizer store my PDFs or data?**
A: No. PDFs are sent directly to OpenAI's servers for processing.

### Privacy & Security

**Q: Is my data private?**
A: Data is sent to OpenAI subject to their [privacy policy](https://openai.com/policies/privacy-policy). Be cautious when processing sensitive documents.

**Q: How is my API key stored?**
A: Your API key is stored in Zotero's encrypted preference system. However, be cautious about sharing your Zotero profile.

### Technical Questions

**Q: Can I customize the prompts?**
A: Yes! Use **Tools → Zotero Summarizer → Manage Prompt Presets** to create custom presets.

**Q: Can I use local AI models instead of OpenAI?**
A: Not currently. This would require significant architecture changes. Consider opening a feature request!

**Q: Does this work with Zotero 6?**
A: No, Zotero Summarizer requires Zotero 7 or later.

---

## 🗺️ Roadmap

### Current Features

All core features are **implemented and working**:
- ✅ AI-Powered PDF Summarization (small PDFs ≤25MB via Responses API, large PDFs via fulltext extraction)
- ✅ Flexible Preset System (language & content presets with full CRUD operations)
- ✅ Live Preview of combined prompts
- ✅ Batch Processing for multiple items
- ✅ Progress Notifications during processing
- ✅ Markdown to Rich Text conversion
- ✅ Automatic Note Creation

### Not Yet Implemented

The following features are **planned but not yet implemented**:

- [ ] **Import/Export Presets** - Share custom presets with others as JSON files
- [ ] **Template Variables** - Use dynamic placeholders in prompts (e.g., `{title}`, `{authors}`, `{year}`)
- [ ] **Custom Models Dropdown** - Easy model selection UI (currently type manually)
- [ ] **Summary Templates** - Customizable note formatting beyond current options
- [ ] **Batch Export** - Export multiple summaries to files at once
- [ ] **API Usage Tracking** - Monitor OpenAI costs within the plugin
- [ ] **Local AI Support** - Integration with local models (Ollama, LM Studio)
- [ ] **Summary History** - Track and version summaries over time
- [ ] **Multi-Language UI** - Localization for languages other than English

### Under Consideration

- Support for other AI providers (Anthropic Claude, Google Gemini)
- Summary comparison mode (compare different presets side-by-side)
- Citation extraction from summaries
- Integration with Zotero notes editor

---

## 👨‍💻 Development

### Setup

```bash
# Clone the repository
git clone https://github.com/suwonyoon/zotero-summarizer.git
cd zotero-summarizer

# Install dependencies
npm install

# Start development server with hot reload
npm start
```

### Build

```bash
npm run build
```

Output: `.scaffold/build/zotero-summarizer-{version}.xpi`

### Commands

| Command | Description |
|---------|-------------|
| `npm start` | Build and run with hot reload |
| `npm run build` | Build production-ready plugin |
| `npm run lint:check` | Check code style |
| `npm run lint:fix` | Auto-fix code style issues |
| `npm test` | Run tests |
| `npm run release` | Create a GitHub release |

### Project Structure

```
zotero-summarizer/
├── src/
│   ├── modules/
│   │   ├── zoterogpt.ts        # Main plugin logic
│   │   └── preferenceScript.ts # Preference UI scripts
│   ├── utils/
│   │   ├── openai.ts           # OpenAI API client
│   │   ├── presets.ts          # Preset system
│   │   ├── markdown.ts         # Markdown to HTML converter
│   │   └── locale.ts           # Localization utilities
│   └── hooks.ts                # Plugin lifecycle hooks
├── addon/
│   ├── locale/                 # Localization files
│   ├── prefs.js                # Default preferences
│   └── prefs.xhtml             # Preferences UI
├── .github/
│   └── workflows/              # CI/CD workflows
├── screenshots/                # Documentation screenshots
└── README.md                   # This file
```

---

## 🤝 Contributing

We welcome contributions!

### Quick Contribution Guide

1. **Fork** the repository
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** and commit: `git commit -m 'feat: add amazing feature'`
4. **Push** to your fork: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Areas Where Help is Needed

- 🐛 **Bug fixes** - Check [open issues](https://github.com/suwonyoon/zotero-summarizer/issues)
- 📖 **Documentation** - Improve guides, add examples, create tutorials
- 🌍 **Localization** - Translate the UI to other languages
- ✨ **New features** - See [roadmap](#-roadmap) for ideas
- 🧪 **Testing** - Write unit tests, test edge cases

---

## 🔒 Security

### Security Best Practices

- **Never share your API key** with anyone
- **Monitor your OpenAI usage** regularly
- **Use API key restrictions** if available from OpenAI
- **Rotate your API key** periodically
- **Review documents** before processing sensitive PDFs

### Data Privacy

Data is sent to OpenAI subject to their [privacy policy](https://openai.com/policies/privacy-policy). PDFs are uploaded directly to OpenAI's servers for processing. Be cautious when processing sensitive documents.

---

## 📜 License

This project is licensed under the **AGPL-3.0 License** - see the [LICENSE](LICENSE) file for details.

### What This Means

- ✅ You can use this software for free
- ✅ You can modify the source code
- ✅ You can distribute the software
- ⚠️ You must disclose source code when distributing
- ⚠️ You must use the same license for derivative works
- ⚠️ Network use counts as distribution (AGPL provision)

---

## 🙏 Acknowledgments

- **[Zotero Plugin Template](https://github.com/windingwind/zotero-plugin-template)** by [@windingwind](https://github.com/windingwind) - Excellent plugin template that made this project possible
- **[Zotero Plugin Toolkit](https://github.com/windingwind/zotero-plugin-toolkit)** by [@windingwind](https://github.com/windingwind) - Powerful toolkit for Zotero plugin development
- **[OpenAI](https://openai.com)** - For providing the GPT models that power this plugin
- **Zotero Team** - For building an amazing reference manager

### Related Projects

- [Zotero Better Notes](https://github.com/windingwind/zotero-better-notes) - Enhanced note-taking for Zotero
- [Zotero Actions & Tags](https://github.com/windingwind/zotero-actions-tags) - Automate workflows with tags
- [awesome-zotero](https://github.com/MohamedElashri/awesome-zotero) - Curated list of Zotero resources

---

## 💬 Support

### Get Help

- **📖 Documentation**: Check this README for complete documentation
- **❓ Questions**: Open a [Discussion](https://github.com/suwonyoon/zotero-summarizer/discussions)
- **🐛 Bug Reports**: Open an [Issue](https://github.com/suwonyoon/zotero-summarizer/issues)
- **💡 Feature Requests**: Open an [Issue](https://github.com/suwonyoon/zotero-summarizer/issues) with the `enhancement` label

### Stay Updated

- **⭐ Star this repository** to get notifications about new releases
- **👁️ Watch** for updates on issues and pull requests
- **🔔 Release notifications**: Enable notifications for new releases

---

## 📊 Statistics

![GitHub stars](https://img.shields.io/github/stars/suwonyoon/zotero-summarizer?style=social)
![GitHub forks](https://img.shields.io/github/forks/suwonyoon/zotero-summarizer?style=social)
![GitHub watchers](https://img.shields.io/github/watchers/suwonyoon/zotero-summarizer?style=social)

---

## 👤 Author

**Suwon Yoon**
📧 Email: suwon.yoon@postech.ac.kr
🐙 GitHub: [@suwonyoon](https://github.com/suwonyoon)

---

<p align="center">
  <strong>Made with ❤️ for the academic community</strong>
  <br>
  <sub>If Zotero Summarizer helps your research, please consider giving it a ⭐</sub>
</p>

