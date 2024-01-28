import {
  INekor,
  INekorPoint,
  INekorRoute,
  IServiceResponse,
  failureServiceResponse,
  isINekor,
  successfulServiceResponse,
} from "../types";
import { MongoClient, SortOptionObject } from "mongodb";

/**
 * NekorCollectionConnection acts as an in-between communicator between
 * the MongoDB database and BackendNekorGateway. NejorCollectionConnection
 * defines methods that interact directly with MongoDB. That said,
 * it does not include any of the complex logic that BackendNekorGateway has.
 *
 * @param {MongoClient} client
 * @param {string} collectionName
 */
export class NekorCollectionConnection {
  client: MongoClient;
  collectionName: string;

  constructor(mongoClient: MongoClient, collectionName?: string) {
    this.client = mongoClient;
    this.collectionName = collectionName ?? "nekors";
  }

  /**
   * Inserts a new nekor into the database
   * Returns successfulServiceResponse with INekor that was inserted as the payload
   *
   * @param {INekor} nekor
   * @return successfulServiceResponse<INekor>
   */
  async insertNekor(nekor: INekor): Promise<IServiceResponse<INekor>> {
    if (!isINekor(nekor)) {
      return failureServiceResponse(
        "Failed to insert nekor due to improper input " +
          "to nekorCollectionConnection.insertNekor"
      );
    }
    const insertResponse = await this.client
      .db()
      .collection(this.collectionName)
      .insertOne(nekor);
    if (insertResponse.insertedCount) {
      return successfulServiceResponse(insertResponse.ops[0]);
    }
    return failureServiceResponse(
      "Failed to insert nekor, insertCount: " + insertResponse.insertedCount
    );
  }

  /**
   * Finds a nekor when given its id.
   * Returns failureServiceResponse when no nekor is found.
   *
   * @param {string} nekorId
   * @return successfulServiceResponse<INekor> on success
   *         failureServiceResponse on failure
   */
  async findNekorById(nekorId: string): Promise<IServiceResponse<INekor>> {
    const findResponse = await this.client
      .db()
      .collection(this.collectionName)
      .findOne({ nekorId: nekorId });
    if (findResponse == null) {
      return failureServiceResponse("Failed to find nekor with this nekorId.");
    } else {
      return successfulServiceResponse(findResponse);
    }
  }

  /**
   * Finds nekors when given a list of nekorIds.
   * Returns successfulServiceResponse with empty array when no nekors found.
   *
   * @param {string[]} nekorIds
   * @return successfulServiceResponse<INekor[]>
   */
  async findNekorsById(
    nekorIds: string[]
  ): Promise<IServiceResponse<INekor[]>> {
    const foundNekors: INekor[] = [];
    await this.client
      .db()
      .collection(this.collectionName)
      .find({ nekorId: { $in: nekorIds } })
      .forEach(function (doc) {
        foundNekors.push(doc);
      });
    return successfulServiceResponse(foundNekors);
  }

  /**
   * Get all nekors from database
   * Returns successfulServiceResponse with empty array when no nekors found.
   *
   * @return successfulServiceResponse<INekor[]>
   */
  async getAllNekors(): Promise<IServiceResponse<INekor[]>> {
    const foundNekors: INekor[] = [];
    await this.client
      .db()
      .collection(this.collectionName)
      .find()
      .forEach(function (doc) {
        foundNekors.push(doc);
      });
    return successfulServiceResponse(foundNekors);
  }

  /**
   * Updates nekor when given a nekorId and a set of properties to update.
   *
   * @param {string} nekorId
   * @param {Object} properties to update in MongoDB
   * @return successfulServiceResponse<INekor> on success
   *         failureServiceResponse on failure
   */
  async updateNekor(
    nekorId: string,
    updatedProperties: Record<string, unknown>
  ): Promise<IServiceResponse<INekor>> {
    const updateResponse = await this.client
      .db()
      .collection(this.collectionName)
      .findOneAndUpdate(
        { nekorId: nekorId },
        { $set: updatedProperties },
        { returnDocument: "after" }
      );
    if (updateResponse.ok && updateResponse.lastErrorObject.n) {
      return successfulServiceResponse(updateResponse.value);
    }
    return failureServiceResponse(
      "Failed to update nekor, lastErrorObject: " +
        updateResponse.lastErrorObject.toString()
    );
  }

  /**
   * Deletes nekor with the given nekorId.
   *
   * @param {string} nekorId
   * @return successfulServiceResponse<null> on success
   *         failureServiceResponse on failure
   */
  async deleteNekor(nekorId: string): Promise<IServiceResponse<null>> {
    const collection = await this.client.db().collection(this.collectionName);
    const deleteResponse = await collection.deleteOne({ nekorId: nekorId });
    if (deleteResponse.result.ok) {
      return successfulServiceResponse(null);
    }
    return failureServiceResponse("Failed to delete");
  }

  /**
   * Deletes nekors when given a list of nekorIds.
   *
   * @param {string[]} nekorIds
   * @return successfulServiceResponse<null> on success
   *         failureServiceResponse on failure
   */
  async deleteNekors(nekorIds: string[]): Promise<IServiceResponse<null>> {
    const collection = await this.client.db().collection(this.collectionName);
    const myquery = { nekorId: { $in: nekorIds } };
    const deleteResponse = await collection.deleteMany(myquery);
    if (deleteResponse.result.ok) {
      return successfulServiceResponse(null);
    }
    return failureServiceResponse("Failed to update nekors");
  }
}
