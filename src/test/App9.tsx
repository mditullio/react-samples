import Markdown from "markdown-to-jsx";
import React from "react";
import { AnimationIterationCountProperty } from "csstype";

class Article extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = { md: "" };
  }

  async componentDidMount() {
    const articleId = 1 + Math.round(Math.random());
    const file = await import(`./article-${articleId}.md`);
    const response = await fetch(file.default);
    const text = await response.text();

    this.setState({
      md: text
    });
  }

  render() {
    return (
      <div className="article">
        <Markdown>{this.state.md}</Markdown>
      </div>
    );
  }
}

export default Article;
