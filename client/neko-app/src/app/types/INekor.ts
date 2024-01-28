import { INekorPoint, isINekorPoint } from "./INekorPoint";
import { INekorRoute, isINekorRoute } from "./INekorRoute";

export type NekorDifficultyType = "easy" | "medium" | "hard";
export const nekorDifficultyTypes: string[] = ["easy", "medium", "hard"];

// INekor with nekor metadata
export interface INekor {
  title: string;
  dTitle: string;
  description: string;
  imageUrl: string;
  nekorId: string; // unique randomly generated ID
  timeCompletion: number;
  difficulty: NekorDifficultyType;
  points: INekorPoint[];
  route: INekorRoute;
  dateCreated?: Date;
}

/**
 * Function that creates an INekor given relevant inputs
 * @param nekorId
 * @param difficulty
 * @param title
 * @param description
 * @param imageUrl
 * @param timeCompletion
 * @param points
 * @param route
 * @returns INekor object
 */

export function makeINekor(
  nekorId: any,
  route: any,
  points: any,
  difficulty?: any,
  title?: any,
  dTitle?: any,
  description?: any,
  imageUrl?: any,
  timeCompletion?: any
): INekor {
  return {
    nekorId: nekorId,
    route: route,
    dTitle: dTitle,
    points: points,
    timeCompletion: timeCompletion ?? 0,
    imageUrl:
      imageUrl ??
      "https://images.unsplash.com/photo-1598868660314-f40770bfc932?q=80&w=3042&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: description ?? "description " + nekorId,
    title: title ?? "nekor " + nekorId,
    difficulty: difficulty ?? "easy",
  };
}

export function isINekor(object: any): object is INekor {
  const propsDefined: boolean =
    typeof (object as INekor).nekorId !== "undefined" &&
    typeof (object as INekor).dTitle !== "undefined" &&
    typeof (object as INekor).title !== "undefined" &&
    typeof (object as INekor).difficulty !== "undefined" &&
    typeof (object as INekor).timeCompletion !== "undefined" &&
    typeof (object as INekor).points !== "undefined" &&
    typeof (object as INekor).route !== "undefined" &&
    typeof (object as INekor).imageUrl !== "undefined" &&
    typeof (object as INekor).description !== "undefined";

  if (propsDefined) {
    const nekorRoutePoints = (object as INekor).points;
    if (Array.isArray(nekorRoutePoints)) {
      nekorRoutePoints.forEach(function (item) {
        if (!isINekorPoint(item)) {
          return false;
        }
      });
    }

    return (
      typeof (object as INekor).nekorId === "string" &&
      typeof (object as INekor).title === "string" &&
      typeof (object as INekor).dTitle === "string" &&
      nekorDifficultyTypes.includes((object as INekor).difficulty) &&
      typeof (object as INekor).description === "string" &&
      typeof (object as INekor).imageUrl === "string" &&
      isINekorRoute((object as INekor).route)
    );
  }
  return false;
}
