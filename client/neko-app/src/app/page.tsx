"use client";

import {
  Stack,
  Box,
  Popover,
  PopoverTrigger,
  Image,
  Text,
  Card,
  CardBody,
  Heading,
  HStack,
  Spinner,
} from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { FrontendNekorGateway } from "./FrontendNekorGateway";
import { INekor } from "./types";

function GenerateNekoPanel(neko: INekor) {
  return (
    <div style={{ marginBottom: "30px" }}>
      <Popover trigger={"hover"} placement={"bottom-start"}>
        <PopoverTrigger>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Card
              direction={{ base: "column", sm: "row" }}
              overflow="hidden"
              variant="outline"
              w="90%"
              as="a"
              p={2}
              href={"/map?id=" + neko.nekorId}
              border="2px solid black"
            >
              <Image
                objectFit="cover"
                overflow="hidden"
                w={"100%"}
                alignContent={"center"}
                h={"300px"}
                src={neko.imageUrl}
                alt="Caffe Latte"
              />

              <Stack>
                <CardBody>
                  <HStack>
                    <Heading size="md">{neko.title}</Heading>
                  </HStack>

                  <Text py="2">{neko.description}</Text>
                </CardBody>
              </Stack>
            </Card>
          </div>
        </PopoverTrigger>
      </Popover>
    </div>
  );
}

function App() {
  let isMobile = false;
  if (typeof window !== "undefined") {
    isMobile = window.innerWidth <= 768;
  }

  function HeadingAnimation() {
    const [isEnglish, setIsEnglish] = useState(true);

    useEffect(() => {
      const interval = setInterval(() => {
        setIsEnglish((prevLang) => !prevLang);
      }, 4000);

      return () => clearInterval(interval);
    }, []);

    // Variants specify the hidden and visible states of text
    const HeaderVariants = {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    };

    return (
      <Box height={isMobile ? "90px" : "200px"}>
        <AnimatePresence mode="wait">
          <motion.div
            key={isEnglish ? "english" : "dzongkha"}
            variants={HeaderVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 1 }}
          >
            {isEnglish ? (
              <Text fontSize={isMobile ? "4xl" : "8xl"} as={"span"}>
                Pick your nekor!
              </Text>
            ) : (
              <Text fontSize={isMobile ? "4xl" : "8xl"} as={"span"}>
                གནས་སྐོར་གདམ་ཁ་རྐྱབ་གནང།
              </Text>
            )}
          </motion.div>
        </AnimatePresence>
      </Box>
    );
  }

  const [nekors, setNekors] = useState<INekor[]>([]);

  const [appLoaded, setAppLoaded] = useState(false);

  const loadNekors = useCallback(async () => {
    const nekorsResp = await FrontendNekorGateway.getAllNekors();

    if (nekorsResp.success) {
      nekorsResp.payload && setNekors(nekorsResp.payload);
      setAppLoaded(true);
    }
  }, []);

  useEffect(() => {
    loadNekors();
  }, [loadNekors]);

  return (
    <>
      {appLoaded ? (
        <div
          style={{
            display: "flex",

            flexDirection: "column",

            alignItems: "center",

            marginTop: "30px",
          }}
        >
          <HeadingAnimation></HeadingAnimation>
          {nekors.map((neko) => GenerateNekoPanel(neko))}
        </div>
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

export default App;
