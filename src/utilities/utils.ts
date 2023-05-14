import * as path from 'path';

export class Utils {
    /**
     * Check if document is pdf by extension
     * @param documentName the name of document
     */
    static isPdfDocument(documentName: string): boolean {
        const fileExtension = path.extname(documentName).toLowerCase();
        return fileExtension === '.pdf';
    }

    /**
     * Check if url is valid pdf url
     * @param url the url to check 
     * @returns true if url is valid pdf url
     */
    static isValidPdfUrl(url: string): boolean {
        try {
            // -- Check url is valid 
            const parsedUrl = new URL(url);
            const pathname = parsedUrl.pathname.toLowerCase();
            // -- Check url is pdf document
            return pathname.endsWith('.pdf');
        } catch (error) {
            return false;
        }
    }

}