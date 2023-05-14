import * as fs from 'fs';
import * as path from 'path';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { DocumentService } from '../services/documents.service';
import { Document } from '../models/document.model';
import {Utils} from '../utilities/utils';
import axios from 'axios';

export class DocumentController {

  constuctor() { }

  private documentService = new DocumentService();

  /**
   * Add new document in local storage
   * @param req the http request object
   * @param res the http response object
   */
  public async add(req: Request, res: Response): Promise<void> {
    // -- Documents local storage directory
    const directoryPath = './storages';

    // Get the document data from the request body
    const { docUrl, owner } = req.body;

    // -- Check docUrl is not empty 
    if (!docUrl) {
      console.log("Error: docUrl in body is empty");
      res.status(400).send({
        'error': 'docUrl in body required'
      });
      return;
    }

    // -- Check owner is not empty 
    if (!owner) {
      console.log("Error: owner in body is empty");
      res.status(400).send({
        'error': 'owner in body required'
      });
      return;
    }

    // -- Get document name from url 
    const documentName = path.basename(docUrl);
    
    // -- Check document is pdf
    if (!Utils.isValidPdfUrl(docUrl)) {
      console.log("Error: invalid pdf url");
      res.status(400).send({
        'error': 'Valid pdf url required'
      });
      return;
    }

    // -- Check if document already exist by name
    if (this.documentService.checkIfExistByName(documentName)) {
      console.log("Error: document already exists");
      res.status(400).send({
        'error': 'document already exists'
      });
      return;
    }

    try {
      // -- Generate random uuid as document id 
      const documentToCreateId = uuidv4();

      // -- Build object of document to add 
      let documentToAdd = this.buildDocument(documentToCreateId, documentName, owner);

      // -- Add new document to document list 
      this.documentService.add(documentToAdd);

      // -- Send http response successfully message to client 
      res.send({ 'message': 'PDF document sent successfully' });

      console.log("PDF document sent successfully");

      // -- Create local storage directory if it doesn't already exist
      this.createLocalStorageDirectoryIfNotExist(directoryPath);

      // -- Save pdf document file in local storage directory
      await this.saveDocumentFileInLocalStorage(docUrl, directoryPath, documentName);
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Create local storage directory in file system if it doesn't already exist
   * @param directoryPath the path of local storage directory
   */
  private createLocalStorageDirectoryIfNotExist(directoryPath: string): void {
    try {
      if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath);
        console.log("Local storage directory created successfully");
      }
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  /**
   * Build new document object
   * @param id the id of document to build
   * @param name the name of document to build
   * @param owner the owner of document to build
   * @returns new document with the information provided
   */
  private buildDocument(id: string, name: string, owner: string): Document {
    
    return new Document(
      id,
      name,
      '',
      owner
    );
  }

  /**
   * Save pdf document file in local storage directory
   * @param res the http response object
   * @param docUrl the document url 
   * @param directoryPath the path of local storage directory
   * @param documentName the document name
   */
  private async saveDocumentFileInLocalStorage(
    docUrl: string,
    directoryPath: string,
    documentName: string): Promise<void> {
    try {
      // -- Axios asynchronous request to pdf url to get a stream of pdf data
      const response = await axios.get(docUrl, { responseType: 'stream' });
      // -- To build the path to save file 
      const filePath = path.join(directoryPath, documentName);
      // -- To write the pdf data to the file system directory
      const writer = fs.createWriteStream(filePath);
      // -- To pipe the stream of PDF data from axios response into the write stream.
      response.data.pipe(writer);
      // -- To wait for the write stream to finish writing the PDF data to the file
      await new Promise((resolve, reject) => {
        // -- Listen finish event to resolve the promise 
        writer.on('finish', resolve);
        // -- Error event to reject the promise if an error occurs
        writer.on('error', reject);
      });
      console.log('PDF document file saved in local storage successfully !');
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  }



}