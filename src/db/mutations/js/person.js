import { ApolloError } from 'apollo-server-koa';
import { models } from '../../model';
import logger from '../../../util/logging';

const { Person, Document } = models;

export default {
  async createPerson(parent, args) {
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
          throw new ApolloError('Failed to create person', 500);
        }
        if (doc) {
          throw new ApolloError('Document already exists', 409);
        }
      }),
    );

    // Create documents
    const documents = await Promise.all(data.documents.map(newDoc => new Document(newDoc)));

    // Creates person definition
    const def = {
      ...data,
      documents,
    };

    // Creates person
    const person = new Person(def);

    // Sets owner of documents
    documents.forEach(doc => doc.set({ person }));

    // Save all
    await Promise.all(documents.map(doc => doc.validate()));
    await person.validate();

    // Save all
    await Promise.all(documents.map(doc => doc.save()));
    await person.save();

    return Person.findById(person.id);
  },

  async updatePerson(parent, args) {
    // Find person
    const person = await Person.findById(args.person_id);
    if (!person) throw new ApolloError('Person was not found', 404);

    // Person updated fields
    if (args.data.documents) throw new ApolloError('Cannot edit documents via person update', 400);

    // Update
    person.set(args.data);
    await person.save();

    return Person.findById(person.id);
  },

  async addDocumentToPerson(parent, args) {
    // Search for document
    if (await Document.findOne(args.document)) throw new ApolloError('Document already exists', 409);

    // Get person
    const person = await Person.findById(args.person_id);
    if (!person) throw new ApolloError('Person was not found', 404);

    // Add document
    const document = new Document(args.document);
    document.person = person;
    person.documents.push(document.id);

    // Save to db
    await document.save();
    await person.save();

    return Person.findById(person.id);
  },
  async deleteDocumentFromPerson(parent, args) {
    // Delete from person
    await Document.findByIdAndDelete(args.document_id);
    return Person.findByIdAndUpdate(args.person_id, {
      $pull: { documents: args.document_id },
    });
  },
};
