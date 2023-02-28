import tw from "twin.macro";
import { createGlobalStyle } from "styled-components";

const StylesBase = createGlobalStyle`
  .light {
    --bg-primary: #F8F8FB;
    --bg-secondary: #FFFFFF;
    --bg-tertiary: #373B53;
    --bg-color: #373B53;
    --text-primary: #0C0E16;
    --text-secondary: #7E88C3;
    --text-tertiary: #888EB0;

  }
  .dark {
    --bg-primary: #141625;
    --bg-secondary: #1E2139;
    --bg-tertiary: #1E2139;
    --bg-color: #0C0E16;
    --text-primary: #FFFFFF;
    --text-secondary: #DFE3FA;
    --text-tertiary: #DFE3FA;
    
  }
  body {
    ${tw`bg-primary text-primary transition-all duration-200`};
  }
`;

export default StylesBase;
