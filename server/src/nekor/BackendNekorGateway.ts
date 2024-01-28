import { MongoClient } from "mongodb";
import {
  failureServiceResponse,
  IServiceResponse,
  successfulServiceResponse,
  INekor,
  isINekor,
} from "../types";
import { NekorCollectionConnection } from "./NekorCollectionConnection";

/**
 * BackendNekorGateway handles requests from NekorRouter, and calls on methods
 * in NekorCollectionConnection to interact with the database. It contains
 * the complex logic to check whether the request is valid, before
 * modifying the database.
 *
 */
export class BackendNekorGateway {
  nekorCollectionConnection: NekorCollectionConnection;

  constructor(mongoClient: MongoClient, collectionName?: string) {
    this.nekorCollectionConnection = new NekorCollectionConnection(
      mongoClient,
      collectionName ?? "nekors"
    );
  }

  /**
   * Method to create a nekor and insert it into the database.
   *
   * @param nekorId - The nekorId of the nekor to be created.
   */
  async createNekor(nekor: any): Promise<IServiceResponse<INekor>> {
    // check whether is valid Nekor
    const isValidNekor = isINekor(nekor);
    if (!isValidNekor) {
      return failureServiceResponse("Not a valid nekor.");
    }
    // check whether already in database
    const nekorResponse = await this.nekorCollectionConnection.findNekorById(
      nekor.nekorId
    );
    if (nekorResponse.success) {
      return failureServiceResponse(
        "Nekor with duplicate ID already exist in database."
      );
    }
    // if everything checks out, insert nekor
    const insertNekorResp = await this.nekorCollectionConnection.insertNekor(
      nekor
    );
    return insertNekorResp;
  }

  /**
   * Method to retrieve nekor with a given nekorId.
   *
   * @param nekorId - The nekorId of the nekor to be retrieved.
   * @returns IServiceResponse<INekor>
   */
  async getNekorById(nekorId: string): Promise<IServiceResponse<INekor>> {
    return this.nekorCollectionConnection.findNekorById(nekorId);
  }

  /**
   * Method to retrieve nekors with a given nekorIds.
   *
   * @param nekorId - The nekorIds of the nekors to be retrieved.
   * @returns IServiceResponse<INekor[]>
   */
  async getNekorsById(nekorIds: string[]): Promise<IServiceResponse<INekor[]>> {
    return this.nekorCollectionConnection.findNekorsById(nekorIds);
  }

  /**
   * Method to retrieve nekors with a given nekorIds.
   *
   * @param nekorId - The nekorIds of the nekors to be retrieved.
   * @returns IServiceResponse<INekor[]>
   */
  async getAllNekors(): Promise<IServiceResponse<INekor[]>> {
    return this.nekorCollectionConnection.getAllNekors();
  }

  // /**
  //  * Method to retrieve nekors with a given search term and to order results by date
  //  * @param searchTerm query to search for
  //  * @param byDate boolean to order results by created date, by default based on relevance score
  //  * @returns IServiceResponse<INekor[]>
  //  */
  // async getNekorsBySearchTerm(
  //   searchTerm: string,
  //   byDate: boolean
  // ): Promise<IServiceResponse<INekor[]>> {
  //   return this.nekorCollectionConnection.findNekorsBySearchTerm(
  //     searchTerm,
  //     byDate
  //   );
  // }

  /**
   * Method to delete nekor with the given nekorId, and all of its children.
   *
   * @param nekorId the nekorId of the nekor
   * @returns Promise<IServiceResponse<null>>
   */
  async deleteNekor(nekorId: string): Promise<IServiceResponse<null>> {
    const nekorResponse = await this.getNekorById(nekorId);
    if (!nekorResponse.success) {
      return failureServiceResponse(
        "Failed to find the nekor you wanted to delete"
      );
    }

    const deleteTreeResp = await this.deleteNekor(nekorId);
    if (!deleteTreeResp.success) {
      return failureServiceResponse("Failed to delete nekor");
    }

    return successfulServiceResponse(null);
  }

  // /**
  //  * Method to update the nekor with the given nekorId.
  //  * @param nekorId the nekorId of the nekor
  //  * @param toUpdate an array of INekorProperty
  //  *
  //  * @returns IServiceResponse<INekor>
  //  */
  // async updateNekor(
  //   nekorId: string,
  //   toUpdate: INekorProperty[]
  // ): Promise<IServiceResponse<INekor>> {
  //   const properties = {};
  //   for (let i = 0; i < toUpdate.length; i++) {
  //     if (!isINekorProperty(toUpdate[i])) {
  //       return failureServiceResponse("toUpdate parameters invalid");
  //     }
  //     const fieldName = toUpdate[i].fieldName;
  //     const value = toUpdate[i].value;
  //     properties[fieldName] = value;
  //   }
  //   const nekorResponse = await this.nekorCollectionConnection.updateNekor(
  //     nekorId,
  //     properties
  //   );
  //   if (!nekorResponse.success) {
  //     return failureServiceResponse(
  //       "This nekor does not exist in the database!"
  //     );
  //   }
  //   return nekorResponse;
  // }
}
