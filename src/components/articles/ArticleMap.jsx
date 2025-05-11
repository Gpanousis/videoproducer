import React, { useEffect, useState } from "react";
import Article from "/src/components/wrappers/Article.jsx";
import Expandable from "/src/components/capabilities/Expandable.jsx";
import VideoMap from "/src/components/generic/VideoMap.jsx";
import { useParser } from "/src/helpers/parser.js";
import { useLanguage } from "/src/providers/LanguageProvider.jsx";

function ArticleMap({ data }) {
  const parser = useParser();
  const { selectedLanguageId } = useLanguage();

  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const parsed = parser.parseArticleData(data);
    const items = parsed.items || [];

    const mappedLocations = items
      .filter((item) => item?.location?.coordinates && item?.media?.video)
      .map((item) => ({
        id: item.id,
        name: item.title,
        coordinates: item.location.coordinates, // [lng, lat]
        videoSrc: item.media.video, // assumed to be a URL
      }));

    setLocations(mappedLocations);
  }, [data, selectedLanguageId]);

  const title = data?.title || "Interactive Map";

  return (
    <Article className="article-map" title={title}>
      <VideoMap locations={locations} />
    </Article>
  );
}

export default ArticleMap;
