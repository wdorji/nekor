"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl, { LngLat } from "mapbox-gl";
import { FeatureCollection } from "geojson";
import "mapbox-gl/dist/mapbox-gl.css";
import { INekor } from "../../types";

type mapProps = {
  nekor: INekor;
};

function MapboxMap(props: mapProps) {
  const isMobile = window.innerWidth <= 768;
  // this is where the map instance will be stored after initialization
  const nekor = props.nekor;
  const [map, setMap] = useState<mapboxgl.Map>();

  map;

  const curNekoPoints = nekor.points;

  const startPoint = curNekoPoints[0];

  const [nekoCenter, setNekoCenter] = useState([
    startPoint.long,
    startPoint.lat,
  ]);

  // React ref to store a reference to the DOM node that will be used
  // as a required parameter `container` when initializing the mapbox-gl
  // will contain `null` by default
  const mapNode = useRef(null);

  useEffect(() => {
    const node = mapNode.current;
    // if the window object is not found, that means
    // the component is rendered on the server
    // or the dom node is not initialized, then return early
    if (typeof window === "undefined" || node === null) return;

    // otherwise, create a map instance
    const mapboxMap = new mapboxgl.Map({
      container: node,
      accessToken: process.env.NEXT_PUBLIC_MAP_ACCESS_TOKEN,
      style: process.env.NEXT_PUBLIC_MAP_STYLE,
      center: [nekoCenter[0], nekoCenter[1]],
      zoom: 15.5,
      pitch: 55,
      bearing: 41,
    });

    mapboxMap.on("style.load", () => {
      mapboxMap.addSource("route", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: nekor.route.nekorRoute,
          },
        },
      });

      mapboxMap.addSource("mapbox-dem", {
        type: "raster-dem",
        url: "mapbox://mapbox.mapbox-terrain-dem-v1",
        tileSize: 512,
        maxzoom: 14,
      });

      mapboxMap.setTerrain({ source: "mapbox-dem", exaggeration: 1.5 });

      mapboxMap.addLayer({
        id: "route",
        type: "line",
        source: "route",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "cyan",
          "line-width": 8,
        },
      });

      mapboxMap.addSource("dot-point", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: nekoCenter,
              },
            },
          ],
        } as FeatureCollection,
      });
    });

    function addPopup(
      long: number,
      lat: number,
      imgPath: string,
      title: string,
      description: string,
      markerType: string
    ) {
      const el = document.createElement("div");
      el.id = markerType;
      el.addEventListener("click", function (e) {
        e.stopPropagation();
        openNav(title, imgPath, description);
        setNekoCenter([long, lat]);
      });
      // create the marker
      new mapboxgl.Marker(el).setLngLat(new LngLat(long, lat)).addTo(mapboxMap);
    }

    for (const item of curNekoPoints) {
      addPopup(
        +item.long,
        +item.lat,
        item.imageUrl,
        item.title,
        item.description,
        item.type
      );
    }

    setMap(mapboxMap);

    return () => {
      mapboxMap.remove();
    };
  }, [curNekoPoints, nekoCenter, nekor.route.nekorRoute]);

  function openNav(curTitle: string, curImgPath: string, curDesc: string) {
    document.getElementById("mySidebar")!.style.width = isMobile
      ? "100%"
      : "500px";
    document.getElementById("sidebarContent")!.innerHTML = `
    
    <h1 style="color: white; font-weight: 900;padding-left: 20px;">${curTitle}</h1>
    <h1 style="color: white; font-weight: 900;"></h1>
    <div class="spacer"></div>
    <img src=${curImgPath} alt="" />
    <div class="sidebar-box">
    <p>${curDesc}</p>
  </div>
    
    `;
  }

  function closeNav() {
    document.getElementById("mySidebar")!.style.width = "0";
  }

  return (
    <>
      <div id="mySidebar" className="sidebar">
        <a href="javascript:void(0)" className="closebtn" onClick={closeNav}>
          ×
        </a>
        <div id="sidebarContent" className="sidebar-content"></div>
      </div>

      <div ref={mapNode} style={{ width: "100%", height: "100%" }} />
    </>
  );
}

export default MapboxMap;
