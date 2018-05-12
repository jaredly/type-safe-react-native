
import React, {Component} from 'react'

const background = '#e1e1e1';
const dx = 3;
const dy = 5;
const highlightStyle = `
  background-color: ${background};
  color: black;
  box-shadow: ${dx}px ${dy}px 0px ${background}, -${dx}px -${dy}px 0 ${background}, ${dx}px -${dy}px 0 ${background}, -${dx}px ${dy}px 0 ${background}
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

const rx = /\$(\d)([^\$]+)\$/g

const countHighlights = code => {
  let x = 0
  code.replace(rx, (_full, num) => x = Math.max(+num, x));
  return x
};

const highlight = (code, activeIndex) => {
  return code.replace(rx, (_full, num, match) => {
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

const cache = {}

const hashCode = string => {
  if (cache[string]) {
    return cache[string]
  }
  let hash = 0;
  if (string.length == 0) {
      return hash;
  }
  for (let i = 0; i < string.length; i++) {
      const char = string.charCodeAt(i);
      hash = ((hash<<5)-hash)+char;
      hash = hash & hash; // Convert to 32bit integer
  }
  cache[string] = hash
  return hash;
}

export default class CodeHighlighter extends Component {
  state = {
    active: this.getStorageItem() || 0
  }
  constructor(props) {
    super(props)
    this.highlightCount = countHighlights(props.source)
  }

  static contextTypes = {
    store: React.PropTypes.object.isRequired,
    updateNotes: React.PropTypes.func
  };

  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('storage', this.onStorage);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('storage', this.onStorage);
  }

  onStorage = e => {
    if (e.key === this.getStorageId()) {
      this.setState({active: +e.newValue});
    }
  }

  getStorageId() {
    return '' + hashCode(this.props.source)
    // return 'code-slide:' + this.props.slideIndex;
  }

  getStorageItem() {
    return +localStorage.getItem(this.getStorageId());
  }

  setStorageItem(value) {
    return localStorage.setItem(this.getStorageId(), '' + value);
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
      active = prev === 0 ? this.highlightCount : Math.max(0, prev - 1);
    } else if (e.which === 40) {
      active = prev >= this.highlightCount ? 0 : prev + 1;
    } else if (e.key == '0') {
      active = 0;
    }

    if (active !== null) {
      e.preventDefault();
      this.setState({active});
      this.setStorageItem(active)
    }
};

  render() {
    const {style, source, lang, className, ...rest} = this.props
    return <pre className={className + " language-"} {...rest} style={{
      minWidth: '100%',
      maxWidth: '800px',
      ...this.props.style,
      textAlign: 'left',
      margin: 'auto',
      fontSize: '1.2rem',
      fontWeight: 'normal',
      fontFamily: 'Montserrat',
    }}>
      <code
        dangerouslySetInnerHTML={{__html: highlight(format(this.props.source), this.state.active)}}
      />
    </pre>
  }
}