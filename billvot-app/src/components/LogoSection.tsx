import Logo from "../assets/logo.svg";
import LogoPrimary from "../assets/logo-primary.svg";
import { styled } from "../styles";

const BaseLogo = styled("img", {
  width: "120px",
  height: "120px",
});
function LogoSection({ primary = false }: { primary?: boolean }) {
  return <BaseLogo src={primary ? LogoPrimary : Logo} />;
}

export default LogoSection;
