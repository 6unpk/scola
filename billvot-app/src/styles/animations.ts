import { globalCss } from "./index";

export const animationStyles = globalCss({
  ".route-container": {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "white",
    overflow: "hidden",
  },
  ".page-forward-enter": {
    opacity: 1,
    transform: "translateX(100%)",
    boxShadow: "-5px 0 15px rgba(0, 0, 0, 0.1)",
  },
  ".page-forward-enter-active": {
    opacity: 1,
    transform: "translateX(0)",
    transition: "transform 300ms cubic-bezier(0.17, 0.67, 0.16, 0.99)",
    boxShadow: "-5px 0 15px rgba(0, 0, 0, 0.1)",
  },
  ".page-forward-exit": {
    opacity: 1,
    transform: "translateX(0)",
    zIndex: -1,
  },
  ".page-forward-exit-active": {
    opacity: 0.8,
    transform: "translateX(-30%)",
    transition:
      "transform 300ms cubic-bezier(0.17, 0.67, 0.16, 0.99), opacity 300ms ease",
    zIndex: -1,
  },
  ".page-backward-enter": {
    opacity: 1,
    transform: "translateX(0)",
    zIndex: -1,
  },
  ".page-backward-enter-active": {
    opacity: 1,
    transform: "translateX(0)",
    transition: "transform 300ms cubic-bezier(0.17, 0.67, 0.16, 0.99)",
    zIndex: -1,
  },
  ".page-backward-exit": {
    opacity: 1,
    transform: "translateX(0)",
    boxShadow: "-5px 0 15px rgba(0, 0, 0, 0.1)",
    zIndex: 1,
  },
  ".page-backward-exit-active": {
    opacity: 1,
    transform: "translateX(100%)",
    transition: "transform 300ms cubic-bezier(0.17, 0.67, 0.16, 0.99)",
    boxShadow: "-5px 0 15px rgba(0, 0, 0, 0.1)",
    zIndex: 1,
  },
  ".no-animation-enter": {
    opacity: 1,
  },
  ".no-animation-enter-active": {
    opacity: 1,
  },
  ".no-animation-exit": {
    opacity: 1,
  },
  ".no-animation-exit-active": {
    opacity: 1,
  },
});
