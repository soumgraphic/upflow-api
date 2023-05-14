import * as fs from 'fs';
import * as path from 'path';
import * as pdf2img from 'pdf-img-convert';
import axios from 'axios';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { DocumentService } from '../services/documents.service';
import { Document } from '../models/document.model';
import { Utils } from '../utilities/utils';
import { DocumentResponse } from '../models/document.response.models';

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

      // -- Generate and save pdf document thumbnail with first page
      await this.generatePdfThumbnail(directoryPath, documentName);

      // -- Send pdf processing completed webhook event
      this.sendCompletedPdfProcessingWebhook(
        'http://localhost:3000/api/v1/webhooks',
        documentToCreateId,
        documentName
      );
    } catch (error) {
      // -- Send pdf processing error webhook event when error occured
      this.sendPdfProcessingErrorWebhook(
        'http://localhost:3000/api/v1/webhooks',
        documentName
      );
      console.error(error);
    }
  }

  /**
   * Get document list
   * @param req the http request object
   * @param res the http response object
   */
  public get(req: Request, res: Response): void {
    // -- Get api host url
    let fullUrl: string = Utils.getFullUrl(req);
    // -- Build documents with api host url to view or download pdf files
    let documentResponses: Array<DocumentResponse> = this.documentService
      .get()
      .map((document) => Utils.mapToDocumentResponse(fullUrl, document));
    res.send(documentResponses);
  }

  /**
   * Get document by id
   * @param req the http request object
   * @param res the http response object
   */
  public getById(req: Request, res: Response): void {
    let document = this.documentService.getById(req.params.id);
    if (document) {
      // -- Get api host url 
      let fullUrl: string = Utils.getFullUrl(req);
      // -- Build document with api host url to view or download pdf file
      let documentResponse: DocumentResponse = Utils.mapToDocumentResponse(fullUrl, document);
      res.send(documentResponse);
    } else {
      res.status(404).send({
        'error': 'document not found'
      });
    }
  }

  /**
   * Get document by name
   * @param req the http request object
   * @param res the http response object
   */
  public getByName(req: Request, res: Response): void {
    let document = this.documentService.getByName(req.query.name as string);
    if (document) {
      // -- Get api host url 
      let fullUrl: string = Utils.getFullUrl(req);
      // -- Build document with api host url to view or download pdf file
      let documentResponse: DocumentResponse = Utils.mapToDocumentResponse(fullUrl, document);
      res.send(documentResponse);
    } else {
      res.status(404).send({
        'error': 'document not found'
      });
    }
  }

  /**
   * Get pdf document file by id
   * @param req the http request object
   * @param res the http response object
   */
  public getPdfDocumentFileById(req: Request, res: Response): void {
    // -- Documents local storage directory
    const directoryPath = './storages';
    let document = this.documentService.getById(req.params.id);
    if (document) {
      // -- Read pdf document from local storage file system 
      let documentFile = fs.readFileSync(`${directoryPath}/${document.name}`);
      // -- Set http response content type as pdf
      res.contentType("application/pdf");
      res.send(documentFile);
    } else {
      res.status(404).send({
        'error': 'document not found'
      });
    }
  }

  /**
 * Get thumbnail of pdf document file by id
 * @param req the http request object
 * @param res the http response object
 */
  public getThumbnailOfPdfFileById(req: Request, res: Response): void {
    // -- Documents local storage directory
    const directoryPath = './storages';
    let document = this.documentService.getById(req.params.id);
    if (document) {
      // -- Read thumbnail image from local storage file system 
      let thumbnailOfPdfFile = fs.readFileSync(`${directoryPath}/${document.thumbnail}`);
      // -- Set http response content type as png
      res.contentType("image/png");
      res.send(thumbnailOfPdfFile);
    } else {
      res.status(404).send({
        'error': 'document not found'
      });
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
    let documentNameWithoutExtension = Utils.removeFileExtension(name);
    return new Document(
      id,
      name,
      `${documentNameWithoutExtension}.png`,
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

  /**
 * Generate a thumbnail of the first page of a PDF document
 * @param directoryPath the path of local storage directory
 * @param documentName the name of pdf document
 */
  private async generatePdfThumbnail(directoryPath: string, documentName: string): Promise<void> {
    let pdfPath: string = `${directoryPath}/${documentName}`;
    let documentNameWithoutExtension = Utils.removeFileExtension(documentName);
    let thumbnailPath: string = `${directoryPath}/${documentNameWithoutExtension}.png`;

    // -- Init pdf2img with the path of pdf file
    let outputPdfThumbnail = pdf2img.convert(pdfPath);

    try {
      // -- Use a Promise to write the PNG data to a file system directory and wait for the write to finish
      await new Promise<void>((resolve, reject) => {
        // -- Generate thumbnail image from pdf file first page and save local storage directory
        outputPdfThumbnail.then(function (outputImages) {
          fs.writeFile(thumbnailPath, outputImages[0], (error) => {
            if (error) {
              console.error(error);
              reject(error);
            } else {
              console.log('PDF png thumbnail saved in local storage successfully !');
              resolve();
            }
          });
        });
      });
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  }

  /**
   * Send pdf processing completed webhook event
   * @param webhookUrl the endpoint of webhook to send message
   * @param documentId the id of pdf document
   * @param documentName the name of pdf document
   */
  private async sendCompletedPdfProcessingWebhook(
    webhookUrl: string,
    documentId: string,
    documentName: string): Promise<void> {
    await axios.post(webhookUrl, {
      eventType: "pdf.processing",
      eventId: `evt-${uuidv4()}`,
      payload: {
        id: documentId,
        documentName: documentName,
        status: 'completed',
        message: 'PDF processing completed successfully'
      },
    });
    console.log('PDF processing completed webhook sent successfully!');
  }

  /**
   * Send pdf processing error webhook event
   * @param webhookUrl the endpoint of webhook to send message
   * @param documentName the name of pdf document
   */
  private async sendPdfProcessingErrorWebhook(webhookUrl: string, documentName: string): Promise<void> {
    await axios.post(webhookUrl, {
      eventType: "pdf.processing",
      eventId: `evt-${uuidv4()}`,
      payload: {
        documentName: documentName,
        status: 'error',
        message: 'Error occured when pdf processing'
      },
    });
    console.log('PDF processing error webhook sent successfully!');
  }
}