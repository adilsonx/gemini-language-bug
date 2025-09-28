# Gemini PDF Language Bug Reproduction

This repository demonstrates a language preservation issue with Google's Gemini API when processing PDF documents.

## Issue Description

**Model**: `gemini-2.5-flash-lite-preview-09-2025`

**Problem**: When processing PDF documents with clear language instructions in the prompt, the model sometimes returns summaries in incorrect languages (Italian, Spanish) instead of preserving the original document language.

**Reproduction Rate**: Approximately 50% of tested documents

## Expected vs Actual Behavior

- **Expected**: Summary generated in the same language as the source PDF document
- **Actual**: Summary sometimes appears in Italian or Spanish regardless of the source document language
- **Frequency**: This issue occurs inconsistently, making it difficult to predict

## Setup Instructions

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file with your Gemini API key:
   ```
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## How to Reproduce the Bug

1. Upload any PDF document (preferably in English, French, or another non-Italian/Spanish language)
2. Click "Generate Summary"
3. Observe the generated summary language
4. **Bug occurs when**: The summary is generated in Italian or Spanish despite:
   - The source document being in a different language
   - The prompt explicitly requesting to "keep the response in the original language"
   - The prompt containing "IMPORTANT: Write your response in the same language as the source document"

## Technical Details

### Prompt Used
```
Analyze this PDF document and provide a detailed summary. Keep the response in the original language of the document.

Your summary should include:
1. The main subject of the document
2. Key points and important ideas
3. Main conclusions
4. An overview of the document structure

Format your response in markdown with clear sections and bullet points if necessary.

IMPORTANT: Write your response in the same language as the source document (French, English, Spanish, etc.).

Here is the document to analyze:
```

### Model Configuration
- Model: `gemini-2.5-flash-lite-preview-09-2025`
- Input: PDF documents converted to base64
- Method: `generateContent` with inline data

## Test Files

To best reproduce this issue, test with:
- English PDF documents
- French PDF documents
- German PDF documents
- Any non-Italian/Spanish language documents

The bug is most noticeable when the expected output language differs significantly from Italian/Spanish.

## For Google Team

This reproduction case is designed to help identify and fix the language preservation issue. The complete prompt, model configuration, and processing pipeline are included for your analysis.

**Contact**: Please reach out if you need additional test cases or have questions about the reproduction steps.

## Dependencies

- Next.js 15.5.4
- @google/generative-ai 0.24.1
- react-dropzone 14.3.8
- TypeScript
- Tailwind CSS

## License

This reproduction case is provided for debugging purposes.