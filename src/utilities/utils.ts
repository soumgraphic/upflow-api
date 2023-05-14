import * as path from 'path';
import { Request } from 'express';
import { DocumentResponse } from '../models/document.response.models';
import { Document } from '../models/document.model';
import axios from 'axios';

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
     * Get full http url of host
     * @param req the http request object
     * @returns full http url of host
     */
    static getFullUrl(req: Request): string {
        return `${req.protocol}://${req.get('host')}${req.baseUrl}`;
    }

    /**
     * Map document to document response object
     * @param hostUrl the host url of API
     * @param document the document to map document response
     * @returns new document response object builded 
     */
    static mapToDocumentResponse(hostUrl: string, document: Document): DocumentResponse {
        return new DocumentResponse(
            document.id,
            document.name,
            `${hostUrl}/${document.id}/view`,
            document.thumbnail,
            `${hostUrl}/${document.id}/thumbnail`
        );
    }

    /**
     * Remove file extension from filename
     * @param filename the name of file
     * @returns filename without extension
     */
    static removeFileExtension(filename: string): string {
        const lastDotIndex = filename.lastIndexOf('.');
        if (lastDotIndex === -1) {
            // -- If there is no dot in the filename, return the whole filename
            return filename;
        }
        // -- Otherwise, return the filename without the extension
        return filename.slice(0, lastDotIndex);
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