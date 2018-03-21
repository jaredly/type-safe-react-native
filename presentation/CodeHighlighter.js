
import React, {Component} from 'react'

const highlightStyle = `
  background-color: white;
  color: black;
  box-shadow: 5px 5px 0px white, -5px -5px 0 white, 5px -5px 0 white, -5px 5px 0 white
`

const wrap = text => {
  return '<span style="' + highlightStyle + '">' + text + '</span>'
}

const wrapLines = text => {
  const minLeft = text.split('\n')
    .slice(1)
    .map(line => line.match(/^\s*/)[0].length)
    .reduce((a, b) => Math.min(a, b), Infinity)
  return text.split('\n')
    .map((line, i) => {
      // const white = line.match(/^\s*/)[0]
      return i === 0
      ? wrap(line)
      // ? white + wrap(line.slice(white.length))
      : line.slice(0, minLeft) + wrap(line.slice(minLeft))
    })
    .join('\n')
}

const highlight = (code, activeIndex) => {
  return code.replace(/\$(\d)([^\$]+)\$/g, (_full, num, match) => {
    if (num == activeIndex) {
      return wrapLines(match)
    }
    return `<span style="
      position: absolute;
      width: 3px;
      height: 3px;
      margin-left: -3px;
      margin-top: 3px;
      background-color: #aaa;
      "></span>` + match
  })
}

const format = (str) => {
  return str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
};

export default class CodeHighlighter extends Component {
  state = {
    active: 0
  }

  static contextTypes = {
    store: React.PropTypes.object.isRequired,
    updateNotes: React.PropTypes.func
  };

  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown);
  }

  isSlideActive() {
    return true
    // const slide = this.context.store.getState().route.slide;
    // return this.props.slideIndex === parseInt(slide);
  }

  onKeyDown = e => {
    console.log(e.which)
    if (!this.isSlideActive()) {
      return;
    }

    let prev = this.state.active;
    let active = null;

    if (e.which === 38) {
      active = prev - 1;
    } else if (e.which === 40) {
      active = prev + 1;
    }

    if (active !== null) {
      e.preventDefault();
      this.setState({active});
    }
};

  render() {
    const {style, source, lang, className, ...rest} = this.props
    return <pre className={className + " language-"} {...rest} style={{
      ...this.props.style,
      textAlign: 'left',
      margin: 'auto',
      fontSize: '1.2rem',
      fontWeight: 'normal',
      fontFamily: 'Montserrat',
      minWidth: '100%',
      maxWidth: '800px',
    }}>
      <code
        dangerouslySetInnerHTML={{__html: highlight(format(this.props.source), this.state.active)}}
      />
    </pre>
  }
}