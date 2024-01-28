import { failureServiceResponse, INekor, IServiceResponse } from "./types";
import { endpoint, get, post, remove } from "./global";

/** In development mode (locally) the server is at localhost:8000*/
const baseEndpoint = endpoint;

/** This is the path to the nekors microservice */
const servicePath = "nekor/";

/**
 * FrontendNekorGateway handles HTTP requests to the host, which is located on
 * the server. This FrontendNekorGateway object uses the baseEndpoint, and
 * additional server information to access the requested information.
 *
 * These methods use the get, post, put and remove http requests from request.ts
 * helper methods to make requests to the server.
 */
export const FrontendNekorGateway = {
  createNekor: async (nekor: INekor): Promise<IServiceResponse<INekor>> => {
    try {
      const nekorResp = await post<IServiceResponse<INekor>>(
        baseEndpoint + servicePath + "create",
        {
          nekor: nekor,
        }
      );

      return nekorResp;
    } catch (exception) {
      return failureServiceResponse("[createNekor] Unable to access backend");
    }
  },

  /**
   * This is method is that is called whenever a nekor is deleted
   *
   * Explainer:
   * Now that our system supports anchors and links, whenever we delete a
   * nekor, we want to delete the links that are on the nekor we are deleting.
   *
   * Anchors can have multiple links but if an anchor is only attached to
   * one link and that link gets deleted, this anchor becomes an orphan anchor.
   * We need to delete these orphan anchors from the database. Note, link and orphan
   * anchor deletion will be handled by FrontendLinkGateway.deleteLinks().
   *
   * In this method we want to get the links associated with a nekor and delete those
   * links via FrontendLinkGateway.deleteLinks(). Once the links and associated
   * orphan anchors have been deleted, we can delete the nekor as we did in Assignment
   * 1.
   *
   * TIPS:
   * You will likely need to make the following requests in this order:
   * - get anchors by nekorId (frontend FrontendAnchorGateway)
   * - get links by anchorIds (frontend FrontendLinkGateway)
   * - delete links and associated orphan anchors (frontend FrontendLinkGateway)
   * - delete nekor (request directly to backend)
   *
   * @param nekorId nekorId of the nekor to delete
   * @returns Promise<IServiceResponse<object>>
   */
  deleteNekor: async (nekorId: string): Promise<IServiceResponse<object>> => {
    try {
      // delete nekor
      return await remove<IServiceResponse<INekor>>(
        baseEndpoint + servicePath + nekorId
      );
    } catch (exception) {
      return failureServiceResponse("[deleteNekor] Unable to access backend");
    }
  },

  getNekor: async (nekorId: string): Promise<IServiceResponse<INekor>> => {
    try {
      return await get<IServiceResponse<INekor>>(
        baseEndpoint + servicePath + "get/" + nekorId
      );
    } catch (exception) {
      return failureServiceResponse("[getNekor] Unable to access backend");
    }
  },

  getNekors: async (
    nekorIds: string[]
  ): Promise<IServiceResponse<INekor[]>> => {
    try {
      return await post<IServiceResponse<INekor[]>>(
        baseEndpoint + servicePath + "getNekorsById",
        {
          nekorIds: nekorIds,
        }
      );
    } catch (exception) {
      return failureServiceResponse("[getNekors] Unable to access backend");
    }
  },

  getAllNekors: async (): Promise<IServiceResponse<INekor[]>> => {
    try {
      return await get<IServiceResponse<INekor[]>>(
        baseEndpoint + servicePath + "getAll"
      );
    } catch (exception) {
      return failureServiceResponse("[getAllNekors] Unable to access backend");
    }
  },

  // updateNekor: async (
  //   nekorId: string,
  //   properties: INekorProperty[]
  // ): Promise<IServiceResponse<INekor>> => {
  //   try {
  //     return await put<IServiceResponse<INekor>>(
  //       baseEndpoint + servicePath + nekorId,
  //       {
  //         data: properties,
  //       }
  //     );
  //   } catch (exception) {
  //     return failureServiceResponse("[updateNekor] Unable to access backend");
  //   }
  // },
};
