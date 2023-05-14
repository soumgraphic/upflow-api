# Upflow documents API

API to load pdf file from a url, store it in the local storage, generate the thumbnail of the pdf and send a webhook to the api client.

## API Features

+ Add pdf document by url

+ Detect pdf files duplicate

+ Show the pdf list and associated thumbnails

+ Download pdf document

+ Download pdf document thumbnail

+ Show pdf document infos by id

+ Show pdf document infos by name

+ Consume webhook event

## Requirements
+ From node v18.16.0

+ From npm 9.6.6

+ From Typescript v5.0.4

+ IDE: VSCode or Webstorm

+ Thunder client: extension of VSCode to import the collection of API endpoints and test easily **(File to import upflow-api\thunder-collection_upflow-api.json)**

## Steps to Setup

**1. Clone the API**

```bash
git clone https://github.com/soumgraphic/upflow-api.git
```

**2. Install dependencies**

```bash
npm install
```

Globally with TypeScript
```bash
npm install -g typescript
npm install -g ts-node
```

**4. Run the app using npm in dev**

```bash
npm run dev
```

The app will start running at <http://localhost:3000/api/v1/>

**5. Run the app using npm in another environment**

```bash
npm run build
npm start
```

## Explore Rest APIs

The API defines following endpoints.

### Documents

| Method | Url | Decription | Sample JSON Request Body | 
| ------ | --- | ---------- | --------------------------- |
| POST   | /api/v1/documents | Add pdf document by url | [JSON](#add-doc) |
| GET    | /api/v1/documents | Show the pdf list and thumbnails | |
| GET    | /api/v1/documents/:id/view | Download pdf document | |
| GET    | /api/v1/documents/:id/thumbnail | Download pdf document thumbnail | |
| GET    | /api/v1/documents/:id | Show pdf document infos by id | |
| GET    | /api/v1/documents?name=:doc-name | Show pdf document infos by name | |

### Webhooks

| Method | Url | Decription | Sample JSON Request Body | 
| ------ | --- | ---------- | --------------------------- |
| POST   | /api/v1/webhooks | Consume webhook event | [JSON](#consume-webhook) |

## Sample JSON Request Bodys

##### <a id="add-doc">Documents -> POST /api/v1/documents</a>
```json
{
  "docUrl": "https://about.gitlab.com/images/press/git-cheat-sheet.pdf",
  "owner": "john.doe@gmail.com"
}
```

##### <a id="consume-webhook">Webhooks -> POST /api/v1/webhooks</a>
```json
{
  "eventType": "pdf.processing",
  "eventId": "evt-512ce108-0d88-476f-9087-f7b99512902c",
  "payload": {
    "id": "0a2926c5-7dfa-4243-ac5f-bbbb830d8393",
    "documentName": "git-cheat-sheet-education.pdf",
    "status": "completed",
    "message": "PDF processing completed successfully"
  }
}
```

## Examples of pdf files to test API
### Low files
+ https://about.gitlab.com/images/press/git-cheat-sheet.pdf

+ https://web.stanford.edu/group/csp/cs21/htmlcheatsheet.pdf
+ https://www3.cs.stonybrook.edu/~pramod.ganapathi/doc/CSE102/CSE102-CheatSheetHTML.pdf

### Large files
+ https://johndecember.com/html/spec/HTML5-Cheat-Sheet.pdf 
+ https://html.com/wp-content/uploads/html-cheat-sheet.pdf



Made with love :heart: by :
[@Soumaila Abdoulaye DIARRA](https://github.com/soumgraphic)