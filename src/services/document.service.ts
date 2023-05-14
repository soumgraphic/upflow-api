import { Document } from '../models/document.model';

export class DocumentService{
    
    // -- The list of document
    private documents: Document[] = [];

    /**
     * To add new document to document list 
     * @param document the document to add in list
     */
    public add(document: Document): void{
        this.documents.push(document);
    }

    /**
     * Check if document already exist by name
     * @param docNameToCheck the document name to check if exist
     * @returns true if document already exist by name
     */
    public checkIfExistByName(docNameToCheck: string): boolean{
        const documentIndex = this.documents.findIndex((doc) => doc.name === docNameToCheck);
        return documentIndex !== -1;
    }

    /**
     * Get the list of document
     * @returns the list of document
     */
    public get(): Array<Document>{
        return this.documents;
    }

    /**
     * Get document by id in the list of document if found
     * @param documentId the id of document
     * @returns document by id 
     */
    public getById(documentId: string): Document{
        return this.documents.find((doc) => doc.id === documentId);
    }

    /**
     * Get document by name in the list of document if found
     * @param documentName the name of document
     * @returns document by name
     */
    public getByName(documentName: string): Document{
        return this.documents.find((doc) => doc.name === documentName);
    }
}
