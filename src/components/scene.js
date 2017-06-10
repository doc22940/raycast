import PropTypes from "prop-types"
import Mousetrap from "mousetrap"
import React from "react"
import Column from "./column"

export default class Scene extends React.Component {
  constructor(props) {
    super(props)
    this.update = this.update.bind(this)
    this.renderScene = this.renderScene.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handleKeyUp = this.handleKeyUp.bind(this)
    this.state = {columns: [], keys: {}}
    this.styles = {
      height: props.height,
      width: props.width,
      border: "1px solid black",
      position: "relative"
    }
  }

  componentWillMount() {
    this.context.loop.subscribe(this.update)
    Mousetrap.bind(["w", "s", "a", "d"], this.handleKeyDown, "keydown")
    Mousetrap.bind(["w", "s", "a", "d"], this.handleKeyUp, "keyup")
  }

  componentDidMount() {
    this.renderScene()
  }

  componentWillUnmount() {
    this.context.loop.unsubscribe(this.update)
    Mousetrap.unbind(["w", "s", "a", "d"], "keydown")
    Mousetrap.unbind(["w", "s", "a", "d"], "keyup")
  }

  update(seconds) {
    if (this.state.w || this.state.s || this.state.a || this.state.d) {
      if (this.state.w) { this.props.player.moveForward() }
      if (this.state.s) { this.props.player.moveBackward() }
      if (this.state.a) { this.props.player.turnLeft() }
      if (this.state.d) { this.props.player.turnRight() }
      this.renderScene()
    }
  }

  handleKeyDown(event) {
    this.setState({[event.key]: true})
  }

  handleKeyUp(event) {
    this.setState({[event.key]: false})
  }

  renderScene() {
    this.setState({columns: this.props.player.castRays(this.props.map, this.props.fov, this.props.resolution)})
  }

  render() {
    return (
      <div style={this.styles}>
        {this.state.columns.map((ray, index) => {
          return (
            <Column
              color="#0000FF"
              distance={ray}
              key={index}
              mapHeight={this.props.map.height}
              number={index}
              resolution={this.props.resolution}
              screenHeight={400}
              screenWidth={720}
            />
          )
        })}
      </div>
    )
  }
}

Scene.contextTypes = {
  loop: PropTypes.object
}
