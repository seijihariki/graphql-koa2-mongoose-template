import Document from '../mongo/document';

export default {
  async documents(parent) {
    return Promise.all(parent.documents.map(async docId => Document.findById(docId)));
  },
};
