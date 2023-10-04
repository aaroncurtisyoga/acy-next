import React from "react";
import classes from "./landingPage.module.scss";

/* Instagram, Email, YouTube,*/
const IconLinks = () => {
  return (
    <div className={classes.links}>
      <a href="https://www.instagram.com/aaroncurtisyoga" target={`_blank`}>
        <svg
          version="1.1"
          id="Layer_1"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          x="0px"
          y="0px"
          viewBox="0 0 56.7 56.7"
          enableBackground="new 0 0 56.7 56.7"
          xmlSpace="preserve"
        >
          <g>
            <path d="M28.2,16.7c-7,0-12.8,5.7-12.8,12.8s5.7,12.8,12.8,12.8S41,36.5,41,29.5S35.2,16.7,28.2,16.7z M28.2,37.7 c-4.5,0-8.2-3.7-8.2-8.2s3.7-8.2,8.2-8.2s8.2,3.7,8.2,8.2S32.7,37.7,28.2,37.7z" />
            <circle cx="41.5" cy="16.4" r="2.9" />
            <path
              d="M49,8.9c-2.6-2.7-6.3-4.1-10.5-4.1H17.9c-8.7,0-14.5,5.8-14.5,14.5v20.5c0,4.3,1.4,8,4.2,10.7c2.7,2.6,6.3,3.9,10.4,3.9
                                h20.4c4.3,0,7.9-1.4,10.5-3.9c2.7-2.6,4.1-6.3,4.1-10.6V19.3C53,15.1,51.6,11.5,49,8.9z M48.6,39.9c0,3.1-1.1,5.6-2.9,7.3
                                s-4.3,2.6-7.3,2.6H18c-3,0-5.5-0.9-7.3-2.6C8.9,45.4,8,42.9,8,39.8V19.3c0-3,0.9-5.5,2.7-7.3c1.7-1.7,4.3-2.6,7.3-2.6h20.6
                                c3,0,5.5,0.9,7.3,2.7c1.7,1.8,2.7,4.3,2.7,7.2V39.9L48.6,39.9z"
            />
          </g>
        </svg>
      </a>
      <a href="mailto: aaroncurtisyoga@gmail.com">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M0 0h24v24H0V0z" fill="none" />
          <path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0l-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z" />
        </svg>
      </a>
      <a
        href="https://www.youtube.com/channel/UCfkt1zEmSxiJ0viNQ7YfNig"
        target={`_blank`}
      >
        <svg
          height="512px"
          id="Layer_1"
          version="1.1"
          viewBox="0 0 512 512"
          width="512px"
          xmlSpace="preserve"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
        >
          <g>
            <path d="M508.6,148.8c0-45-33.1-81.2-74-81.2C379.2,65,322.7,64,265,64c-3,0-6,0-9,0s-6,0-9,0c-57.6,0-114.2,1-169.6,3.6   c-40.8,0-73.9,36.4-73.9,81.4C1,184.6-0.1,220.2,0,255.8C-0.1,291.4,1,327,3.4,362.7c0,45,33.1,81.5,73.9,81.5   c58.2,2.7,117.9,3.9,178.6,3.8c60.8,0.2,120.3-1,178.6-3.8c40.9,0,74-36.5,74-81.5c2.4-35.7,3.5-71.3,3.4-107   C512.1,220.1,511,184.5,508.6,148.8z M207,353.9V157.4l145,98.2L207,353.9z" />
          </g>
        </svg>
      </a>
    </div>
  )
}

export default IconLinks;
