# ZoteroGPT

> AI-powered PDF summarization for Zotero using OpenAI GPT

[![zotero target version](https://img.shields.io/badge/Zotero-7-green?style=flat-square&logo=zotero&logoColor=CC2936)](https://www.zotero.org)
[![Using Zotero Plugin Template](https://img.shields.io/badge/Using-Zotero%20Plugin%20Template-blue?style=flat-square&logo=github)](https://github.com/windingwind/zotero-plugin-template)
[![License](https://img.shields.io/github/license/suwonyoon/zotero-gpt?style=flat-square)](https://github.com/suwonyoon/zotero-gpt/blob/main/LICENSE)
[![Latest Release](https://img.shields.io/github/v/release/suwonyoon/zotero-gpt?style=flat-square)](https://github.com/suwonyoon/zotero-gpt/releases/latest)
[![GitHub Downloads](https://img.shields.io/github/downloads/suwonyoon/zotero-gpt/total?style=flat-square)](https://github.com/suwonyoon/zotero-gpt/releases)

---

## 📑 Table of Contents

- [Features](#-features)
- [Screenshots](#-screenshots)
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
- **📄 Smart PDF Processing** - Uploads PDFs to OpenAI for full-text analysis when available
- **🎨 Flexible Preset System** - Customize your summaries with:
  - **Language presets**: English, Korean, Korean+English Hybrid
  - **Content styles**: Academic Summary, Key Points, Methodology Focus, Results & Conclusions, Critical Analysis, ELI5
- **⚙️ Easy Customization** - Create, edit, and delete custom presets through an intuitive dialog
- **📝 Live Preview** - See the combined prompt before generating summaries
- **🔄 Batch Processing** - Summarize multiple items at once
- **📋 Menu Integration** - Accessible via Tools menu and context menu
- **💾 Automatic Note Creation** - Saves summaries as child notes in Zotero
- **🔌 Dual API Support** - Uses Responses API (with PDF) or Chat Completions API (without PDF)

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

Before installing ZoteroGPT, ensure you have:

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

1. Download the latest `.xpi` file from [Releases](https://github.com/suwonyoon/zotero-gpt/releases/latest)
2. Open Zotero
3. Go to **Tools → Add-ons**
4. Click the gear icon ⚙️ → **Install Add-on From File...**
5. Select the downloaded `.xpi` file
6. Restart Zotero
7. Configure your OpenAI API key: **Tools → ZoteroGPT → Settings**

### Method 2: From Source

```bash
git clone https://github.com/suwonyoon/zotero-gpt.git
cd zotero-gpt
npm install
npm run build
```

The built plugin will be in `.scaffold/build/`. Install the `.xpi` file in Zotero as described above.

### Verify Installation

After installation, you should see **ZoteroGPT** in the **Tools** menu.

---

## 🚀 Quick Start

### 1. Configure API Key

1. Go to **Tools → ZoteroGPT → Settings**
2. Enter your OpenAI API key
3. (Optional) Change the model (default: `gpt-5-mini`, also supports `gpt-5`)
4. Click **Confirm**

### 2. Generate Your First Summary

1. Select one or more items in your Zotero library
2. Right-click → **Generate AI Summary** (or **Tools → ZoteroGPT → Generate Summary**)
3. Wait for processing (progress window will show status)
4. View the generated summary in the item's child notes

### 3. Customize Presets (Optional)

1. Go to **Tools → ZoteroGPT → Select Active Presets**
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

1. Go to **Tools → ZoteroGPT → Manage Prompt Presets**
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

Access via **Tools → ZoteroGPT → Settings**

| Setting | Description | Default |
|---------|-------------|---------|
| **API Key** | Your OpenAI API key | (empty) |
| **Model** | OpenAI model to use (`gpt-5-mini` or `gpt-5`) | `gpt-5-mini` |

### Preset Selection

Access via **Tools → ZoteroGPT → Select Active Presets**

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

Access via **Tools → ZoteroGPT → Manage Prompt Presets**

- Create custom language and content presets
- Edit existing presets
- Delete unwanted presets
- Import/export presets (coming soon)

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
**Solution**: Go to **Tools → ZoteroGPT → Settings** and enter your API key

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

**Q: Is ZoteroGPT free?**
A: The plugin is free and open-source (AGPL-3.0), but you need an OpenAI API key which has associated costs.

**Q: Which OpenAI models are supported?**
A: `gpt-5-mini` (default, cost-effective) and `gpt-5` (higher quality, higher cost). Other models have been deprecated by OpenAI.

**Q: Can I use this offline?**
A: No, ZoteroGPT requires an internet connection to communicate with OpenAI's API.

**Q: Does ZoteroGPT store my PDFs or data?**
A: No. PDFs are sent directly to OpenAI's servers. See [SECURITY.md](SECURITY.md) for details.

### Privacy & Security

**Q: Is my data private?**
A: Data is sent to OpenAI subject to their [privacy policy](https://openai.com/policies/privacy-policy). Review [SECURITY.md](SECURITY.md) for security best practices.

**Q: How is my API key stored?**
A: Your API key is stored in Zotero's encrypted preference system. However, be cautious about sharing your Zotero profile.

### Technical Questions

**Q: Can I customize the prompts?**
A: Yes! Use **Tools → ZoteroGPT → Manage Prompt Presets** to create custom presets.

**Q: Can I use local AI models instead of OpenAI?**
A: Not currently. This would require significant architecture changes. Consider opening a feature request!

**Q: Does this work with Zotero 6?**
A: No, ZoteroGPT requires Zotero 7 or later.

---

## 🗺️ Roadmap

### Planned Features

- [ ] **Import/Export Presets** - Share custom presets with others
- [ ] **Template Variables** - Use dynamic placeholders in prompts (e.g., `{title}`, `{authors}`)
- [ ] **Custom Models** - Easy dropdown for model selection
- [ ] **Summary Templates** - Customizable note formatting (Markdown, HTML, etc.)
- [ ] **Batch Export** - Export multiple summaries at once
- [ ] **Progress Notifications** - Better feedback during long operations
- [ ] **API Usage Tracking** - Monitor OpenAI costs within the plugin
- [ ] **Local AI Support** - Integration with local models (Ollama, LM Studio)
- [ ] **Summary History** - Track and version summaries
- [ ] **Multi-Language UI** - Localization for other languages

### Under Consideration

- Support for other AI providers (Anthropic Claude, Google Gemini)
- Summary comparison mode (compare different presets)
- Citation extraction from summaries
- Integration with Zotero notes editor

---

## 👨‍💻 Development

### Setup

```bash
# Clone the repository
git clone https://github.com/suwonyoon/zotero-gpt.git
cd zotero-gpt

# Install dependencies
npm install

# Start development server with hot reload
npm start
```

### Build

```bash
npm run build
```

Output: `.scaffold/build/zotero-gpt-{version}.xpi`

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
zotero-gpt/
├── src/
│   ├── modules/
│   │   ├── zoterogpt.ts        # Main plugin logic
│   │   └── preferenceScript.ts # Preference UI scripts
│   ├── utils/
│   │   ├── openai.ts           # OpenAI API client
│   │   ├── presets.ts          # Preset system
│   │   └── locale.ts           # Localization utilities
│   └── hooks.ts                # Plugin lifecycle hooks
├── addon/
│   ├── locale/                 # Localization files
│   ├── prefs.js                # Default preferences
│   └── prefs.xhtml             # Preferences UI
├── .github/
│   └── workflows/              # CI/CD workflows
├── screenshots/                # Documentation screenshots
├── CONTRIBUTING.md             # Contribution guidelines
├── CHANGELOG.md                # Version history
├── SECURITY.md                 # Security policy
└── README.md                   # This file
```

See [CLAUDE.md](CLAUDE.md) for detailed architecture documentation.

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Quick Contribution Guide

1. **Fork** the repository
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** and commit: `git commit -m 'feat: add amazing feature'`
4. **Push** to your fork: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Areas Where Help is Needed

- 🐛 **Bug fixes** - Check [open issues](https://github.com/suwonyoon/zotero-gpt/issues)
- 📖 **Documentation** - Improve guides, add examples, create tutorials
- 🌍 **Localization** - Translate the UI to other languages
- ✨ **New features** - See [roadmap](#-roadmap) for ideas
- 🧪 **Testing** - Write unit tests, test edge cases

---

## 🔒 Security

### Reporting Vulnerabilities

Please see [SECURITY.md](SECURITY.md) for our security policy and how to report vulnerabilities.

### Security Best Practices

- **Never share your API key** with anyone
- **Monitor your OpenAI usage** regularly
- **Use API key restrictions** if available from OpenAI
- **Rotate your API key** periodically
- **Review documents** before processing sensitive PDFs

For more details, see [SECURITY.md](SECURITY.md).

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

- **📖 Documentation**: Check this README and [CLAUDE.md](CLAUDE.md)
- **❓ Questions**: Open a [Discussion](https://github.com/suwonyoon/zotero-gpt/discussions)
- **🐛 Bug Reports**: Open an [Issue](https://github.com/suwonyoon/zotero-gpt/issues)
- **💡 Feature Requests**: Open an [Issue](https://github.com/suwonyoon/zotero-gpt/issues) with the `enhancement` label

### Stay Updated

- **⭐ Star this repository** to get notifications about new releases
- **👁️ Watch** for updates on issues and pull requests
- **🔔 Release notifications**: Enable notifications for new releases

---

## 📊 Statistics

![GitHub stars](https://img.shields.io/github/stars/suwonyoon/zotero-gpt?style=social)
![GitHub forks](https://img.shields.io/github/forks/suwonyoon/zotero-gpt?style=social)
![GitHub watchers](https://img.shields.io/github/watchers/suwonyoon/zotero-gpt?style=social)

---

## 👤 Author

**Suwon Yoon**
📧 Email: suwon.yoon@postech.ac.kr
🐙 GitHub: [@suwonyoon](https://github.com/suwonyoon)

---

<p align="center">
  <strong>Made with ❤️ for the academic community</strong>
  <br>
  <sub>If ZoteroGPT helps your research, please consider giving it a ⭐</sub>
</p>

---

## 📝 Changelog

For a detailed list of changes, see [CHANGELOG.md](CHANGELOG.md).

### Recent Updates

- **v0.1.0** (Current) - Initial release
  - AI-powered PDF summarization
  - Flexible preset system
  - Batch processing support
  - OpenAI Responses API & Chat Completions API integration

[View full changelog →](CHANGELOG.md)
