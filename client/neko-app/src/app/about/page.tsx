"use client";

import { ParallaxProvider, ParallaxBanner } from "react-scroll-parallax";

export default function About() {
  const isMobile = window.innerWidth <= 768;

  interface PanelProps {
    imageUrl: string;
    content: string;
  }

  function generatePanel(panelProps: PanelProps) {
    return (
      <ParallaxBanner
        layers={[{ image: panelProps.imageUrl, speed: -20 }]}
        style={{ aspectRatio: "2/1", height: "500px" }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              border: "2px solid black",
              width: "70%",
            }}
          >
            <h1
              style={{
                fontSize: isMobile ? "sm" : "2rem",
                color: "black",
                fontWeight: "thin",
              }}
            >
              {panelProps.content}
            </h1>
          </div>
        </div>
      </ParallaxBanner>
    );
  }

  const panel1props = {
    imageUrl:
      "https://images.unsplash.com/photo-1607066511406-a4b389dc138e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2415&q=80",
    content:
      "Nekor provides an immersive web experience to learn about sacred and historical sites across the himalayan region.",
  };
  const panel2props = {
    content: `Nekor(གནས་སྐོར།) refers to pilgrimage and directly translates to circumambulate a sacred place in Tibetan.`,
    imageUrl:
      "https://i.pinimg.com/originals/84/2a/d6/842ad68b315b0f586c30b465221da609.jpg",
  };

  const panel5props = {
    content: ` 
    The inspiration came from wanting to create a literal story map of Nekors based on accounts I would hear from my grandparents growing up but with time, such stories without efforts to record them would disappear.`,
    imageUrl:
      "https://i.pinimg.com/originals/84/2a/d6/842ad68b315b0f586c30b465221da609.jpg",
  };

  const panel3props = {
    imageUrl:
      "https://images.unsplash.com/photo-1541595710917-786e622215a7?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content:
      "Each Nekor has a chosen route to follow. There are also markers which when clicked shows a description of a site. The types of checkpoints are cultural landmarks, natural landmarks and recommended rest stops.",
  };

  const panel4props = {
    content:
      "If you want to go on these Nekors in real life, remember to take nothing but memories, leave nothing but footprintse. You are sharing these experiences with others, and everyone deserves to enjoy the tranquility of these sacred sites.",
    imageUrl:
      "https://images.unsplash.com/photo-1605904583059-7880dad25595?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
  };

  return (
    <main>
      <ParallaxProvider>
        {generatePanel(panel1props)}
        {generatePanel(panel2props)}
        {generatePanel(panel3props)}
        {generatePanel(panel5props)}
        {generatePanel(panel4props)}
      </ParallaxProvider>
    </main>
  );
}
