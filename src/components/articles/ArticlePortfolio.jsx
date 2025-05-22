import React, {useEffect, useState} from 'react'
import Article from "/src/components/wrappers/Article.jsx"
import {Col, Row} from "react-bootstrap"
import {useParser} from "/src/helpers/parser.js"
import {useScheduler} from "/src/helpers/scheduler.js"
import Categorizable from "/src/components/capabilities/Categorizable.jsx"
import Expandable from "/src/components/capabilities/Expandable.jsx"
import ProjectCard from "/src/components/generic/ProjectCard.jsx"
import VideoCard from "/src/components/generic/VideoCard.jsx"
import {useLanguage} from "/src/providers/LanguageProvider.jsx"
import {useWindow} from "/src/providers/WindowProvider.jsx"

const AnimationStatus = {
    INVISIBLE: "invisible",
    VISIBLE: "visible",
    VISIBLE_WITH_TWEEN: "visible_with_tween"
}

function ArticlePortfolio({ data }) {
    const parser = useParser()
    const scheduler = useScheduler()
    const {isBreakpoint} = useWindow()
    const {selectedLanguageId} = useLanguage()

    const parsedData = parser.parseArticleData(data)

    const [parsedItems, setParsedItems] = useState([])
    const [parsedCategories, setParsedCategories] = useState([])
    const [categoryFilterResult, setCategoryFilterResult] = useState(parsedItems)
    const [expandableFilterResult, setExpandableFilterResult] = useState(parsedItems)
    const [shouldAnimate, setShouldAnimate] = useState(false)
    const [skipAnimationForNextChange, setSkipAnimationForNextChange] = useState(false)

    useEffect(() => {
        const fetchYouTubeItems = async () => {
            const apiKey = 'AIzaSyBdKJqS_2VEqroyRg6iyIX0Js7wp_4VPEo';
            const playlistId = 'PLp2z1xQ4d8IDxWbE3eJcX7700t5FdEUIL'; // or use uploads playlist
            const maxResults = 21;
    
            const ytRes = await fetch(
                `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=${maxResults}&key=${apiKey}`
            );
            const ytData = await ytRes.json();
    
            return ytData.items.map(video => {
                const vid = video.snippet.resourceId.videoId;
                return {
                    title: video.snippet.title,
                    text: video.snippet.description,
                    category:{

                    },
                    categoryId: "websites",
                    mediaOptions: {
                        aria: 'youtube-play',
                        target: `https://www.youtube.com/watch?v=${vid}`,
                        tooltip: 'Watch Video',
                        faIcon: 'fa-brands fa-youtube',
                        faIconColors: { bg: null, fill: null },
                    },
                    img: `https://img.youtube.com/vi/${vid}/mqdefault.jpg`,
                };
            });
        };
    
        const init = async () => {
            const parsedCategories = parser.parseArticleCategories(parsedData.categories);
            parser.bindItemsToCategories(parsedItems, parsedCategories);
            const ytItems = await fetchYouTubeItems();
            setParsedItems(ytItems);
            setParsedCategories(parsedCategories);
            setCategoryFilterResult(ytItems);
            setSkipAnimationForNextChange(true);
        };
    
        init();
    }, [null, selectedLanguageId]);
    

    useEffect(() => {
        if(skipAnimationForNextChange) {
            setSkipAnimationForNextChange(false)
            return
        }

        setShouldAnimate(true)
        _setAnimationStatus(AnimationStatus.INVISIBLE)
    }, [categoryFilterResult])

    useEffect(() => {
        if(shouldAnimate) {
            _setAnimationStatus(AnimationStatus.VISIBLE_WITH_TWEEN)
        }
        else {
            _setAnimationStatus(AnimationStatus.VISIBLE)
        }

        setShouldAnimate(false)
    }, [expandableFilterResult])

    useEffect(() => {
        _setAnimationStatus(AnimationStatus.VISIBLE)
    }, [])

    const _setAnimationStatus = (animationStatus) => {
        const tag = 'portfolio-grid'
        scheduler.clearAllWithTag(tag)
        const divs = document.querySelectorAll('.grid-item')

        switch(animationStatus) {
            case AnimationStatus.INVISIBLE:
                divs.forEach((div, index) => {
                    div.classList.add(`grid-item-hidden`)
                })
                break

            case AnimationStatus.VISIBLE:
                divs.forEach((div, index) => {
                    div.classList.remove(`grid-item-hidden`)
                })
                break

            case AnimationStatus.VISIBLE_WITH_TWEEN:
                divs.forEach((div, index) => {
                    div.classList.add(`grid-item-hidden`)

                    scheduler.schedule(() => {
                        div.classList.remove(`grid-item-hidden`)
                    }, 200 + 100 * index, tag)
                })
                break
        }
    }

    const _getMaxItemsPerPage = () => {
        if(isBreakpoint('xxl'))
            return 9
        if(isBreakpoint('lg'))
            return 8
        if(isBreakpoint('sm'))
            return 6
        return 4
    }

    return(
        <Article className={`article-portfolio`} title={ parsedData.title }>
            <Row className={`gx-4 gy-lg-4 gx-lg-5`}>
                <Categorizable items={parsedItems}
                               categories={parsedCategories}
                               onFilter={setCategoryFilterResult}
                               storageId={data.id + "_categorizable"}
                               controlsClass={``}>

                    <Expandable items={categoryFilterResult}
                                storageId={null}
                                onFilter={setExpandableFilterResult}
                                controlsClass={`mt-4 pt-1`}
                                maxItems={_getMaxItemsPerPage()}>

                        {expandableFilterResult.map((item, key) => (
                            <Col key={key} className={`col-12 col-sm-6 col-md-12 col-lg-6 col-xxl-4`}>
                                <VideoCard title={item.title}
                                             text={item.text}
                                             options={item.mediaOptions}
                                             img={item.img}
                                             className={`grid-item-hidden`}/>
                            </Col>
                        ))}
                    </Expandable>
                </Categorizable>
            </Row>
        </Article>
    )
}

export default ArticlePortfolio