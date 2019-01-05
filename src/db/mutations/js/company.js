import { ApolloError } from 'apollo-server-koa';
import { models } from '../../model';
import logger from '../../../util/logging';

const { Company, Document } = models;

export default {
  async createCompany(parent, args) {
    // Check input
    const { data } = args;

    if (!data.documents || data.documents.length < 1) throw new ApolloError('At least one document is required', 400);

    // Check if any document conflicts with current database
    await Promise.all(
      data.documents.map(async (newDoc) => {
        let doc;
        try {
          doc = await Document.findOne(newDoc);
        } catch (e) {
          logger.error(e);
          throw new ApolloError('Failed to create company', 500);
        }
        if (doc) {
          throw new ApolloError('Document already exists', 409);
        }
      }),
    );

    // Create documents
    const documents = await Promise.all(data.documents.map(newDoc => new Document(newDoc)));

    // Creates company definition
    const def = {
      ...data,
      documents,
    };

    // Creates company
    const company = new Company(def);

    // Sets owner of documents
    documents.forEach(doc => doc.set({ company }));

    // Validate
    await Promise.all(documents.map(doc => doc.validate()));
    await company.validate();

    // Save all
    await Promise.all(documents.map(doc => doc.save()));
    await company.save();

    return Company.findById(company.id);
  },

  async updateCompany(parent, args) {
    // Find company
    const company = await Company.findById(args.company_id);
    if (!company) throw new ApolloError('Company was not found', 404);

    // Company updated fields
    if (args.data.documents) throw new ApolloError('Cannot edit documents via company update', 400);

    // Update
    company.set(args.data);
    await company.save();

    return Company.findById(company.id);
  },

  async addDocumentToCompany(parent, args) {
    // Search for document
    if (await Document.findOne(args.document)) throw new ApolloError('Document already exists', 409);

    // Get company
    const company = await Company.findById(args.company_id);
    if (!company) throw new ApolloError('Company was not found', 404);

    // Add document
    const document = new Document(args.document);
    document.company = company;
    company.documents.push(document.id);

    // Save to db
    await document.save();
    await company.save();

    return Company.findById(company.id);
  },
};
