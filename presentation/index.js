// Import React
import React from "react";

// Import Spectacle Core tags
import {
  BlockQuote,
  Cite,
  Deck,
  Heading,
  ListItem,
  List,
  Quote,
  Slide,
  Text
} from "spectacle";

// Import image preloader util
import preloader from "spectacle/lib/utils/preloader";
import * as convert from "./convertFromNm"

// Import theme
import createTheme from "spectacle/lib/themes/default";
// import createTheme from 'spectacle-theme-nova';
// import { theme } from "spectacle-theme-solarized-dark";

// Require CSS
require("normalize.css");
require("spectacle/lib/themes/default/index.css");


const images = {
  // city: require("../assets/city.jpg"),
};

preloader(images);

const colors = {
  primary: "#656565",
  secondary: "rgb(255, 142, 38)",
  tertiary: "#00539e",
  quartenary: "#CECECE"
}

const theme = createTheme(colors, {
  primary: "Montserrat",
  secondary: "Montserrat",
  tertiary: "Montserrat",
});

theme.screen.components.quote.fontSize = '3.5rem'
theme.screen.components.quote.fontWeight = '400'
theme.screen.components.quote.lineHeight = '1.3'
theme.screen.components.codePane.pre.minWidth = 'unset'
theme.screen.components.codePane.pre.fontSize = '1.2rem'
theme.screen.components.code.minWidth = 'unset'
theme.screen.components.list.color = colors.primary
theme.screen.components.table.textAlign = 'left'
theme.screen.components.table.textAlign = 'left'
theme.screen.components.tableItem.fontSize = '2rem'
theme.screen.components.tableItem.padding = '8px 4px'
theme.screen.components.listItem.padding = '16px 0'
theme.screen.fullscreen.zIndex = 2000
theme.screen.components.heading.h3.fontSize = '4rem'
theme.screen.components.text.lineHeight = '1.5'
theme.screen.components.heading.h4.fontSize = '3.5rem'
theme.screen.global.body.backgroundColor = 'white'
theme.screen.global.body.color = colors.primary

export default class Presentation extends React.Component {
  render() {
    const nodes = []
    convert.collectSlideNodes(require('../talk.nm.json'), [], nodes)
    const slides = nodes.map(convert.nodeToSlide)
    console.log('slides', slides)
    return (
      <div>
        <Deck
          transition={["fade"]}
          transitionDuration={300}
          progress="number"
          theme={theme}
          children={slides}
        />
        <div style={{
          position: 'absolute',
          bottom: '16px',
          left: '40px',
          fontSize: '36px',
          display: 'flex',
          flexDirection: 'row',
        }}>
          <a style={{
            textDecoration: 'none',
          }} href="https://twitter.com/@jaredforsyth">@jaredforsyth</a>
          <div style={{width: '32px'}}/>
          {/*
          <a style={{
            textDecoration: 'none',
          }} href="https://jaredforsyth.com/reactiveconf-reasonml">jaredforsyth.com/reactiveconf-reasonml</a>
          */}

        </div>
      </div>
    );
  }
}
