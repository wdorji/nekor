"use client";

import { useCallback, useEffect, useState } from "react";
import { FrontendNekorGateway } from "../FrontendNekorGateway";
import MapboxMap from "../components/map/reactMap";
import { INekor } from "../types";
import { Spinner } from "@chakra-ui/react";

function MainMap() {
  const placeholderNekor: INekor = {
    nekorId: "Lorem ipsum dolor",
    route: { nekorRoute: [] },
    dTitle: "Lorem ipsum dolor",
    points: [],
    timeCompletion: 0,
    imageUrl:
      "https://images.unsplash.com/photo-1598868660314-f40770bfc932?q=80&w=3042&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "Lorem ipsum dolor",
    title: "Lorem ipsum dolor",
    difficulty: "easy",
  };

  const [nekor, setNekor] = useState<INekor>(placeholderNekor);

  const [appLoaded, setAppLoaded] = useState(false);

  const loadNekor = useCallback(async () => {
    const nekorsResp = await FrontendNekorGateway.getNekor(
      window.location.toString().split("=")[1]
    );

    if (nekorsResp.success) {
      nekorsResp.payload && setNekor(nekorsResp.payload);
      setAppLoaded(true);
    }
  }, []);

  useEffect(() => {
    loadNekor();
  }, [loadNekor]);

  return (
    <>
      {appLoaded ? (
        <MapboxMap nekor={nekor!} />
      ) : (
        <Spinner
          justifyContent="center"
          size="xl"
          marginLeft="50%"
          marginTop="20%"
        />
      )}
    </>
  );
}

export default MainMap;
