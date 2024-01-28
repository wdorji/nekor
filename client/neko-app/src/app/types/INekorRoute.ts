// INekorPoint with nekor metadata
export interface INekorRoute {
  nekorRoute: number[][]; // unique randomly generated ID
}

/**
 * Function that creates an INekorPoint given relevant inputs
 * @param nekorRoute
 * @returns INekorPoint object
 */

export function makeINekorRoute(nekorRoute: any): INekorRoute {
  return {
    nekorRoute: nekorRoute,
  };
}

export function isINekorRoute(object: any): object is INekorRoute {
  const propsDefined: boolean =
    typeof (object as INekorRoute).nekorRoute !== "undefined";

  // if both are defined
  if (propsDefined) {
    // check if all fields have the right type
    // and verify if filePath.path is properly defined

    const nekorRoutePoints = (object as INekorRoute).nekorRoute;

    if (Array.isArray(nekorRoutePoints)) {
      nekorRoutePoints.forEach(function (latLongCoord) {
        if (Array.isArray(latLongCoord)) {
          if (latLongCoord.length === 2) {
            latLongCoord.forEach(function (item) {
              if (!(typeof item === "number")) {
                return false;
              }
            });
          } else {
            return false;
          }
        } else {
          return false;
        }
      });
      return true;
    } else {
      return false;
    }
  }
  return false;
}
