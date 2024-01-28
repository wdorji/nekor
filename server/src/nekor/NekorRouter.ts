import express, { Request, Response, Router } from "express";
import { MongoClient } from "mongodb";
import { INekor, IServiceResponse, isINekor } from "../types";
import { BackendNekorGateway } from "./BackendNekorGateway";
// import { json } from "body-parser";
// const bodyJsonParser = json();

export const NekorExpressRouter = express.Router();

/**
 * NekorRouter uses NekorExpressRouter (an express router) to define responses
 * for specific HTTP requests at routes starting with '/nekor'.
 *
 */
export class NekorRouter {
  BackendNekorGateway: BackendNekorGateway;

  constructor(mongoClient: MongoClient) {
    this.BackendNekorGateway = new BackendNekorGateway(mongoClient);

    /**
     * Request to create nekor
     *
     * @param req request object coming from client
     * @param res response object to send to client
     */
    NekorExpressRouter.post("/create", async (req: Request, res: Response) => {
      try {
        const nekor = req.body;

        if (!isINekor(nekor)) {
          res.status(400).send("not INekor!");
        } else {
          const response = await this.BackendNekorGateway.createNekor(nekor);
          res.status(200).send(response);
        }
      } catch (e) {
        res.status(500).send("dd");
      }
    });

    /**
     * Request to retrieve nekor by nekorId
     *
     * @param req request object coming from client
     * @param res response object to send to client
     */
    NekorExpressRouter.get(
      "/get/:nekorId",
      async (req: Request, res: Response) => {
        try {
          const nekorId = req.params.nekorId;
          const response: IServiceResponse<INekor> =
            await this.BackendNekorGateway.getNekorById(nekorId);
          res.status(200).send(response);
        } catch (e) {
          res.status(500).send("dd");
        }
      }
    );

    /**
     * Request to retrieve nekors by nekorIds
     *
     * @param req request object coming from client
     * @param res response object to send to client
     */
    NekorExpressRouter.post(
      "/getNekorsById",
      async (req: Request, res: Response) => {
        try {
          const nekorIds = req.body.nekorIds;
          const response: IServiceResponse<INekor[]> =
            await this.BackendNekorGateway.getNekorsById(nekorIds);
          res.status(200).send(response);
        } catch (e) {
          res.status(500).send("dd");
        }
      }
    );

    /**
     * Request to retrieve nekors
     *
     * @param req request object coming from client
     * @param res response object to send to client
     */
    NekorExpressRouter.get("/getAll", async (req: Request, res: Response) => {
      try {
        const response: IServiceResponse<INekor[]> =
          await this.BackendNekorGateway.getAllNekors();
        res.status(200).send(response);
      } catch (e) {
        res.status(500).send("dd");
      }
    });

    // /**
    //  * Request to search nekors by search term
    //  *
    //  * @param req request object coming from client
    //  * @param res response object to send to client
    //  */
    // NekorExpressRouter.get(
    //   "/search/:searchTerm/:byDate",
    //   async (req: Request, res: Response) => {
    //     try {
    //       const searchTerm = req.params.searchTerm; //search term
    //       let byDate = false; //default search by relevance
    //       if (req.params.byDate === "true") {
    //         byDate = true;
    //       }
    //       const response: IServiceResponse<INekor[]> = //make call to BackendNekorGateway
    //         await this.BackendNekorGateway.getNekorsBySearchTerm(
    //           searchTerm,
    //           byDate
    //         );
    //       res.status(200).send(response);
    //     } catch (e) {
    //       res.status(500).send(e.message);
    //     }
    //   }
    // );

    // /**
    //  * Request to update the nekor with the given nekorId
    //  *
    //  * @param req request object coming from client
    //  * @param res response object to send to client
    //  */
    // NekorExpressRouter.put(
    //   "/:nekorId",
    //   bodyJsonParser,
    //   async (req: Request, res: Response) => {
    //     try {
    //       const nekorId = req.params.nekorId;
    //       const toUpdate: INekorProperty[] = req.body.data;
    //       const response = await this.BackendNekorGateway.updateNekor(
    //         nekorId,
    //         toUpdate
    //       );
    //       res.status(200).send(response);
    //     } catch (e) {
    //       res.status(500).send(e.message);
    //     }
    //   }
    // );

    /**
     * Request to delete the nekor with the given nekorId
     *
     * @param req request object coming from client
     * @param res response object to send to client
     */
    NekorExpressRouter.delete(
      "/:nekorId",
      async (req: Request, res: Response) => {
        try {
          const nekorId = req.params.nekorId;
          const response = await this.BackendNekorGateway.deleteNekor(nekorId);
          res.status(200).send(response);
        } catch (e) {
          res.status(500).send("dd");
        }
      }
    );
  }

  /**
   * @returns NekorRouter class
   */
  getExpressRouter = (): Router => {
    return NekorExpressRouter;
  };
}
