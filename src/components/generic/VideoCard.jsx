import "./VideoCard.scss"
import React from 'react'
import {Card, CardBody} from "react-bootstrap"
import CircularButton from "/src/components/generic/CircularButton.jsx"
import {useWindow} from "/src/providers/WindowProvider.jsx"
import {useFeedbacks} from "/src/providers/FeedbacksProvider.jsx"

function VideoCard({className, img, title, text, options}) {
    const {displayYoutubeVideo, displayGallery} = useFeedbacks()
    const {isBreakpoint} = useWindow()

    const _onOptionClicked = (option) => {
        displayYoutubeVideo(option.target, title, text)
    }

    return (
        <Card className={`grid-item ${className}`}>
            <CardBody>
                <img
                    src={img}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                
                <div className={`image-wrapper ${!text ? 'mt-3' : ''}`}>
                    <CircularButton options={options} onOptionClicked={_onOptionClicked}/>
                </div>
                
            </CardBody>
        </Card>
    )
}

export default VideoCard