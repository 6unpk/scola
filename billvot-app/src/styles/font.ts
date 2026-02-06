import PretendardLight from "../assets/fonts/Pretendard-Light.woff2";
import PretendardRegular from "../assets/fonts/Pretendard-Regular.woff2";
import PretendardMedium from "../assets/fonts/Pretendard-Medium.woff2";
import PretendardSemiBold from "../assets/fonts/Pretendard-SemiBold.woff2";
import PretendardBold from "../assets/fonts/Pretendard-Bold.woff2";
import PretendardExtraBold from "../assets/fonts/Pretendard-ExtraBold.woff2";
import SuitRegular from "../assets/fonts/SUIT.woff2";

import { globalCss } from ".";

export const globalStyles = globalCss({
  "@font-face": [
    {
      fontFamily: "Pretendard",
      fontWeight: 300,
      src: `url(${PretendardLight})`,
    },
    {
      fontFamily: "Pretendard",
      fontWeight: 400,
      src: `url(${PretendardRegular})`,
    },
    {
      fontFamily: "Pretendard",
      fontWeight: 500,
      src: `url(${PretendardMedium})`,
    },
    {
      fontFamily: "Pretendard",
      fontWeight: 600,
      src: `url(${PretendardSemiBold})`,
    },
    {
      fontFamily: "Pretendard",
      fontWeight: 700,
      src: `url(${PretendardBold})`,
    },
    {
      fontFamily: "SUIT",
      src: `url(${SuitRegular})`,
    },
  ],
  "*": {
    fontFamily: "Pretendard",
    // fontWeight: 500,
  },
});
