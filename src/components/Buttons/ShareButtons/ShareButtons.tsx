import {
  FacebookShareButton as FBShareButton,
  FacebookIcon,
} from "react-share";
import { useLocation } from "react-router-dom";
import { BsFacebook } from "react-icons/bs";
import { HiOutlineLink } from "react-icons/hi";
import CopyToClipboard from "react-copy-to-clipboard";

import MainButton from "../MainButton/MainButton";

const getCurrentUrl = () => {
  const location = useLocation();
  return `${window.location.origin}${location.pathname}${location.search}${location.hash}`;
  // return `https://www.youtube.com/`;
};

export const FacebookShareButton: React.FC = () => {
  const currentUrl = getCurrentUrl();

  return (
    <FBShareButton url={currentUrl}>
      <FacebookIcon size={32} round />
    </FBShareButton>
  );
};

export const CopyURLToClipboardButton: React.FC = () => {
  const currentUrl = getCurrentUrl();

  return (
    <CopyToClipboard text={currentUrl}>
      <MainButton type="icon-only" icon={<HiOutlineLink />} className="mx-0" />
    </CopyToClipboard>
  );
};
