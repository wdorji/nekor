export type NekorPointType = "site" | "nature" | "rest";
export const nekorPointTypes: string[] = ["site", "nature", "rest"];

// INekorPoint with nekor point metadata
export interface INekorPoint {
  title: string;
  description: string;
  lat: number;
  long: number;
  imageUrl: string;
  nekorPointId: string; // unique randomly generated ID
  type: NekorPointType; //marker type
  dateCreated?: Date;
}

/**
 * Function that creates an INekorPoint given relevant inputs
 * @param nekorPointId
 * @param type
 * @param title
 * @param description
 * @param imageUrl
 * @param lat
 * @param long
 * @returns INekorPoint object
 */

export function makeINekorPoint(
  nekorPointId: any,
  lat: any,
  long: any,
  type?: any,
  title?: any,
  description?: any,
  imageUrl?: any
): INekorPoint {
  return {
    lat: lat,
    long: long,
    imageUrl:
      imageUrl ??
      "https://images.unsplash.com/photo-1598868660314-f40770bfc932?q=80&w=3042&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: description ?? "description " + nekorPointId,
    nekorPointId: nekorPointId,
    title: title ?? "nekor " + nekorPointId,

    type: type ?? "site",
  };
}

export function isINekorPoint(object: any): object is INekorPoint {
  const propsDefined: boolean =
    typeof (object as INekorPoint).nekorPointId !== "undefined" &&
    typeof (object as INekorPoint).title !== "undefined" &&
    typeof (object as INekorPoint).type !== "undefined" &&
    typeof (object as INekorPoint).lat !== "undefined" &&
    typeof (object as INekorPoint).long !== "undefined" &&
    typeof (object as INekorPoint).imageUrl !== "undefined" &&
    typeof (object as INekorPoint).description !== "undefined";

  // if both are defined
  if (propsDefined) {
    // check if all fields have the right type
    // and verify if filePath.path is properly defined
    return (
      typeof (object as INekorPoint).nekorPointId === "string" &&
      typeof (object as INekorPoint).title === "string" &&
      nekorPointTypes.includes((object as INekorPoint).type) &&
      typeof (object as INekorPoint).description === "string" &&
      typeof (object as INekorPoint).imageUrl === "string" &&
      typeof (object as INekorPoint).lat === "number" &&
      typeof (object as INekorPoint).long === "number"
    );
  }
  return false;
}
